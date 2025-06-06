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