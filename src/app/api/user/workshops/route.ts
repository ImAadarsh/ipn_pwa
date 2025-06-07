import {NextResponse} from 'next/server';
import mysql, {RowDataPacket} from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: '82.180.142.204',
  user: 'u954141192_ipnacademy',
  password: 'x?OR+Q2/D',
  database: 'u954141192_ipnacademy'
};

export async function GET(request: Request) {
  try {
    const {searchParams} = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        {success: false, message: 'User ID is required'},
        {status: 400}
      );
    }

    // Connect to database
    const connection = await mysql.createConnection(dbConfig);

    try {
      // Fetch workshops from payments and workshops tables
      const [workshops] = await connection.execute<RowDataPacket[]>(`
        SELECT 
          w.*,
          p.order_id,
          w.link,
          w.meeting_id,
          w.passcode
        FROM workshops w
        INNER JOIN payments p ON w.id = p.workshop_id
        WHERE p.user_id = ?
        AND p.payment_status = 1
        ORDER BY w.start_date DESC
      `, [userId]);

      return NextResponse.json({
        success: true,
        workshops
      });
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error('Error fetching workshops:', error);
    return NextResponse.json(
      {success: false, message: 'Failed to fetch workshops'},
      {status: 500}
    );
  }
} 