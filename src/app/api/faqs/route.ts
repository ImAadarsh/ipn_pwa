import { NextResponse } from 'next/server';
import mysql, { RowDataPacket } from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

interface FAQ {
  id: number;
  name: string; // This will be the question
  description: string; // This will be the answer
}

export async function GET() {
  const connection = await mysql.createConnection(dbConfig);

  try {
    const [faqs] = await connection.execute<RowDataPacket[]>(
      `SELECT id, name, description FROM faqs ORDER BY created_at ASC`
    );

    return NextResponse.json({
      success: true,
      data: faqs as FAQ[],
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch FAQs' },
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
} 