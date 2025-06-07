import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export const dynamic = 'force-dynamic';

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
          t.about as trainer_description
        FROM workshops w
        LEFT JOIN trainers t ON w.trainer_id = t.id
        WHERE w.type = 0 
        AND w.is_deleted = 0
        AND w.status = 1
        ORDER BY w.start_date ASC
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
    console.error('Error fetching live workshops:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch live workshops' },
      { status: 500 }
    );
  }
} 