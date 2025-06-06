import * as React from 'react';

type Props = {
  style?: React.CSSProperties;
};

export const PlayBtnSvg: React.FC<Props> = ({style}) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={50}
      height={50}
      fill='none'
      style={style}
    >
      <circle cx={25} cy={25} r={24} stroke='#fff' strokeWidth={2} />
      <path
        fill='#fff'
        d='M33.5 24.134a1 1 0 0 1 0 1.732l-12 6.928a1 1 0 0 1-1.5-.866V18.072a1 1 0 0 1 1.5-.866l12 6.928Z'
      />
    </svg>
  );
};
