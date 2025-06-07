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
  oauth_uid: string | null;
  designation: string | null;
  institute_name: string | null;
  city: string | null;
  user_type: string;
  email_verified_at: Date | null;
  country_code: string | null;
  token: string | null;
  otp: string | null;
  password: string | null;
  remember_token: string | null;
  membership: number;
  school_id: number | null;
  created_at: Date;
  updated_at: Date;
}

export async function POST(request: Request) {
  try {
    const { name, email, phone } = await request.json();

    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to database
    const connection = await mysql.createConnection(dbConfig);

    try {
      // First check for exact match (both email and mobile match)
      const [exactMatches] = await connection.execute<User[]>(
        'SELECT * FROM users WHERE email = ? AND mobile = ?',
        [email, phone]
      );

      if (exactMatches.length > 0) {
        // Exact match found - use this account
        const user = exactMatches[0];
        
        // Update name if it's null
        if (!user.name) {
          await connection.execute(
            'UPDATE users SET name = ? WHERE id = ?',
            [name, user.id]
          );
          user.name = name;
        }

        // Generate a session token
        const sessionToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
        await connection.execute(
          'UPDATE users SET token = ? WHERE id = ?',
          [sessionToken, user.id]
        );

        return NextResponse.json({
          success: true,
          status: 'existing_user',
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
      }

      // If no exact match, check for partial matches (either email or mobile)
      const [emailMatches] = await connection.execute<User[]>(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      const [mobileMatches] = await connection.execute<User[]>(
        'SELECT * FROM users WHERE mobile = ?',
        [phone]
      );

      // Combine unique matches
      const partialMatches = [...emailMatches, ...mobileMatches].filter((user, index, self) =>
        index === self.findIndex((u) => u.id === user.id)
      );

      if (partialMatches.length > 0) {
        // If multiple accounts found
        if (partialMatches.length > 1) {
          return NextResponse.json({
            success: true,
            status: 'multiple_accounts',
            users: partialMatches.map(user => ({
              id: user.id,
              name: user.name,
              email: user.email,
              mobile: user.mobile,
              profile: user.profile
            }))
          });
        }

        // Single partial match found - update name if it's null
        const user = partialMatches[0];
        if (!user.name) {
          await connection.execute(
            'UPDATE users SET name = ? WHERE id = ?',
            [name, user.id]
          );
          user.name = name;
        }

        // Generate a session token
        const sessionToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
        await connection.execute(
          'UPDATE users SET token = ? WHERE id = ?',
          [sessionToken, user.id]
        );

        return NextResponse.json({
          success: true,
          status: 'existing_user',
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
      }

      // No existing user found - create new user
      const [result] = await connection.execute(
        'INSERT INTO users (name, email, mobile, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
        [name, email, phone]
      );

      const userId = (result as any).insertId;

      // Generate a session token
      const sessionToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
      await connection.execute(
        'UPDATE users SET token = ? WHERE id = ?',
        [sessionToken, userId]
      );

      // Fetch the newly created user
      const [newUsers] = await connection.execute<User[]>(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      );

      const newUser = newUsers[0];

      return NextResponse.json({
        success: true,
        status: 'new_user',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          mobile: newUser.mobile,
          profile: newUser.profile,
          designation: newUser.designation,
          institute_name: newUser.institute_name,
          city: newUser.city,
          user_type: newUser.user_type,
          membership: newUser.membership,
          school_id: newUser.school_id,
          sessionToken
        }
      });

    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error('Error in verify-registration:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 