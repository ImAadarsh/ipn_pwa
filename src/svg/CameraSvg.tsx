import React from 'react';

type Props = {
  style?: React.CSSProperties;
};

export const CameraSvg: React.FC<Props> = ({style}) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={40} height={40} fill='none'>
      <rect width={40} height={40} fill='#fff' rx={20} />
      <g
        stroke='#333'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
      >
        <path d='M27.333 24.667A1.333 1.333 0 0 1 26 26H14a1.333 1.333 0 0 1-1.333-1.333v-7.334A1.333 1.333 0 0 1 14 16h2.667L18 14h4l1.333 2H26a1.333 1.333 0 0 1 1.333 1.333v7.334Z' />
        <path d='M20 23.333A2.667 2.667 0 1 0 20 18a2.667 2.667 0 0 0 0 5.333Z' />
      </g>
      <defs>
        <clipPath id='a'>
          <path fill='#fff' d='M12 12h16v16H12z' />
        </clipPath>
      </defs>
    </svg>
  );
};
