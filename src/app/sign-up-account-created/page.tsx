import type {Metadata, Viewport} from 'next';

import {theme} from '../../constants';
import {SignUpAccountCreated} from './SignUpAccountCreated';

export const metadata: Metadata = {
  title: 'Sign Up Account Created',
  description: 'Sign Up Account Created screen',
};

export const viewport: Viewport = {
  themeColor: theme.colors.white,
};

export default function SignUpAccountCreatedPage() {
  return <SignUpAccountCreated />;
}
