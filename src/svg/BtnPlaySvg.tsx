import * as React from 'react';

export const BtnPlaySvg: React.FC = () => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={10} height={10} fill='none'>
      <circle cx={5} cy={5} r={5} fill='#111' />
      <path fill='#fff' d='M7.5 5 3.75 7.165v-4.33L7.5 5Z' />
    </svg>
  );
};
