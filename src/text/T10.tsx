'use client';

import React from 'react';

import {theme} from '../constants';

type Props = {
  numberOfLines?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export const T10: React.FC<Props> = ({
  children,
  style = {},
  numberOfLines = 0,
}) => {
  return (
    <p
      style={{
        fontSize: 10,
        lineHeight: 1.7,
        color: theme.colors.secondaryTextColor,
        textAlign: 'left',
        ...theme.fonts.Lato_400Regular,
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
