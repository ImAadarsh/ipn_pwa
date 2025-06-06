import type {Metadata, Viewport} from 'next';

import {data} from '../../data';
import {theme} from '../../constants';
import {CategoryGrid} from './CategoryGrid';

export const metadata: Metadata = {
  title: 'Category Grid',
  description: 'Category Grid screen',
};

export const viewport: Viewport = {themeColor: theme.colors.white};

export default async function CategoryGridPage() {
  const [categories] = await Promise.all([data.getCategories()]);

  return <CategoryGrid categories={categories} />;
}
