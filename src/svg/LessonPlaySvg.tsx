import * as React from 'react';

export const LessonPlaySvg: React.FC = () => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={16} height={16} fill='none'>
      <circle cx={8} cy={8} r={7.5} stroke='#111' />
      <path
        fill='#111'
        d='M10.5 7.134a1 1 0 0 1 0 1.732l-3 1.732A1 1 0 0 1 6 9.732V6.268a1 1 0 0 1 1.5-.866l3 1.732Z'
      />
    </svg>
  );
};
