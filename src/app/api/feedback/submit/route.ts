import {NextResponse} from 'next/server';
import mysql, {RowDataPacket} from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        {success: false, message: 'Unauthorized'},
        {status: 401}
      );
    }

    // const sessionToken = authHeader.split(' ')[1];
    const {userId, workshopId, rating, comment} = await request.json();

    if (!userId || !workshopId || !rating || !comment) {
      return NextResponse.json(
        {success: false, message: 'Missing required fields.'},
        {status: 400}
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    try {
      // Verify user existence. Assuming sessionToken is validated by a higher-level middleware or is merely for authorization.
      const [users] = await connection.execute<RowDataPacket[]>(
        'SELECT id FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return NextResponse.json(
          {success: false, message: 'Invalid user or session'},
          {status: 401}
        );
      }

      // Fetch trainer_id from the workshops table
      const [workshops] = await connection.execute<RowDataPacket[]>(
        'SELECT trainer_id FROM workshops WHERE id = ?',
        [workshopId]
      );

      if (workshops.length === 0 || !workshops[0].trainer_id) {
        return NextResponse.json(
          {success: false, message: 'Workshop not found or trainer ID missing'},
          {status: 404}
        );
      }

      const trainerId = workshops[0].trainer_id; 

      // Check if feedback already exists for this user and workshop
      const [existingFeedback] = await connection.execute<RowDataPacket[]>(
        'SELECT id FROM feedback WHERE user_id = ? AND workshop_id = ?',
        [userId, workshopId]
      );

      if (existingFeedback.length > 0) {
        // Update existing feedback
        await connection.execute(
          'UPDATE feedback SET rating = ?, comment = ?, updated_at = NOW() WHERE id = ?',
          [rating, comment, existingFeedback[0].id]
        );
        return NextResponse.json({success: true, message: 'Feedback updated successfully'});
      } else {
        // Insert new feedback
        await connection.execute(
          'INSERT INTO feedback (user_id, trainer_id, workshop_id, rating, comment, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
          [userId, trainerId, workshopId, rating, comment]
        );
        return NextResponse.json({success: true, message: 'Feedback submitted successfully'});
      }
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      {success: false, message: 'Failed to submit feedback'},
      {status: 500}
    );
  }
} 