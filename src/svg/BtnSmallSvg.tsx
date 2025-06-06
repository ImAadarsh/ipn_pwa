import * as React from 'react';

export const BtnSmallSvg: React.FC = () => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={30} height={30} fill='none'>
      <circle cx={15} cy={15} r={14.5} stroke='#666' />
      <path
        fill='#111'
        d='M19.5 14.134a1 1 0 0 1 0 1.732l-6 3.464a1 1 0 0 1-1.5-.866v-6.928a1 1 0 0 1 1.5-.866l6 3.464Z'
      />
    </svg>
  );
};
