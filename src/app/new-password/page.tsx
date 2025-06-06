import type {Metadata, Viewport} from 'next';

import {theme} from '../../constants';
import {NewPassword} from './NewPassword';

export const metadata: Metadata = {
  title: 'New Password',
  description: 'New password screen',
};

export const viewport: Viewport = {
  themeColor: theme.colors.white,
};

export default function NewPasswordPage() {
  return <NewPassword />;
}
