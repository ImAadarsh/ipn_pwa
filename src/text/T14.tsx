'use client';

import React from 'react';

import {theme} from '../constants';

type Props = {
  numberOfLines?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export const T14: React.FC<Props> = ({
  children,
  style = {},
  numberOfLines = 0,
}) => {
  return (
    <p
      style={{
        fontSize: 14,
        lineHeight: 1.7,
        color: theme.colors.bodyTextColor,
        textAlign: 'left',
        ...theme.fonts.Lato,
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
