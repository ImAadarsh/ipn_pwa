import type {Metadata, Viewport} from 'next';

import {theme} from '../../constants';
import {CourseCompleted} from './CourseCompleted';

export const metadata: Metadata = {
  title: 'Course Completed',
  description: 'Course Completed screen',
};

export const viewport: Viewport = {themeColor: theme.colors.white};

export default function NewPasswordPage() {
  return <CourseCompleted />;
}
