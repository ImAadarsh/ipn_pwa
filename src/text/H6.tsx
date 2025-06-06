'use client';

import React from 'react';

import {theme} from '../constants';

type Props = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  numberOfLines?: number;
};

export const H6: React.FC<Props> = ({children, style, numberOfLines = 0}) => {
  return (
    <h6
      style={{
        fontSize: 14,
        fontWeight: 700,
        lineHeight: 1.5,
        color: theme.colors.mainColor,
        ...theme.fonts.Lato,
        ...style,
        ...(numberOfLines
          ? {
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: numberOfLines,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }
          : {}),
      }}
    >
      {children}
    </h6>
  );
};
