import {NextResponse} from 'next/server';
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
    const {searchParams} = new URL(request.url);
    const workshopId = searchParams.get('workshop_id');

    if (!workshopId) {
      return NextResponse.json({
        success: false,
        message: 'Workshop ID is required',
      }, {status: 400});
    }

    const connection = await mysql.createConnection(dbConfig);

    // Get workshop type
    const [workshopRows] = await connection.execute(
      'SELECT type FROM workshops WHERE id = ?',
      [workshopId]
    );

    if (!workshopRows || (workshopRows as any[]).length === 0) {
      await connection.end();
      return NextResponse.json({
        success: false,
        message: 'Workshop not found',
      }, {status: 404});
    }

    const workshopType = (workshopRows as any[])[0].type;

    // Get applicable coupons
    const [couponRows] = await connection.execute(
      `SELECT * FROM coupons 
       WHERE is_visible = 1 
       AND valid_till > NOW()
       AND count > 0
       AND (
         (workshop_id IS NULL AND workshop_type = ?) OR
         (workshop_id = ?)
       )
       ORDER BY flat_discount DESC`,
      [workshopType, workshopId]
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      coupons: couponRows,
    });
  } catch (error) {
    console.error('Error fetching applicable coupons:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch applicable coupons',
    }, {status: 500});
  }
} 