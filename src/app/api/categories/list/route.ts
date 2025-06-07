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
      const [categories] = await connection.execute(`
        SELECT 
          c.*,
          COUNT(DISTINCT w.id) as workshop_count 
        FROM categories c
        LEFT JOIN workshops w ON w.category_id = c.id AND w.is_deleted = 0
        GROUP BY c.id
        ORDER BY workshop_count DESC, c.name ASC
      `);

      return NextResponse.json({
        success: true,
        categories
      });
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
} 