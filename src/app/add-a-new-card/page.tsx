import type {Metadata, Viewport} from 'next';

import {theme} from '../../constants';
import {AddANewCard} from './AddANewCard';

export const metadata: Metadata = {
  title: 'Add a new card',
  description: 'Add a new card to your account',
};

export const viewport: Viewport = {themeColor: theme.colors.white};

export default function AddANewCardPage() {
  return <AddANewCard />;
}
