import {NextResponse} from 'next/server';
import mysql, {RowDataPacket, ResultSetHeader} from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

interface WorkshopRow extends RowDataPacket {
  type: number;
  price: number;
  price_2: number;
}

interface CouponRow extends RowDataPacket {
  id: number;
  coupon_code: string;
  flat_discount: number;
  valid_till: string;
}

interface UsageRow extends RowDataPacket {
  usage_count: number;
}

export async function POST(request: Request) {
  let connection;
  try {
    const body = await request.json();
    const {coupon_code, workshop_id, user_id, cart_id} = body;

    if (!workshop_id || !user_id) {
      return NextResponse.json(
        {success: false, message: 'Missing required fields'},
        {status: 400}
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Get workshop details
    const [workshopRows] = await connection.execute<WorkshopRow[]>(
      'SELECT type, price, price_2 FROM workshops WHERE id = ?',
      [workshop_id]
    );

    if (!workshopRows.length) {
      return NextResponse.json(
        {success: false, message: 'Workshop not found'},
        {status: 404}
      );
    }

    const workshop = workshopRows[0];
    const workshopType = workshop.type;
    const basePrice = workshopType === 0 ? workshop.price : workshop.price_2;
    let discount = 0;
    let coupon: CouponRow | null = null;

    // If coupon code is provided, validate and apply it
    if (coupon_code) {
      const [couponRows] = await connection.execute<CouponRow[]>(
        `SELECT * FROM coupons 
         WHERE coupon_code = ? 
         AND (workshop_id = ? OR workshop_id IS NULL)
         AND (workshop_type = ? OR workshop_type IS NULL)
         AND valid_till > NOW()
         AND (count > 0 OR count IS NULL)`,
        [coupon_code, workshop_id, workshopType]
      );

      if (!couponRows.length) {
        return NextResponse.json(
          {success: false, message: 'Invalid or expired coupon'},
          {status: 400}
        );
      }

      coupon = couponRows[0];

      // Check if user has already used this coupon
      const [usageRows] = await connection.execute<UsageRow[]>(
        `SELECT COUNT(*) as usage_count 
         FROM payments 
         WHERE user_id = ? 
         AND coupon_code = ?`,
        [user_id, coupon_code]
      );

      if (usageRows[0].usage_count > 0) {
        return NextResponse.json(
          {success: false, message: 'You have already used this coupon'},
          {status: 400}
        );
      }

      discount = coupon.flat_discount;
    }

    let cartResult: ResultSetHeader;

    // If cart_id is provided, update existing cart
    if (cart_id) {
      // Start a transaction
      await connection.beginTransaction();

      try {
        // Get total original price from items
        const [itemsRows] = await connection.execute<RowDataPacket[]>(
          `SELECT SUM(price) as total_price FROM items WHERE cart_id = ?`,
          [cart_id]
        );
        const totalOriginalPrice = itemsRows[0].total_price || 0;

        // Calculate final price after discount
        const finalPrice = Math.max(0, totalOriginalPrice - discount);

        // Update cart with final price
        [cartResult] = await connection.execute<ResultSetHeader>(
          `UPDATE carts 
           SET coupon_code = ?, 
               discount = ?, 
               price = ?,
               updated_at = NOW()
           WHERE id = ? AND user_id = ?`,
          [coupon_code || null, discount, finalPrice, cart_id, user_id]
        );

        // Update cart items with original prices and discount
        await connection.execute<ResultSetHeader>(
          `UPDATE items 
           SET coupon_code = ?,
               discount = ?,
               updated_at = NOW()
           WHERE cart_id = ?`,
          [coupon_code || null, discount, cart_id]
        );

        // Commit the transaction
        await connection.commit();

        // Fetch updated cart
        const [updatedCartRows] = await connection.execute<RowDataPacket[]>(
          `SELECT * FROM carts WHERE id = ?`,
          [cart_id]
        );

        return NextResponse.json({
          success: true,
          coupon: coupon ? {
            id: coupon.id,
            coupon_code: coupon.coupon_code,
            flat_discount: coupon.flat_discount,
            valid_till: coupon.valid_till,
          } : null,
          cart: updatedCartRows[0],
        });
      } catch (error) {
        // Rollback in case of error
        await connection.rollback();
        throw error;
      }
    } else {
      // Create new cart entry with final price
      const finalPrice = Math.max(0, basePrice - discount);
      [cartResult] = await connection.execute<ResultSetHeader>(
        `INSERT INTO carts (
          user_id, 
          is_bought, 
          coupon_code, 
          discount, 
          price, 
          created_at, 
          updated_at
        ) VALUES (?, 0, ?, ?, ?, NOW(), NOW())`,
        [user_id, coupon_code || null, discount, finalPrice]
      );

      // Create cart item with original price
      await connection.execute<ResultSetHeader>(
        `INSERT INTO items (
          cart_id,
          workshop_id,
          price,
          coupon_code,
          discount,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [cartResult.insertId, workshop_id, basePrice, coupon_code || null, discount]
      );

      // Fetch new cart
      const [newCartRows] = await connection.execute<RowDataPacket[]>(
        `SELECT * FROM carts WHERE id = ?`,
        [cartResult.insertId]
      );

      return NextResponse.json({
        success: true,
        coupon: coupon ? {
          id: coupon.id,
          coupon_code: coupon.coupon_code,
          flat_discount: coupon.flat_discount,
          valid_till: coupon.valid_till,
        } : null,
        cart: newCartRows[0],
      });
    }
  } catch (error) {
    console.error('Error applying coupon:', error);
    return NextResponse.json(
      {success: false, message: 'Failed to apply coupon'},
      {status: 500}
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
} 