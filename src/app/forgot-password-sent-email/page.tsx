import type {Metadata, Viewport} from 'next';

import {theme} from '../../constants';
import {ForgotPasswordSentEmail} from './ForgotPasswordSentEmail';

export const metadata: Metadata = {
  title: 'Forgot Password Sent Email',
  description: 'Forgot Password Sent Email screen',
};

export const viewport: Viewport = {
  themeColor: theme.colors.white,
};

export default function ForgotPasswordSentEmailPage() {
  return <ForgotPasswordSentEmail />;
}
