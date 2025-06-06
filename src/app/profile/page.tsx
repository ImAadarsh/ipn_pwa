import type {Metadata, Viewport} from 'next';

import {Profile} from './Profile';
import {theme} from '../../constants';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Profile screen',
};

export const viewport: Viewport = {themeColor: theme.colors.white};

export default function Page() {
  return <Profile />;
}
