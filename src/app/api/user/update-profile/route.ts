import { NextResponse } from 'next/server';
import mysql, { RowDataPacket } from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export async function POST(request: Request) {
  try {
    // Get session token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const sessionToken = authHeader.split(' ')[1];
    const formData = await request.json();

    // Connect to database
    const connection = await mysql.createConnection(dbConfig);

    try {
      // Verify session token and get user
      const [users] = await connection.execute<RowDataPacket[]>(
        'SELECT id FROM users WHERE token = ?',
        [sessionToken]
      );

      if (users.length === 0) {
        return NextResponse.json(
          { success: false, message: 'Invalid session' },
          { status: 401 }
        );
      }

      const userId = users[0].id;

      // Update user profile
      await connection.execute(
        `UPDATE users 
         SET name = ?, 
             email = ?, 
             mobile = ?, 
             city = ?, 
             designation = ?, 
             institute_name = ?,
             updated_at = NOW()
         WHERE id = ?`,
        [
          formData.name,
          formData.email,
          formData.mobile,
          formData.city,
          formData.designation,
          formData.institute_name,
          userId
        ]
      );

      return NextResponse.json({
        success: true,
        message: 'Profile updated successfully'
      });

    } finally {
      await connection.end();
    }

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to update profile'
      },
      { status: 500 }
    );
  }
} 