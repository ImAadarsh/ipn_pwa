import type {Metadata, Viewport} from 'next';

import {data} from '../../data';
import {theme} from '../../constants';
import {MyCoupons} from './MyCoupons';

export const metadata: Metadata = {
  title: 'My Coupons',
  description: 'My Coupons screen',
};

export const viewport: Viewport = {themeColor: theme.colors.white};

export default async function Page() {
  const [coupons] = await Promise.all([data.getCoupons()]);

  return <MyCoupons coupons={coupons} />;
}
