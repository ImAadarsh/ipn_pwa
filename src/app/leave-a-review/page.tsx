import type {Metadata, Viewport} from 'next';

import {theme} from '../../constants';
import {LeaveAReview} from './LeaveAReview';

export const metadata: Metadata = {
  title: 'Leave a Review',
  description: 'Leave a Review screen',
};

export const viewport: Viewport = {
  themeColor: theme.colors.white,
};

export default function LeaveAReviewPage() {
  return <LeaveAReview />;
}
