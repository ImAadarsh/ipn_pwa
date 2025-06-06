import * as React from 'react';

type Props = {
  color?: string;
};

export const ClockSvg: React.FC<Props> = ({color = '#666'}) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={14} height={14} fill='none'>
      <g stroke={color} strokeLinecap='round' strokeLinejoin='round'>
        <path d='M7 12.833A5.833 5.833 0 1 0 7 1.167a5.833 5.833 0 0 0 0 11.666Z' />
        <path d='M7 3.5V7l2.333 1.167' />
      </g>
      <defs>
        <clipPath id='a'>
          <path fill='#fff' d='M0 0h14v14H0z' />
        </clipPath>
      </defs>
    </svg>
  );
};
