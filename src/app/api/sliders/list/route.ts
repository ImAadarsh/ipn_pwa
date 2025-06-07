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
      const [sliders] = await connection.execute(`
        SELECT * FROM sliders 
        ORDER BY created_at DESC
      `);

      return NextResponse.json({
        success: true,
        sliders
      });
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error('Error fetching sliders:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch sliders' },
      { status: 500 }
    );
  }
} 