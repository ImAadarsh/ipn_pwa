import {NextResponse} from 'next/server';
import mysql, {RowDataPacket} from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export async function GET(request: Request) {
  let connection;
  try {
    const {searchParams} = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        {success: false, message: 'Missing verify token'},
        {status: 400}
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Get payment details
    const [paymentRows] = await connection.execute<RowDataPacket[]>(
      `SELECT p.*, c.id as cart_id, c.is_bought, c.payment_status as cart_payment_status
       FROM payments p
       LEFT JOIN carts c ON p.id = c.payment_id
       WHERE p.verify_token = ?`,
      [token]
    );

    if (!paymentRows.length) {
      return NextResponse.json(
        {success: false, message: 'Payment not found'},
        {status: 404}
      );
    }

    const payment = paymentRows[0];

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount,
        payment_status: payment.payment_status,
        cart_id: payment.cart_id,
        is_bought: payment.is_bought,
        cart_payment_status: payment.cart_payment_status,
      },
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      {success: false, message: 'Failed to verify payment'},
      {status: 500}
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
} 