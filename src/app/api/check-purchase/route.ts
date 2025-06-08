import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Database configuration (assuming this is available in your project)
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ipn_academy',
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const workshopId = searchParams.get('workshopId');

    if (!userId || !workshopId) {
      return NextResponse.json({ success: false, message: 'Missing userId or workshopId' }, { status: 400 });
    }

    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(
      'SELECT COUNT(*) as count FROM payments WHERE user_id = ? AND workshop_id = ?',
      [userId, workshopId]
    );
    await connection.end();

    const isPurchased = (rows as any[])[0].count > 0;

    return NextResponse.json({ success: true, isPurchased });
  } catch (error) {
    console.error('Error checking purchase status:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
} 