import {NextResponse} from 'next/server';
import mysql, {ResultSetHeader, RowDataPacket} from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export async function POST(request: Request) {
  let connection;
  try {
    const body = await request.json();
    const {payment_id, payment_status} = body;

    if (!payment_id || !payment_status) {
      return NextResponse.json(
        {success: false, message: 'Missing required fields.'},
        {status: 400}
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Get payment details
    const [paymentRows] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM payments WHERE id = ?',
      [payment_id]
    );

    if (!paymentRows.length) {
      return NextResponse.json(
        {success: false, message: 'Payment not found'},
        {status: 404}
      );
    }

    // Start transaction
    await connection.beginTransaction();

    try {
      // Update payment status
      await connection.execute<ResultSetHeader>(
        `UPDATE payments 
         SET payment_status = ?,
             updated_at = NOW()
         WHERE id = ?`,
        [payment_status === 'Credit' ? 1 : 2, payment_id]
      );

      // Update cart status
      await connection.execute<ResultSetHeader>(
        `UPDATE carts 
         SET payment_status = ?,
             is_bought = ?,
             updated_at = NOW()
         WHERE payment_id = ?`,
        [payment_status === 'Credit' ? 1 : 2, payment_status === 'Credit' ? 1 : 0, payment_id]
      );

      await connection.commit();

      return NextResponse.json({
        success: true,
        message: 'Payment status updated successfully',
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      {success: false, message: 'Failed to process webhook'},
      {status: 500}
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
} 