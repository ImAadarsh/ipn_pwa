'use client';

import React from 'react';

import {theme} from '../constants';

type Props = {
  numberOfLines?: 1 | 2;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export const H5: React.FC<Props> = ({children, numberOfLines, style}) => {
  return (
    <h5
      style={{
        fontSize: 16,
        fontWeight: 700,
        lineHeight: 1.6,
        color: theme.colors.mainColor,
        ...theme.fonts.Lato,
        ...style,
      }}
      className={
        numberOfLines === 2 ? 'number-of-lines-2' : 'number-of-lines-1'
      }
    >
      {children}
    </h5>
  );
};
