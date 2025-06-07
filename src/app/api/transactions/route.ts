import { NextResponse } from 'next/server';
import mysql, {RowDataPacket} from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

interface Transaction extends RowDataPacket {
  id: number;
  workshopName: string;
  amount: number;
  status: string;
  date: string;
  payment_id: string;
  order_id: string;
}

export async function GET(request: Request) {
  try {
    // Get user ID from request
    const userId = request.headers.get('user-id');
    // console.log('Received user ID:', userId);

    if (!userId) {
    //   console.log('No user ID provided');
      return NextResponse.json(
        {success: false, message: 'User ID is required'},
        {status: 401}
      );
    }

    // Connect to database
    // console.log('Connecting to database...');
    const connection = await mysql.createConnection(dbConfig);
    // console.log('Database connected successfully');

    try {
      // Fetch transactions
    //   console.log('Fetching transactions for user:', userId);
      const [transactions] = await connection.execute<Transaction[]>(
        `SELECT 
          p.id, 
          w.name as workshopName, 
          p.amount, 
          CASE WHEN p.payment_status = 1 THEN 'Completed' ELSE 'Pending' END as status,
          p.created_at as date,
          p.payment_id,
          p.order_id
         FROM payments p
         LEFT JOIN workshops w ON p.workshop_id = w.id
         WHERE p.user_id = ?
         ORDER BY p.created_at DESC`,
        [userId]
      );

    //   console.log('Query executed. Found transactions:', transactions.length);
    //   console.log('Sample transaction:', transactions[0]);

      return NextResponse.json({
        success: true,
        transactions: transactions
      });

    } finally {
    //   console.log('Closing database connection');
      await connection.end();
    }

  } catch (error) {
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch transactions'
      },
      {status: 500}
    );
  }
} 