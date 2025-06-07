import { NextResponse } from 'next/server';
import mysql, { RowDataPacket } from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

interface FAQ extends RowDataPacket {
  id: number;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export async function GET() {
  try {
    // Connect to database
    const connection = await mysql.createConnection(dbConfig);

    try {
      // Fetch FAQs from database
      const [faqs] = await connection.execute<FAQ[]>(
        'SELECT * FROM faqs ORDER BY id ASC'
      );

      return NextResponse.json({
        success: true,
        faqs: faqs.map(faq => ({
          id: faq.id,
          title: faq.name,
          content: faq.description
        }))
      });

    } finally {
      await connection.end();
    }

  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to fetch FAQs',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 