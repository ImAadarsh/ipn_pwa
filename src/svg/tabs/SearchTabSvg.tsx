import React from 'react';

type Props = {
  color: string;
};

export const SearchTabSvg: React.FC<Props> = ({color = '#111'}) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={28}
      height={28}
      fill='none'
    >
      <path
        fill={color}
        fillRule='evenodd'
        d='M12.833 4.375a8.458 8.458 0 1 0 0 16.917 8.458 8.458 0 0 0 0-16.917ZM2.625 12.833c0-5.638 4.57-10.208 10.208-10.208s10.209 4.57 10.209 10.208-4.57 10.209-10.209 10.209c-5.638 0-10.208-4.57-10.208-10.209Z'
        clipRule='evenodd'
      />
      <path
        fill={color}
        fillRule='evenodd'
        d='M18.6 18.6a1.167 1.167 0 0 1 1.65 0l5.075 5.075a1.167 1.167 0 1 1-1.65 1.65L18.6 20.25a1.167 1.167 0 0 1 0-1.65Z'
        clipRule='evenodd'
      />
    </svg>
  );
};
