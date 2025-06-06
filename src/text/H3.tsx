'use client';

import React from 'react';

import {theme} from '../constants';

type Props = {
  numberOfLines?: 1 | 2;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export const H3: React.FC<Props> = ({children, numberOfLines, style}) => {
  return (
    <h3
      style={{
        fontSize: 18,
        fontWeight: 400,
        lineHeight: 1.7,
        ...theme.fonts.League_Spartan,
        ...style,
      }}
      className={
        numberOfLines === 2 ? 'number-of-lines-2' : 'number-of-lines-1'
      }
    >
      {children}
    </h3>
  );
};
