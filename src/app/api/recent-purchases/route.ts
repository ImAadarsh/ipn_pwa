import { NextResponse } from 'next/server';
import mysql, { RowDataPacket } from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

interface RecentPurchase {
  user_name: string;
  workshop_name: string;
  purchase_date: string;
  user_profile: string;
  user_city: string;
}

export async function GET() {
  const connection = await mysql.createConnection(dbConfig);

  try {
    const [recentPurchases] = await connection.execute<RowDataPacket[]>(
      `SELECT
        u.name as user_name,
        w.name as workshop_name,
        p.created_at as purchase_date,
        u.profile as user_profile,
        u.city as user_city
      FROM payments p
      JOIN users u ON p.user_id = u.id
      JOIN workshops w ON p.workshop_id = w.id
      WHERE p.payment_status = 1
      ORDER BY p.created_at DESC
      LIMIT 10`
    );

    return NextResponse.json({
      success: true,
      data: recentPurchases as RecentPurchase[],
    });
  } catch (error) {
    console.error('Error fetching recent purchases:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch recent purchases' },
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
} 