import type {Metadata, Viewport} from 'next';

import {data} from '../../../data';
import {theme} from '../../../constants';
import {CategoryList} from './CategoryList';

export const metadata: Metadata = {
  title: 'Category List',
  description: 'Category List screen',
};

export const viewport: Viewport = {themeColor: theme.colors.white};

type Params = {
  params: Promise<{id: string}>;
};

export default async function CategoryListPage({params}: Params) {
  const id = (await params).id;

  const [courses] = await Promise.all([data.getCourses()]);

  return <CategoryList id={id} courses={courses} />;
}
