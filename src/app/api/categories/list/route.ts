import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: '82.180.142.204',
  user: 'u954141192_ipnacademy',
  password: 'x?OR+Q2/D',
  database: 'u954141192_ipnacademy'
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