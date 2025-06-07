'use client';

import React from 'react';
import Link from 'next/link';
import {UrlObject} from 'url';
import {theme} from '@/constants';

type Props = {
  href?: string | UrlObject;
  label: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  colorScheme?: 'primary' | 'secondary';
  containerStyle?: React.CSSProperties;
  disabled?: boolean;
};

export const Button: React.FC<Props> = ({
  label,
  style,
  onClick,
  href = '#',
  containerStyle,
  colorScheme = 'primary',
  disabled,
}) => {
  if (href && !onClick) {
    return (
      <div style={{width: '100%', ...containerStyle}}>
        <Link
          href={href ?? '#'}
          style={{
            width: '100%',
            height: 60,
            fontWeight: 700,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 18,
            textTransform: 'capitalize',
            borderRadius: 10,
            border: colorScheme === 'primary' ? 'none' : '1px solid #EEEEEE',
            background: colorScheme === 'primary' ? '#000000' : '#FAF9FF',
            color:
              colorScheme === 'primary'
                ? theme.colors.white
                : theme.colors.mainColor,
            ...theme.fonts.Lato,
            ...style,
            opacity: disabled ? 0.7 : 1,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
          onClick={(e) => {
            if (disabled) {
              e.preventDefault();
            }
          }}
        >
          {label}
        </Link>
      </div>
    );
  }

  return (
    <div style={{width: '100%', ...containerStyle}}>
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          width: '100%',
          height: 60,
          fontWeight: 700,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 18,
          textTransform: 'capitalize',
          borderRadius: 10,
          border: colorScheme === 'primary' ? 'none' : '1px solid #EEEEEE',
          background: colorScheme === 'primary' ? '#000000' : '#FAF9FF',
          color:
            colorScheme === 'primary'
              ? theme.colors.white
              : theme.colors.mainColor,
          ...theme.fonts.Lato,
          ...style,
        }}
        className='flex-center t16'
      >
        {label}
      </button>
    </div>
  );
};
