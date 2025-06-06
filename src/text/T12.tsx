'use client';

import React from 'react';

import {theme} from '../constants';

type Props = {
  numberOfLines?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export const T12: React.FC<Props> = ({
  children,
  style = {},
  numberOfLines = 0,
}) => {
  return (
    <p
      style={{
        fontSize: 12,
        lineHeight: 1.2,
        color: theme.colors.mainColor,
        textAlign: 'left',
        ...theme.fonts.Lato_700Bold,
        ...(numberOfLines
          ? {
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: numberOfLines,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }
          : {}),
        ...style,
      }}
    >
      {children}
    </p>
  );
};
