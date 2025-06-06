import type {Metadata, Viewport} from 'next';

import {theme} from '../../constants';
import {MyWallet} from './MyWallet';

export const metadata: Metadata = {
  title: 'My Wallet',
  description: 'My Wallet screen',
};

export const viewport: Viewport = {themeColor: theme.colors.white};

export default async function Page() {
  return <MyWallet />;
}
