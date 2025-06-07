import type {Metadata, Viewport} from 'next';
import {cookies} from 'next/headers';

import {data} from '../../data';
import {theme} from '../../constants';
import {MyCoupons} from './MyCoupons';

export const metadata: Metadata = {
  title: 'My Coupons',
  description: 'My Coupons screen',
};

export const viewport: Viewport = {themeColor: theme.colors.white};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const cookieStore = cookies();
  const userData = cookieStore.get('user');
  const user = userData ? JSON.parse(userData.value) : null;
  
  if (!user) {
    return <div>Please sign in to view your coupons</div>;
  }

  const [coupons] = await Promise.all([data.getCoupons(user.id)]);

  return <MyCoupons coupons={coupons} />;
}
