'use client';

import React from 'react';

import {theme} from '../constants';
import type {CouponType} from '../types';

type Props = {
  coupon: CouponType;
};

export const CouponItem: React.FC<Props> = ({coupon}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        alert(`${coupon.activationCode} code copied to clipboard`);
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  return (
    <li
      style={{
        padding: 20,
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        border: '1px solid #FFFFFF',
        backgroundColor: `${'#FFFFFF'}50`,
        boxShadow: '0px 4px 10px rgba(37, 73, 150, 0.05)',
      }}
      className='clickable'
      onClick={() => copyToClipboard(coupon.activationCode)}
    >
      <span style={{...theme.fonts.Lato, fontSize: 30, fontWeight: 700}}>
        {coupon.discount}
      </span>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginLeft: 10,
          alignItems: 'center',
        }}
      >
        <span
          style={{
            ...theme.fonts.Lato,
            fontSize: 14,
            color: theme.colors.mainColor,
          }}
        >
          %
        </span>
        <span
          style={{
            ...theme.fonts.Lato,
            fontSize: 10,
            color: theme.colors.mainColor,
          }}
        >
          Off
        </span>
      </div>
      <div
        style={{
          width: 1,
          height: 22,
          marginLeft: 10,
          marginRight: 10,
          backgroundColor: theme.colors.mainColor,
        }}
      />
      <div style={{display: 'flex', flexDirection: 'column', marginLeft: 10}}>
        <span
          style={{
            ...theme.fonts.Lato,
            fontSize: 12,
            lineHeight: 1.2,
            fontWeight: 700,
            marginBottom: 4,
            color: theme.colors.mainColor,
          }}
        >
          {coupon.title}
        </span>
        <span
          style={{
            ...theme.fonts.Lato,
            fontSize: 10,
            lineHeight: 1.2,
            color: theme.colors.bodyTextColor,
          }}
        >
          Activation code: {coupon.activationCode}
        </span>
      </div>
    </li>
  );
};
