import React from 'react';
import type {Metadata, Viewport} from 'next';

import {SignUp} from './SignUp';
import {theme} from '../../constants';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Sign Up screen',
};

export const viewport: Viewport = {
  themeColor: theme.colors.white,
};

export default function SignUpPage() {
  return <SignUp />;
}
