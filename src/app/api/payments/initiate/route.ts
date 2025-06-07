import {NextResponse} from 'next/server';
import mysql, {ResultSetHeader, RowDataPacket} from 'mysql2/promise';
import crypto from 'crypto';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// PhonePe Demo Credentials
const PHONEPE_MERCHANT_ID = 'IPNACADEMYONLINE';
const PHONEPE_SALT_KEY = '6afd41a3-e15c-4241-907e-0fcd4f97a03f';
const PHONEPE_SALT_INDEX = 1;
const PHONEPE_BASE_URL = 'https://api.phonepe.com/apis/hermes/pg/v1';

function generateVerifyToken() {
  return Math.floor(Math.random() * (9999999999999999 - 9000000000009 + 1)) + 9000000000009;
}

function generateXVerifyHeader(payload: string) {
  const data = payload + '/pg/v1/pay' + PHONEPE_SALT_KEY;
  const sha256 = crypto.createHash('sha256').update(data).digest('hex');
  return sha256 + '###' + PHONEPE_SALT_INDEX;
}

export async function POST(request: Request) {
  let connection;
  try {
    const body = await request.json();
    const {cart_id, workshop_id, user_id, amount, coupon_code, name, email, mobile} = body;

    if (!cart_id || !workshop_id || !user_id || !amount || !name || !email || !mobile) {
      return NextResponse.json(
        {success: false, message: 'Missing required fields'},
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
    const transaction_id = Math.floor(Math.random() * (9999999999999999 - 9000000000009 + 1)) + 9000000000009;

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

    // Prepare PhonePe payload
    const payload = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId: `IPN_${transaction_id}`,
      merchantUserId: user_id,
      amount: amount * 100, // Convert to paise
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/verify?token=${verify_token}`,
      redirectMode: 'POST',
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/webhook`,
      mobileNumber: mobile,
      paymentInstrument: {
        type: 'PAY_PAGE',
      },
    };

    const payloadString = JSON.stringify(payload);
    const base64Payload = Buffer.from(payloadString).toString('base64');
    const xVerifyHeader = generateXVerifyHeader(base64Payload);

    // Make request to PhonePe
    const response = await fetch(`${PHONEPE_BASE_URL}/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerifyHeader,
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        request: base64Payload,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('PhonePe API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        url: `${PHONEPE_BASE_URL}/pay`,
        headers: {
          'X-VERIFY': xVerifyHeader,
        },
      });
      throw new Error(`PhonePe API error: ${response.status} ${response.statusText}`);
    }

    const phonepeResponse = await response.json();
    console.log('PhonePe Response:', phonepeResponse);

    if (!phonepeResponse.success || !phonepeResponse.data?.instrumentResponse?.redirectInfo?.url) {
      console.error('PhonePe Error:', phonepeResponse);
      throw new Error(phonepeResponse.message || 'Failed to initiate payment with PhonePe');
    }

    // Update payment with PhonePe URL
    await connection.execute<ResultSetHeader>(
      `UPDATE payments 
       SET url = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [phonepeResponse.data.instrumentResponse.redirectInfo.url, paymentResult.insertId]
    );

    // Update cart with PhonePe URL
    await connection.execute<ResultSetHeader>(
      `UPDATE carts 
       SET url = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [phonepeResponse.data.instrumentResponse.redirectInfo.url, cart_id]
    );

    return NextResponse.json({
      success: true,
      url: phonepeResponse.data.instrumentResponse.redirectInfo.url,
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