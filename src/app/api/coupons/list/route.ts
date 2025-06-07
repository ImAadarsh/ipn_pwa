import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export async function GET() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    try {
      const [coupons] = await connection.execute(`
        SELECT 
          c.*,
          w.name as workshop_name,
          s.name as school_name
        FROM coupons c
        LEFT JOIN workshops w ON c.workshop_id = w.id
        LEFT JOIN schools s ON c.school_id = s.id
        WHERE c.is_visible = 1
        AND valid_till > Now()
        AND workshop_type = 0
        ORDER BY c.created_at DESC
      `);

      return NextResponse.json({
        success: true,
        coupons
      });
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
} 