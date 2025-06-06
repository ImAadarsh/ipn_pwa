import type {Metadata, Viewport} from 'next';

import {theme} from '../../constants';
import {HelpAndSupport} from './HelpAndSupport';

export const metadata: Metadata = {
  title: 'Help and Support',
  description: 'Help and Support screen',
};

export const viewport: Viewport = {
  themeColor: theme.colors.white,
};

export default function HelpAndSupportPage() {
  return <HelpAndSupport />;
}
