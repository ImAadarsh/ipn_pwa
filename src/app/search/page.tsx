import type {Metadata, Viewport} from 'next';

import {data} from '../../data';
import {theme} from '../../constants';
import {Search} from './Search';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search screen',
};

export const viewport: Viewport = {themeColor: theme.colors.white};

export default async function SearchPage() {
  const [courses] = await Promise.all([data.getCourses()]);

  return <Search courses={courses} />;
}
