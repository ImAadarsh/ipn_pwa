import { NextResponse } from 'next/server';
import mysql, { RowDataPacket } from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: '82.180.142.204',
  user: 'u954141192_ipnacademy',
  password: 'x?OR+Q2/D',
  database: 'u954141192_ipnacademy'
};

interface User extends RowDataPacket {
  id: number;
  name: string | null;
  email: string | null;
  mobile: string;
  profile: string;
  designation: string | null;
  institute_name: string | null;
  city: string | null;
  user_type: string;
  membership: number;
  school_id: number | null;
}

export async function POST(request: Request) {
  try {
    const { accountId } = await request.json();

    if (!accountId) {
      return NextResponse.json(
        { success: false, message: 'Missing account ID' },
        { status: 400 }
      );
    }

    // Connect to database
    const connection = await mysql.createConnection(dbConfig);

    try {
      // Fetch user details
      const [users] = await connection.execute<User[]>(
        'SELECT * FROM users WHERE id = ?',
        [accountId]
      );

      if (users.length === 0) {
        return NextResponse.json(
          { success: false, message: 'Account not found' },
          { status: 404 }
        );
      }

      const user = users[0];

      // Generate a session token
      const sessionToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
      
      // Update user's token
      await connection.execute(
        'UPDATE users SET token = ? WHERE id = ?',
        [sessionToken, user.id]
      );

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          profile: user.profile,
          designation: user.designation,
          institute_name: user.institute_name,
          city: user.city,
          user_type: user.user_type,
          membership: user.membership,
          school_id: user.school_id,
          sessionToken
        }
      });

    } finally {
      await connection.end();
    }

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Login failed',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 