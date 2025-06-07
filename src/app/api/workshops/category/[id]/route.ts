import {NextResponse} from 'next/server';
import mysql, {RowDataPacket} from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: '82.180.142.204',
  user: 'u954141192_ipnacademy',
  password: 'x?OR+Q2/D',
  database: 'u954141192_ipnacademy'
};

export async function GET(
  request: Request,
  {params}: {params: {id: string}}
) {
  try {
    const categoryId = params.id;

    if (!categoryId) {
      return NextResponse.json(
        {success: false, message: 'Category ID is required'},
        {status: 400}
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    try {
      // Fetch workshops by category_id
      const [workshops] = await connection.execute<RowDataPacket[]>(`
        SELECT 
          w.*,
          t.name AS trainer_name,
          t.designation AS trainer_designation,
          t.image AS trainer_image,
          t.about AS trainer_description
        FROM workshops w
        LEFT JOIN trainers t ON w.trainer_id = t.id
        WHERE w.category_id = ?
        ORDER BY w.start_date DESC
      `, [categoryId]);

      // Fetch category name
      const [categories] = await connection.execute<RowDataPacket[]>(
        'SELECT name FROM categories WHERE id = ?',
        [categoryId]
      );
      const categoryName = categories.length > 0 ? categories[0].name : 'Category';

      // Transform data to match Workshop interface expected by frontend
      const transformedWorkshops = workshops.map((workshop: any) => ({
        ...workshop,
        trainer: {
          name: workshop.trainer_name,
          designation: workshop.trainer_designation,
          image: workshop.trainer_image,
          description: workshop.trainer_description
        }
      }));

      return NextResponse.json({
        success: true,
        workshops: transformedWorkshops,
        categoryName: categoryName,
      });
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error('Error fetching category workshops:', error);
    return NextResponse.json(
      {success: false, message: 'Failed to fetch category workshops'},
      {status: 500}
    );
  }
} 