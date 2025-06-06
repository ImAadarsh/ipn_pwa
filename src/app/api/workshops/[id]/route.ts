import {NextRequest, NextResponse} from 'next/server';
import mysql, {RowDataPacket, QueryError} from 'mysql2/promise';

// Database configuration
const dbConfig = {
    host: '82.180.142.204',
    user: 'u954141192_ipnacademy',
    password: 'x?OR+Q2/D',
    database: 'u954141192_ipnacademy'
  };

// Validate database configuration
const validateDbConfig = () => {
  const missingVars = [];
  if (!dbConfig.host) missingVars.push('DB_HOST');
  if (!dbConfig.user) missingVars.push('DB_USER');
  if (!dbConfig.password) missingVars.push('DB_PASSWORD');
  if (!dbConfig.database) missingVars.push('DB_NAME');
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required database configuration: ${missingVars.join(', ')}`);
  }
};

export async function GET(
  request: NextRequest,
  {params}: {params: {id: string}}
) {
  let connection;
  try {
    // Validate database configuration
    validateDbConfig();

    console.log('Database config:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database
    });

    console.log('Fetching workshop details for ID:', params.id);
    connection = await mysql.createConnection(dbConfig);
    
    // Test the connection
    await connection.ping();
    console.log('Database connection successful');

    // Get workshop details with trainer info
    const [workshopRows] = await connection.execute<RowDataPacket[]>(
      `SELECT 
        w.*,
        t.name as trainer_name,
        t.designation as trainer_designation,
        t.image as trainer_image,
        t.about as trainer_description,
        COUNT(DISTINCT p.id) as total_subscribers,
        AVG(f.rating) as average_rating,
        COUNT(DISTINCT f.id) as total_reviews
      FROM workshops w
      LEFT JOIN trainers t ON w.trainer_id = t.id
      LEFT JOIN payments p ON w.id = p.workshop_id AND p.payment_status = 1
      LEFT JOIN feedback f ON w.id = f.workshop_id
      WHERE w.id = ? AND w.is_deleted = 0
      GROUP BY w.id`,
      [params.id]
    );

    console.log('Workshop query result:', workshopRows);

    // Get recent feedback
    const [feedbackRows] = await connection.execute<RowDataPacket[]>(
      `SELECT 
        f.*,
        u.name as user_name,
        u.profile as user_image
      FROM feedback f
      LEFT JOIN users u ON f.user_id = u.id
      WHERE f.workshop_id = ?
      ORDER BY f.created_at DESC
      LIMIT 5`,
      [params.id]
    );

    console.log('Feedback query result:', feedbackRows);

    if (!workshopRows[0]) {
      console.log('No workshop found for ID:', params.id);
      return NextResponse.json({error: 'Workshop not found'}, {status: 404});
    }

    const response = {
      workshop: workshopRows[0],
      feedback: feedbackRows
    };
    console.log('Sending response:', response);

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error('Error type:', typeof error);
    console.error('Error object:', error);

    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      return NextResponse.json(
        {error: 'Internal Server Error', details: error.message},
        {status: 500}
      );
    }

    const dbError = error as QueryError;
    console.error('Database error:', {
      message: dbError.message,
      code: dbError.code,
      errno: dbError.errno,
      sqlState: dbError.sqlState
    });
    return NextResponse.json(
      {error: 'Internal Server Error', details: dbError.message || 'Unknown database error'},
      {status: 500}
    );
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
} 