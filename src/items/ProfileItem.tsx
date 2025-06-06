import React from 'react';
import Link from 'next/link';

import {svg} from '../svg';
import {theme} from '@/constants';

type Props = {
  href: string;
  label: string;
  icon: React.ReactNode;
  linkStyle?: React.CSSProperties;
};

export const ProfileItem: React.FC<Props> = ({
  label,
  icon,
  href,
  linkStyle,
}) => {
  return (
    <Link
      href={href ?? '#'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        height: 56,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 10,
        border: '1px solid #FFFFFF',
        backgroundColor: `${'#FFFFFF'}50`,
        marginBottom: label !== 'Sign out' ? 8 : 0,
        boxShadow: '0px 4px 10px rgba(37, 73, 150, 0.05)',
        ...linkStyle,
      }}
    >
      {icon}
      <span
        style={{
          marginRight: 'auto',
          ...theme.fonts.Lato,
          fontSize: 16,
          color: theme.colors.bodyTextColor,
        }}
      >
        {label}
      </span>
      <svg.RightArrowSvg />
    </Link>
  );
};
