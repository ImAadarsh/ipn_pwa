import type {Metadata, Viewport} from 'next';
import {theme} from '../../constants';
import {Search} from './Search';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search screen',
};

export const viewport: Viewport = {themeColor: theme.colors.white};

export default function SearchPage() {
  return <Search />;
}
