import * as React from 'react';

export const ChatSvg: React.FC = () => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={10} height={10} fill='none'>
      <g>
        <path
          fill='#111'
          d='M0 1.25A1.25 1.25 0 0 1 1.25 0h7.5A1.25 1.25 0 0 1 10 1.25v5A1.25 1.25 0 0 1 8.75 7.5H2.759a.625.625 0 0 0-.442.183L.534 9.466A.312.312 0 0 1 0 9.246V1.25Zm2.188.625a.312.312 0 1 0 0 .625h5.624a.312.312 0 1 0 0-.625H2.188Zm0 1.563a.312.312 0 1 0 0 .624h5.624a.312.312 0 1 0 0-.625H2.188Zm0 1.562a.312.312 0 1 0 0 .625h3.124a.312.312 0 1 0 0-.625H2.188Z'
        />
      </g>
      <defs>
        <clipPath id='a'>
          <path fill='#fff' d='M0 0h10v10H0z' />
        </clipPath>
      </defs>
    </svg>
  );
};
