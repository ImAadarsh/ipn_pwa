import type {Metadata, Viewport} from 'next';

import {data} from '../../data';
import {theme} from '../../constants';
import {MyCourses} from './MyCourses';

export const metadata: Metadata = {
  title: 'My Courses',
  description: 'My Courses screen',
};

export const viewport: Viewport = {themeColor: theme.colors.white};

export default async function Page() {
  const [courses] = await Promise.all([data.getCourses()]);

  return <MyCourses courses={courses} />;
}
