import type {Metadata, Viewport} from 'next';

import {theme} from '../../constants';
import {ConfirmationCode} from './ConfirmationCode';

export const metadata: Metadata = {
  title: 'Confirmation Code',
  description: 'Confirmation Code screen',
};

export const viewport: Viewport = {
  themeColor: theme.colors.white,
};

export default function ConfirmationCodePage() {
  return <ConfirmationCode />;
}
