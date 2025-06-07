import type { Metadata, Viewport } from 'next';

import { theme } from '../../constants';
import { BetterTogether } from './BetterTogether';

export const metadata: Metadata = {
  title: 'Better Together',
  description: 'IPN Academy Global Impact Statistics',
};

export const viewport: Viewport = { themeColor: theme.colors.white };

export const dynamic = 'force-dynamic';

export default function Page() {
  return <BetterTogether />;
} 