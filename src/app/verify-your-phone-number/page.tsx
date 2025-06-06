import type {Metadata, Viewport} from 'next';

import {theme} from '../../constants';
import {VerifyYourPhoneNumber} from './VerifyYourPhoneNumber';

export const metadata: Metadata = {
  title: 'Verify Your Phone Number',
  description: 'Verify Your Phone Number screen',
};

export const viewport: Viewport = {
  themeColor: theme.colors.white,
};

export default function VerifyYourPhoneNumberPage() {
  return <VerifyYourPhoneNumber />;
}
