import type {Metadata, Viewport} from 'next';

import {theme} from '../../constants';
import {MyWishlist} from './MyWishlist';

export const metadata: Metadata = {
  title: 'My Wishlist',
  description: 'My Wishlist screen',
};

export const viewport: Viewport = {themeColor: theme.colors.white};

export default async function Page() {
  return <MyWishlist />;
}
