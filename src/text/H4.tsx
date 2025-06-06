'use client';

import {FC} from 'react';
import {CSSProperties} from 'react';

import {theme} from '../constants';

type Props = {
  to?: string;
  hover?: boolean;
  style?: CSSProperties;
  numberOfLines?: number;
  children: React.ReactNode;
  containerStyle?: CSSProperties;
};

export const H4: FC<Props> = ({style, children, numberOfLines = 0}) => {
  return (
    <h4
      style={{
        fontSize: 18,
        lineHeight: 1.5,
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
    </h4>
  );
};
