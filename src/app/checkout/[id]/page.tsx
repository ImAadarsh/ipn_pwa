import type {Metadata, Viewport} from 'next';

import {Checkout} from './Checkout';

import {data} from '../../../data';
import {theme} from '../../../constants';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Checkout screen',
};

export const viewport: Viewport = {themeColor: theme.colors.white};

type Params = {
  params: Promise<{id: string}>;
};

export default async function CheckoutPage({params}: Params) {
  const id = (await params).id;
  const [courses] = await Promise.all([data.getCourses()]);

  return <Checkout courses={courses} id={id} />;
}
