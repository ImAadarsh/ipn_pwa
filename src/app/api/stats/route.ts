import { NextResponse } from 'next/server';
import mysql, { RowDataPacket } from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

interface Stats {
  total_users_count: number;
  workshops_count: number;
  countries_count: number;
  educators_count: number;
  cities_count: number;
  certifications_count: number;
  learning_hours_count: number;
}

export async function GET() {
  const connection = await mysql.createConnection(dbConfig);

  try {
    const [totalUsersResult] = await connection.execute<RowDataPacket[]>(
      "SELECT COUNT(DISTINCT id) as total_users FROM users"
    );
    const total_users_count = (totalUsersResult[0]?.total_users || 0) as number;

    const [workshopsResult] = await connection.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM workshops WHERE is_deleted=0 AND type=1"
    );
    const workshops_count = (workshopsResult[0]?.total || 0) as number;

    const countries_count = 52; // Fixed as per provided PHP code

    const [educatorsResult] = await connection.execute<RowDataPacket[]>(
      "SELECT COUNT(DISTINCT user_id) as total FROM payments WHERE payment_status=1"
    );
    const educators_count = (educatorsResult[0]?.total || 0) as number;

    const [citiesResult] = await connection.execute<RowDataPacket[]>(
      "SELECT COUNT(DISTINCT city) as total FROM users WHERE city IS NOT NULL AND city != ''"
    );
    const cities_count = (citiesResult[0]?.total || 0) as number;

    const [certificationsResult] = await connection.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM payments WHERE payment_status=1"
    );
    const certifications_count = (certificationsResult[0]?.total || 0) as number;

    // Calculate learning hours based on certifications as per provided PHP logic
    const learning_hours_count = Math.round(1.5 * certifications_count);

    return NextResponse.json({
      success: true,
      data: {
        total_users_count,
        workshops_count,
        countries_count,
        educators_count,
        cities_count,
        certifications_count,
        learning_hours_count,
      } as Stats,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch statistics' },
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
} 