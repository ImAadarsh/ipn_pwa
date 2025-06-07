import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') || '6';
    const type = searchParams.get('type') || '1'; // 1 for completed, 0 for live

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    let sql = `
      SELECT 
        w.*,
        t.name as trainer_name,
        t.designation as trainer_designation,
        t.image as trainer_image,
        t.about as trainer_description,
        COUNT(p.id) as purchase_count
      FROM workshops w
      LEFT JOIN trainers t ON w.trainer_id = t.id
      LEFT JOIN payments p ON w.id = p.workshop_id
      WHERE w.type = ?
      AND w.price != 0
    `;

    const params: any[] = [type];

    if (type === '1') {
      // For completed workshops, get most bought in last 45 days
      sql += ` AND p.created_at >= DATE_SUB(NOW(), INTERVAL 45 DAY)`;
    }

    sql += `
      GROUP BY w.id
      ORDER BY purchase_count DESC
      LIMIT ?
    `;
    params.push(parseInt(limit));

    const [rows] = await connection.execute(sql, params);
    await connection.end();

    return NextResponse.json({
      success: true,
      workshops: rows,
    });
  } catch (error) {
    console.error('Error fetching popular workshops:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch popular workshops',
      },
      {status: 500}
    );
  }
} 