import type {Metadata, Viewport} from 'next';

import {theme} from '../../constants';
import {MyCoupons} from './MyCoupons';

export const metadata: Metadata = {
  title: 'My Coupons',
  description: 'My Coupons screen',
};

export const viewport: Viewport = {themeColor: theme.colors.white};

export const dynamic = 'force-dynamic';

export default function Page() {
  return <MyCoupons />;
}
