import { NextResponse } from 'next/server';
import mysql, {RowDataPacket} from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

interface Coupon extends RowDataPacket {
  id: number;
  coupon_code: string;
  flat_discount: number;
  valid_till: string;
  count: number;
  school_id: number | null;
  workshop_id: number | null;
  workshop_type: number;
  is_visible: number;
  workshop_name?: string;
  school_name?: string;
}

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Connect to database
    const connection = await mysql.createConnection(dbConfig);

    try {
      // Fetch all visible coupons
      const [coupons] = await connection.execute<Coupon[]>(
        `SELECT 
          c.*,
          w.name as workshop_name,
          s.name as school_name
         FROM coupons c
         LEFT JOIN workshops w ON c.workshop_id = w.id
         LEFT JOIN schools s ON c.school_id = s.id
         WHERE c.is_visible = 1
         AND c.valid_till > NOW()
         ORDER BY c.created_at DESC`
      );

      return NextResponse.json({
        success: true,
        coupons: coupons
      });

    } finally {
      await connection.end();
    }

  } catch (error) {
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch coupons'
      },
      {status: 500}
    );
  }
} 