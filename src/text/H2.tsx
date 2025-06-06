'use client';

import React from 'react';

import {theme} from '../constants';

type Props = {
  numberOfLines?: 1 | 2;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export const H2: React.FC<Props> = ({children, numberOfLines, style}) => {
  return (
    <h2
      style={{
        fontSize: 24,
        fontWeight: 500,
        lineHeight: 1.4,
        color: theme.colors.mainColor,
        ...theme.fonts.League_Spartan,
        ...style,
      }}
      className={
        numberOfLines === 2 ? 'number-of-lines-2' : 'number-of-lines-1'
      }
    >
      {children}
    </h2>
  );
};
