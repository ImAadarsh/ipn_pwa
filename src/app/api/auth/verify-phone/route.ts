import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: '82.180.142.204',
  user: 'u954141192_ipnacademy',
  password: 'x?OR+Q2/D',
  database: 'u954141192_ipnacademy'
};

export async function POST(request: Request) {
  try {
    const { userJsonUrl } = await request.json();

    // Fetch user data from phone.email
    const response = await fetch(userJsonUrl);
    const userData = await response.json();

    // Connect to database
    const connection = await mysql.createConnection(dbConfig);

    // Check if user exists
    const [existingUsers] = await connection.execute(
      'SELECT * FROM users WHERE mobile = ?',
      [userData.phone]
    );

    let userId;
    if (Array.isArray(existingUsers) && existingUsers.length === 0) {
      // Create new user
      const [result] = await connection.execute(
        'INSERT INTO users (mobile, name, email, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
        [userData.phone, userData.name || null, userData.email || null]
      );
      userId = (result as any).insertId;
    } else {
      userId = (existingUsers as any)[0].id;
    }

    // Generate session token
    const token = Math.random().toString(36).substring(2);

    // Update user token
    await connection.execute(
      'UPDATE users SET token = ?, updated_at = NOW() WHERE id = ?',
      [token, userId]
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      token,
      userId,
      isNewUser: Array.isArray(existingUsers) && existingUsers.length === 0
    });

  } catch (error) {
    console.error('Phone verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify phone number' },
      { status: 500 }
    );
  }
} 