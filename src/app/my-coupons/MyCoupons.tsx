'use clinet';

import React from 'react';

import {items} from '../../items';
import type {CouponType} from '../../types';
import {components} from '../../components';

type Props = {
  coupons: CouponType[];
};

export const MyCoupons: React.FC<Props> = ({coupons}) => {
  const renderBackground = () => {
    return <components.Background version={1} />;
  };

  const renderHeader = () => {
    return <components.Header title='My Coupons' showGoBack={true} />;
  };

  const renderContent = () => {
    return (
      <main
        className='scrollable container'
        style={{paddingTop: 20, paddingBottom: 20}}
      >
        <ul style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          {coupons.map((coupon) => {
            return <items.CouponItem key={coupon.id} coupon={coupon} />;
          })}
        </ul>
      </main>
    );
  };

  return (
    <components.Screen>
      {renderBackground()}
      {renderHeader()}
      {renderContent()}
    </components.Screen>
  );
};
