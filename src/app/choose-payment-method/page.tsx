import type {Metadata, Viewport} from 'next';

import {theme} from '../../constants';
import {ChoosePaymentMethod} from './ChoosePaymentMethod';

export const metadata: Metadata = {
  title: 'Choose Payment Method',
  description: 'Choose Payment Method screen',
};

export const viewport: Viewport = {
  themeColor: theme.colors.white,
};

export default function ChoosePaymentMethodPage() {
  return <ChoosePaymentMethod />;
}
