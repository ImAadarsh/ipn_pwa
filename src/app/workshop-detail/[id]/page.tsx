import type {Metadata, Viewport} from 'next';
import {theme} from '../../../constants';
import {CourseDetails} from './workshopDetail';

export const metadata: Metadata = {
  title: 'Course Details',
  description: 'Course Details screen',
};

export const viewport: Viewport = {themeColor: theme.colors.white};

type Params = {
  params: Promise<{id: string}>;
};

export default async function CourseDetailsPage({params}: Params) {
  const id = (await params).id;
  return <CourseDetails id={id} />;
}
