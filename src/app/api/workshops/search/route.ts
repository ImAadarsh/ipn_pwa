import {NextRequest, NextResponse} from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const month = searchParams.get('month') || '';

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
        t.about as trainer_description
      FROM workshops w
      LEFT JOIN trainers t ON w.trainer_id = t.id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (query) {
      sql += `
        AND (
          w.name LIKE ? OR
          w.description LIKE ? OR
          t.name LIKE ? OR
          t.designation LIKE ?
        )
      `;
      const searchPattern = `%${query}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (month) {
      sql += ` AND MONTH(w.start_date) = ?`;
      params.push(month);
    }

    sql += ` ORDER BY w.start_date DESC`;

    const [rows] = await connection.execute(sql, params);
    await connection.end();

    return NextResponse.json({
      success: true,
      workshops: rows,
    });
  } catch (error) {
    console.error('Error searching workshops:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to search workshops',
      },
      {status: 500}
    );
  }
} 