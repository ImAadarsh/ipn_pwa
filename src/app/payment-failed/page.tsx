import type {Metadata, Viewport} from 'next';

import {theme} from '../../constants';
import {PaymentFailed} from './PaymentFailed';

export const metadata: Metadata = {
  title: 'Payment Method',
  description: 'Payment Method screen',
};

export const viewport: Viewport = {
  themeColor: theme.colors.white,
};

export default function PaymentSuccessPage() {
  return <PaymentFailed />;
}
