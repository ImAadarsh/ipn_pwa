import React from 'react';
import type {Metadata, Viewport} from 'next';

import {SignUp} from './SignUp';
import {theme} from '../../constants';

export const metadata: Metadata = {
  title: 'IPN Academy | Sign Up',
  description: 'IPN Academy Registeration',
};

export const viewport: Viewport = {
  themeColor: theme.colors.white,
};

export default function SignUpPage() {
  return <SignUp />;
}
