import React from 'react';

import {svg} from '../svg';

export const Twitter: React.FC = () => {
  return (
    <div
      style={{
        width: 60,
        height: 60,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        border: '1px solid #FFFFFF',
        backgroundColor: `${'#FFFFFF'}50`,
        boxShadow: '0px 4px 10px rgba(37, 73, 150, 0.05)',
      }}
    >
      <svg.TwitterSvg />
    </div>
  );
};
