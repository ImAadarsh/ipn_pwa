import type {Metadata, Viewport} from 'next';

import {theme} from '../../constants';
import {Onboarding} from './Onboarding';

export const metadata: Metadata = {
  title: 'Onboarding',
  description: 'Onboarding screen',
};

export const viewport: Viewport = {themeColor: theme.colors.white};

export default function NewPasswordPage() {
  return <Onboarding />;
}
