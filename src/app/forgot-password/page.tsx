import type {Metadata, Viewport} from 'next';

import {theme} from '../../constants';
import {ForgotPassword} from './ForgotPassword';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Forgot password screen',
};

export const viewport: Viewport = {
  themeColor: theme.colors.white,
};

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}
