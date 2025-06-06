import type {Metadata, Viewport} from 'next';

import {Filter} from './Filter';
import {theme} from '../../constants';

export const metadata: Metadata = {
  title: 'Filter',
  description: 'Filter screen',
};

export const viewport: Viewport = {
  themeColor: theme.colors.white,
};

export default function NewPasswordPage() {
  return <Filter />;
}
