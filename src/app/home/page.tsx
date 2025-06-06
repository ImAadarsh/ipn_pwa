import type {Metadata, Viewport} from 'next';

import {Home} from './Home';
import {data} from '../../data';
import {theme} from '../../constants';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Home screen',
};

export const viewport: Viewport = {themeColor: theme.colors.white};

export default async function HomePage() {
  const [courses, categories] = await Promise.all([
    data.getCourses(),
    data.getCategories(),
  ]);

  return <Home courses={courses} categories={categories} />;
}
