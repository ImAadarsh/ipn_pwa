import type {Metadata} from 'next';
import {MyCourses} from './MyCourses';

export const metadata: Metadata = {
  title: 'My Workshops',
  description: 'My Workshop screen',
};

export default function Page() {
  return <MyCourses />;
}
