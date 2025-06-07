import {NextResponse} from 'next/server';
import mysql, {RowDataPacket, ResultSetHeader} from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

interface CartRow extends RowDataPacket {
  id: number;
  user_id: number;
  is_bought: number;
  coupon_code: string | null;
  discount: number;
  price: number;
  payment_id: string | null;
  payment_status: number;
  requesting_payment: number;
  order_id: string | null;
  verify_token: string | null;
  url: string | null;
  webhook: string | null;
  created_at: string;
  updated_at: string;
  item_id: number;
  workshop_id: number;
  item_price: number;
  item_coupon_code: string | null;
  item_discount: number;
}

export async function GET(request: Request) {
  let connection;
  try {
    const {searchParams} = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const workshop_id = searchParams.get('workshop_id');

    if (!user_id || !workshop_id) {
      return NextResponse.json(
        {success: false, message: 'Missing required parameters'},
        {status: 400}
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Get workshop price
    const [workshopRows] = await connection.execute<RowDataPacket[]>(
      'SELECT price FROM workshops WHERE id = ?',
      [workshop_id]
    );

    if (!workshopRows.length) {
      return NextResponse.json(
        {success: false, message: 'Workshop not found'},
        {status: 404}
      );
    }

    const workshopPrice = workshopRows[0].price;
    let cartRows: CartRow[] = [];

    // First check if user has any active cart
    const [existingCartRows] = await connection.execute<CartRow[]>(
      `SELECT c.*, i.id as item_id, i.workshop_id, i.price as item_price, i.coupon_code as item_coupon_code, i.discount as item_discount
       FROM carts c
       LEFT JOIN items i ON c.id = i.cart_id
       WHERE c.user_id = ? AND c.is_bought = 0
       ORDER BY c.created_at DESC
       LIMIT 1`,
      [user_id]
    );

    if (existingCartRows.length) {
      // Check if this workshop is already in the cart
      const workshopInCart = existingCartRows.some(row => row.workshop_id === parseInt(workshop_id));
      
      if (!workshopInCart) {
        // Add workshop to existing cart
        await connection.execute<ResultSetHeader>(
          `INSERT INTO items (
            cart_id,
            workshop_id,
            price,
            coupon_code,
            discount,
            created_at,
            updated_at
          ) VALUES (?, ?, ?, NULL, 0, NOW(), NOW())`,
          [existingCartRows[0].id, workshop_id, workshopPrice]
        );

        // Update cart price (original price without discount)
        await connection.execute<ResultSetHeader>(
          `UPDATE carts 
           SET price = price + ?,
               updated_at = NOW()
           WHERE id = ?`,
          [workshopPrice, existingCartRows[0].id]
        );

        // Fetch updated cart
        const [updatedCartRows] = await connection.execute<CartRow[]>(
          `SELECT c.*, i.id as item_id, i.workshop_id, i.price as item_price, i.coupon_code as item_coupon_code, i.discount as item_discount
           FROM carts c
           LEFT JOIN items i ON c.id = i.cart_id
           WHERE c.id = ?`,
          [existingCartRows[0].id]
        );
        cartRows = updatedCartRows;
      } else {
        cartRows = existingCartRows;
      }
    } else {
      // Create new cart if none exists
      const [newCartResult] = await connection.execute<ResultSetHeader>(
        `INSERT INTO carts (
          user_id, 
          is_bought, 
          coupon_code, 
          discount, 
          price, 
          created_at, 
          updated_at
        ) VALUES (?, 0, NULL, 0, ?, NOW(), NOW())`,
        [user_id, workshopPrice]
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
        ) VALUES (?, ?, ?, NULL, 0, NOW(), NOW())`,
        [newCartResult.insertId, workshop_id, workshopPrice]
      );

      // Fetch the newly created cart
      const [newCartRows] = await connection.execute<CartRow[]>(
        `SELECT c.*, i.id as item_id, i.workshop_id, i.price as item_price, i.coupon_code as item_coupon_code, i.discount as item_discount
         FROM carts c
         LEFT JOIN items i ON c.id = i.cart_id
         WHERE c.id = ?`,
        [newCartResult.insertId]
      );
      cartRows = newCartRows;
    }

    const cart = {
      id: cartRows[0].id,
      user_id: cartRows[0].user_id,
      is_bought: cartRows[0].is_bought,
      coupon_code: cartRows[0].coupon_code,
      discount: cartRows[0].discount,
      price: cartRows[0].price,
      payment_id: cartRows[0].payment_id,
      payment_status: cartRows[0].payment_status,
      requesting_payment: cartRows[0].requesting_payment,
      order_id: cartRows[0].order_id,
      verify_token: cartRows[0].verify_token,
      url: cartRows[0].url,
      webhook: cartRows[0].webhook,
      created_at: cartRows[0].created_at,
      updated_at: cartRows[0].updated_at,
      items: cartRows.map(row => ({
        id: row.item_id,
        workshop_id: row.workshop_id,
        price: row.item_price,
        coupon_code: row.item_coupon_code,
        discount: row.item_discount,
      })),
    };

    return NextResponse.json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      {success: false, message: 'Failed to fetch cart'},
      {status: 500}
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
} 