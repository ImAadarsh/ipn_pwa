import * as React from 'react';

export const InputCameraSvg: React.FC = () => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={16} height={16} fill='none'>
      <g
        stroke='#333'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
      >
        <path d='M15.333 12.667A1.334 1.334 0 0 1 14 14H2a1.334 1.334 0 0 1-1.333-1.333V5.333A1.333 1.333 0 0 1 2 4h2.667L6 2h4l1.333 2H14a1.333 1.333 0 0 1 1.333 1.333v7.334Z' />
        <path d='M8 11.333A2.667 2.667 0 1 0 8 6a2.667 2.667 0 0 0 0 5.333Z' />
      </g>
      <defs>
        <clipPath id='a'>
          <path fill='#fff' d='M0 0h16v16H0z' />
        </clipPath>
      </defs>
    </svg>
  );
};
