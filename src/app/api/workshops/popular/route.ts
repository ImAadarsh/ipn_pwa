import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: '82.180.142.204',
  user: 'u954141192_ipnacademy',
  password: 'x?OR+Q2/D',
  database: 'u954141192_ipnacademy'
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    
    const connection = await mysql.createConnection(dbConfig);
    
    try {
      const [workshops] = await connection.execute(`
        SELECT 
          w.*,
          t.name as trainer_name,
          t.designation as trainer_designation,
          t.image as trainer_image,
          t.about as trainer_description,
          COUNT(p.id) as subscription_count
        FROM workshops w
        LEFT JOIN trainers t ON w.trainer_id = t.id
        LEFT JOIN payments p ON w.id = p.workshop_id AND p.payment_status = 1
        WHERE w.is_deleted = 0
        AND w.status = 1
        AND w.price != 0
        GROUP BY w.id
        ORDER BY subscription_count DESC, w.start_date ASC
        ${limit ? `LIMIT ${limit}` : ''}
      `);

      return NextResponse.json({
        success: true,
        workshops
      });
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error('Error fetching popular workshops:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch popular workshops' },
      { status: 500 }
    );
  }
} 