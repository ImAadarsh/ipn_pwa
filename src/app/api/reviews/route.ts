import { NextResponse } from 'next/server';
import mysql, { RowDataPacket } from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

interface Review {
  id: number;
  rating: number;
  comment: string;
  user_name: string;
  user_profile: string;
  trainer_name: string;
  created_at: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const excludeIds = searchParams.get('exclude_ids')?.split(',') || [];
  const excludeImg = 'oqDdQPGw3UZnIlmNZojNfTvHHVA9KHjO1OqDHJE6'; // Specific string to exclude

  const offset = (page - 1) * limit;
  const excludeIdsStr = excludeIds.length > 0 ? `AND f.id NOT IN (${excludeIds.join(',')})` : '';

  const connection = await mysql.createConnection(dbConfig);

  try {
    // Simplified query with the same joins and conditions
    const query = `
      SELECT 
        f.id, f.rating, f.comment, f.created_at,
        u.name as user_name, u.profile as user_profile,
        t.name as trainer_name
      FROM feedback f
      LEFT JOIN users u ON f.user_id = u.id
      INNER JOIN trainers t ON f.trainer_id = t.id
      WHERE LENGTH(f.comment) > 50
        AND (u.profile IS NULL OR INSTR(u.profile, ?) = 0)
        ${excludeIdsStr}
      ORDER BY RAND()
      LIMIT ? OFFSET ?
    `;

    const [reviews] = await connection.execute<RowDataPacket[]>(query, [
      excludeImg,
      limit,
      offset
    ]);

    // Simplified count query
    const countQuery = `
      SELECT COUNT(*) as total
      FROM feedback f
      LEFT JOIN users u ON f.user_id = u.id
      INNER JOIN trainers t ON f.trainer_id = t.id
      WHERE LENGTH(f.comment) > 50
        AND (u.profile IS NULL OR INSTR(u.profile, ?) = 0)
        ${excludeIdsStr}
    `;

    const [totalCount] = await connection.execute<RowDataPacket[]>(countQuery, [
      excludeImg
    ]);

    return NextResponse.json({
      success: true,
      data: {
        reviews: reviews as Review[],
        pagination: {
          total: totalCount[0]?.total || 0,
          page,
          limit,
          totalPages: Math.ceil((totalCount[0]?.total || 0) / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch reviews' },
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
} 