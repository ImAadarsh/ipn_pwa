import type {Metadata, Viewport} from 'next';

import {theme} from '../../constants';
import {PrivacyPolicy} from './PrivacyPolicy';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy screen',
};

export const viewport: Viewport = {
  themeColor: theme.colors.white,
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicy />;
}
