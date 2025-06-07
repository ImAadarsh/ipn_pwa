import {NextResponse} from 'next/server';
import mysql, {ResultSetHeader, RowDataPacket} from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export async function DELETE(request: Request) {
  let connection;
  try {
    const {searchParams} = new URL(request.url);
    const cart_id = searchParams.get('cart_id');
    const workshop_id = searchParams.get('workshop_id');

    if (!cart_id || !workshop_id) {
      return NextResponse.json(
        {success: false, message: 'Missing required parameters'},
        {status: 400}
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Start transaction
    await connection.beginTransaction();

    try {
      // Get item price
      const [itemRows] = await connection.execute(
        'SELECT price FROM items WHERE cart_id = ? AND workshop_id = ?',
        [cart_id, workshop_id]
      ) as [RowDataPacket[], any];

      if (!itemRows.length) {
        throw new Error('Item not found');
      }

      const itemPrice = itemRows[0].price;

      // Delete the item
      await connection.execute<ResultSetHeader>(
        'DELETE FROM items WHERE cart_id = ? AND workshop_id = ?',
        [cart_id, workshop_id]
      );

      // Update cart price
      await connection.execute<ResultSetHeader>(
        `UPDATE carts 
         SET price = price - ?,
             updated_at = NOW()
         WHERE id = ?`,
        [itemPrice, cart_id]
      );

      // Check if cart is empty
      const [remainingItems] = await connection.execute(
        'SELECT COUNT(*) as count FROM items WHERE cart_id = ?',
        [cart_id]
      ) as [RowDataPacket[], any];

      // If cart is empty, delete it
      if (remainingItems[0].count === 0) {
        await connection.execute<ResultSetHeader>(
          'DELETE FROM carts WHERE id = ?',
          [cart_id]
        );
      }

      await connection.commit();

      return NextResponse.json({
        success: true,
        message: 'Item removed successfully',
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error removing item:', error);
    return NextResponse.json(
      {success: false, message: 'Failed to remove item'},
      {status: 500}
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
} 