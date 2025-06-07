import {NextRequest, NextResponse} from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(request: NextRequest) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const sql = `
      SELECT id, name
      FROM workshops
      WHERE type = 0
      AND start_date > NOW()
      ORDER BY start_date ASC
      LIMIT 7
    `;

    const [rows] = await connection.execute(sql);
    await connection.end();

    return NextResponse.json({
      success: true,
      workshops: rows,
    });
  } catch (error) {
    console.error('Error fetching upcoming workshops:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch upcoming workshops',
      },
      {status: 500}
    );
  }
} 