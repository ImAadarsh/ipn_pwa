import * as React from 'react';

import {stores} from '../stores';
import {CourseType} from '../types';

type Props = {
  course: CourseType;
};

export const HeartBigSvg: React.FC<Props> = ({course}) => {
  const {list} = stores.useWishlistStore();
  const ifInWishlist = list.find((item) => item.id === course.id);

  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={50} height={50} fill='none'>
      <rect width={49} height={49} x={0.5} y={0.5} fill='#fff' rx={24.5} />
      <rect width={49} height={49} x={0.5} y={0.5} stroke='#EEE' rx={24.5} />
      <path
        fill={ifInWishlist ? '#D05278' : 'none'}
        stroke={ifInWishlist ? '#D05278' : '#666666'}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.2}
        d='M32.367 18.842a4.582 4.582 0 0 0-6.484 0l-.883.883-.883-.883a4.584 4.584 0 1 0-6.484 6.483l.884.883L25 32.692l6.483-6.484.884-.883a4.584 4.584 0 0 0 0-6.483v0Z'
      />
    </svg>
  );
};
