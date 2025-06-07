import { NextResponse } from 'next/server';
import mysql, { RowDataPacket } from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

interface Workshop extends RowDataPacket {
  id: number;
  rlink: string | null; // Recording link
  start_date: string; // Workshop start date
}

interface Payment extends RowDataPacket {
  created_at: string; // Payment date
  payment_status: number;
}

interface VideoException extends RowDataPacket {
  id: number;
  user_id: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const workshopId = searchParams.get('workshopId');

  if (!userId || !workshopId) {
    return NextResponse.json(
      { success: false, message: 'User ID and Workshop ID are required' },
      { status: 400 }
    );
  }

  const connection = await mysql.createConnection(dbConfig);

  try {
    // 1. Check if user is in video_exception table (always has access)
    const [exceptionUsers] = await connection.execute<VideoException[]>(
      'SELECT id FROM video_exception WHERE user_id = ?',
      [userId]
    );

    if (exceptionUsers.length > 0) {
      // User is an exception, grant access
      const [workshopData] = await connection.execute<Workshop[]>(
        'SELECT rlink FROM workshops WHERE id = ?',
        [workshopId]
      );
      const rlink = workshopData[0]?.rlink;

      if (rlink && rlink !== '#') {
        return NextResponse.json({ 
          success: true, 
          url: rlink,
          accessType: 'exception'
        });
      } else {
        return NextResponse.json(
          { success: false, message: 'Recording link not available' },
          { status: 404 }
        );
      }
    }

    // 2. For regular users, apply the 2-week restriction
    const [workshopData] = await connection.execute<Workshop[]>(
      'SELECT start_date, rlink FROM workshops WHERE id = ?',
      [workshopId]
    );
    const workshop = workshopData[0];

    if (!workshop) {
      return NextResponse.json(
        { success: false, message: 'Workshop not found' },
        { status: 404 }
      );
    }

    if (!workshop.rlink || workshop.rlink === '#') {
      return NextResponse.json(
        { success: false, message: 'Recording link not available' },
        { status: 404 }
      );
    }

    // Get payment information
    const [paymentData] = await connection.execute<Payment[]>(
      'SELECT created_at, payment_status FROM payments WHERE user_id = ? AND workshop_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId, workshopId]
    );

    if (paymentData.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Payment not found' },
        { status: 404 }
      );
    }

    const payment = paymentData[0];
    if (payment.payment_status !== 1) {
      return NextResponse.json(
        { success: false, message: 'Payment not completed' },
        { status: 403 }
      );
    }

    // Calculate access period
    const paymentDate = new Date(payment.created_at);
    const workshopStartDate = new Date(workshop.start_date);
    const referenceDate = paymentDate > workshopStartDate ? paymentDate : workshopStartDate;
    const twoWeeksLater = new Date(referenceDate.getTime() + 14 * 24 * 60 * 60 * 1000);
    const now = new Date();

    if (now > twoWeeksLater) {
      return NextResponse.json({
        success: false,
        message: 'Access expired',
        details: {
          paymentDate: paymentDate.toISOString(),
          workshopStartDate: workshopStartDate.toISOString(),
          accessUntil: twoWeeksLater.toISOString(),
          daysRemaining: 0
        }
      }, { status: 403 });
    }

    // Calculate days remaining
    const daysRemaining = Math.ceil((twoWeeksLater.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return NextResponse.json({
      success: true,
      url: workshop.rlink,
      accessType: 'regular',
      details: {
        paymentDate: paymentDate.toISOString(),
        workshopStartDate: workshopStartDate.toISOString(),
        accessUntil: twoWeeksLater.toISOString(),
        daysRemaining
      }
    });

  } catch (error) {
    console.error('Error in workshop-recording route:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while processing your request' },
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
} 