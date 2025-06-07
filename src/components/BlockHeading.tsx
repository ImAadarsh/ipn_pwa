import React from 'react';
import Link from 'next/link';

import {svg} from '../svg';
import {text} from '../text';

type Props = {
  title: React.ReactNode;
  className?: string;
  containerStyle?: React.CSSProperties;
};

export const BlockHeading: React.FC<Props> = ({
  title,
  className,
  containerStyle,
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        marginBottom: 18,
        alignItems: 'center',
        justifyContent: 'space-between',
        ...containerStyle,
      }}
    >
      <text.H3 style={{textTransform: 'capitalize'}}>{title}</text.H3>
    </div>
  );
};
