import { NextResponse } from 'next/server';
import mysql, { RowDataPacket } from 'mysql2/promise';
import { writeFile } from 'fs/promises';
import { join } from 'path';

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

    // Get form data
    const formData = await request.formData();
    const file = formData.get('profile') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      );
    }

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

      // Generate unique filename
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const timestamp = Date.now();
      const filename = `profile_${userId}_${timestamp}.${file.name.split('.').pop()}`;
      const relativePath = `/storage/app/public/profiles/${filename}`;
      const fullPath = join(process.cwd(), 'public', relativePath);

      // Save file
      await writeFile(fullPath, buffer);

      // Update user profile in database
      await connection.execute(
        'UPDATE users SET profile = ? WHERE id = ?',
        [relativePath, userId]
      );

      return NextResponse.json({
        success: true,
        message: 'Profile image uploaded successfully',
        profileUrl: relativePath
      });

    } finally {
      await connection.end();
    }

  } catch (error) {
    console.error('Profile upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to upload profile image'
      },
      { status: 500 }
    );
  }
} 