import {NextResponse} from 'next/server';
import mysql, {ResultSetHeader, RowDataPacket} from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Instamojo Credentials
const INSTAMOJO_API_KEY = process.env.INSTAMOJO_API_KEY;
const INSTAMOJO_AUTH_TOKEN = process.env.INSTAMOJO_AUTH_TOKEN;
const INSTAMOJO_BASE_URL = 'https://www.instamojo.com/api/1.1';

function generateVerifyToken() {
  return Math.floor(Math.random() * (9999999999999999 - 9000000000009 + 1)) + 9000000000009;
}

export async function POST(request: Request) {
  let connection;
  try {
    const body = await request.json();
    const {cart_id, workshop_id, user_id, amount, coupon_code, name, email, mobile} = body;

    if (!cart_id || !workshop_id || !user_id || !amount || !name || !email || !mobile) {
      return NextResponse.json(
        {success: false, message: 'Missing required fields.'},
        {status: 400}
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Get workshop details for cpd and duration
    const [workshopRows] = await connection.execute<RowDataPacket[]>(
      'SELECT cpd, duration FROM workshops WHERE id = ?',
      [workshop_id]
    );

    if (!workshopRows.length) {
      return NextResponse.json(
        {success: false, message: 'Workshop not found'},
        {status: 404}
      );
    }

    const workshop = workshopRows[0];
    const verify_token = generateVerifyToken();

    // Create payment record
    const [paymentResult] = await connection.execute<ResultSetHeader>(
      `INSERT INTO payments (
        user_id,
        workshop_id,
        amount,
        payment_status,
        verify_token,
        cpd,
        duration,
        coupon_code,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, 0, ?, ?, ?, ?, NOW(), NOW())`,
      [
        user_id,
        workshop_id,
        amount,
        verify_token,
        workshop.cpd,
        workshop.duration,
        coupon_code || null,
      ]
    );

    // Update cart with payment details
    await connection.execute<ResultSetHeader>(
      `UPDATE carts 
       SET payment_id = ?,
           payment_status = 0,
           requesting_payment = 1,
           verify_token = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [paymentResult.insertId, verify_token, cart_id]
    );

    // Prepare Instamojo payload
    const payload = {
      purpose: `Workshop Payment - ${workshop_id}`,
      amount: amount,
      buyer_name: name,
      email: email,
      phone: mobile,
      redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/verify?token=${verify_token}`,
      webhook: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/webhook`,
      allow_repeated_payments: false,
      send_email: true,
      send_sms: true,
    };

    // Make request to Instamojo
    if (!INSTAMOJO_API_KEY || !INSTAMOJO_AUTH_TOKEN) {
      console.error('Missing Instamojo credentials:', {
        hasApiKey: !!INSTAMOJO_API_KEY,
        hasAuthToken: !!INSTAMOJO_AUTH_TOKEN
      });
      throw new Error('Instamojo API credentials are not configured');
    }

    const response = await fetch(`${INSTAMOJO_BASE_URL}/payment-requests/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': INSTAMOJO_API_KEY,
        'X-Auth-Token': INSTAMOJO_AUTH_TOKEN,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Instamojo API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(`Instamojo API error: ${response.status} ${response.statusText}`);
    }

    const instamojoResponse = await response.json();
    console.log('Instamojo Response:', instamojoResponse);

    if (!instamojoResponse.success || !instamojoResponse.payment_request?.longurl) {
      console.error('Instamojo Error:', instamojoResponse);
      throw new Error(instamojoResponse.message || 'Failed to initiate payment with Instamojo');
    }

    // Update payment with Instamojo URL
    await connection.execute<ResultSetHeader>(
      `UPDATE payments 
       SET url = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [instamojoResponse.payment_request.longurl, paymentResult.insertId]
    );

    // Update cart with Instamojo URL
    await connection.execute<ResultSetHeader>(
      `UPDATE carts 
       SET url = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [instamojoResponse.payment_request.longurl, cart_id]
    );

    return NextResponse.json({
      success: true,
      url: instamojoResponse.payment_request.longurl,
    });
  } catch (error) {
    console.error('Error initiating payment:', error);
    return NextResponse.json(
      {success: false, message: 'Failed to initiate payment'},
      {status: 500}
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
} 