import type {Metadata, Viewport} from 'next';

import {theme} from '../../constants';
import {ProfileEdit} from './ProfileEdit';

export const metadata: Metadata = {
  title: 'Profile Edit',
  description: 'Profile Edit screen',
};

export const viewport: Viewport = {themeColor: theme.colors.white};

export default function NewPasswordPage() {
  return <ProfileEdit />;
}
