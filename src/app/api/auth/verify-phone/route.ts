import { NextResponse } from 'next/server';
import mysql, { RowDataPacket } from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
    const { user_json_url } = await request.json();

    if (!user_json_url) {
      return NextResponse.json(
        { success: false, message: 'Missing user_json_url' },
        { status: 400 }
      );
    }

    // Fetch user data from phone.email
    const response = await fetch(user_json_url);
    if (!response.ok) {
      throw new Error('Failed to fetch user data from phone.email');
    }

    const userData = await response.json();
    console.log('Phone.email user data:', userData);

    // Extract phone number and country code
    const phoneNumber = userData.user_phone_number;
    const countryCode = userData.user_country_code;
    
    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, message: 'Phone number not found in verification data' },
        { status: 400 }
      );
    }

    // Connect to database
    const connection = await mysql.createConnection(dbConfig);

    try {
      // Check if user exists
      const [users] = await connection.execute<User[]>(
        'SELECT * FROM users WHERE mobile = ?',
        [phoneNumber]
      );

      let userId: number;
      let userDetails: User;

      if (users.length === 0) {
        // Create new user if doesn't exist
        const [result] = await connection.execute(
          'INSERT INTO users (mobile, country_code, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
          [phoneNumber, countryCode]
        );
        userId = (result as any).insertId;

        // Fetch the newly created user
        const [newUsers] = await connection.execute<User[]>(
          'SELECT * FROM users WHERE id = ?',
          [userId]
        );
        userDetails = newUsers[0];
      } else {
        userDetails = users[0];
        userId = users[0].id;
      }

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP in database
      await connection.execute(
        'UPDATE users SET otp = ? WHERE id = ?',
        [otp, userId]
      );

      // Generate a session token
      const sessionToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
      
      // Update user's token
      await connection.execute(
        'UPDATE users SET token = ? WHERE id = ?',
        [sessionToken, userId]
      );

      return NextResponse.json({
        success: true,
        message: 'Phone verification successful',
        user: {
          id: userDetails.id,
          name: userDetails.name,
          email: userDetails.email,
          mobile: userDetails.mobile,
          profile: userDetails.profile,
          designation: userDetails.designation,
          institute_name: userDetails.institute_name,
          city: userDetails.city,
          user_type: userDetails.user_type,
          membership: userDetails.membership,
          school_id: userDetails.school_id,
          sessionToken
        }
      });

    } finally {
      // Always close the connection
      await connection.end();
    }

  } catch (error) {
    console.error('Phone verification error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Phone verification failed',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 