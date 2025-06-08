import type {Metadata, Viewport} from 'next';

import {SignIn} from './SignIn';
import {theme} from '../../constants';

export const metadata: Metadata = {
  title: 'IPN Academy | Sign In',
  description: 'IPN Academy | Login',
};

export const viewport: Viewport = {themeColor: theme.colors.white};

export default async function SignInPage() {
  return <SignIn />;
}
