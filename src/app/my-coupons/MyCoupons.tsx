'use client';

import React, {useEffect, useState} from 'react';

import {items} from '../../items';
import type {CouponType} from '../../types';
import {components} from '../../components';

interface Coupon {
  id: number;
  coupon_code: string;
  flat_discount: number;
  valid_till: string;
  count: number;
  school_id: number | null;
  workshop_id: number | null;
  workshop_type: number;
  is_visible: number;
  workshop_name?: string;
  school_name?: string;
}

type Props = {
  coupons?: any[];
};

export const MyCoupons: React.FC<Props> = ({coupons: initialCoupons}) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch('/api/coupons/list');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      if (!text) {
        throw new Error('Empty response from server');
      }
      try {
        const data = JSON.parse(text);
        if (data.success) {
          setCoupons(data.coupons);
        } else {
          throw new Error(data.message || 'Failed to fetch coupons');
        }
      } catch (e) {
        throw new Error('Invalid JSON response from server');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const renderBackground = () => {
    return <components.Background version={1} />;
  };

  const renderHeader = () => {
    return <components.Header title='My Coupons' showGoBack={true} />;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <main className='scrollable container' style={{paddingTop: 20, paddingBottom: 20}}>
          <div className="flex justify-center items-center min-h-[200px]">
            Loading...
          </div>
        </main>
      );
    }

    if (error) {
      return (
        <main className='scrollable container' style={{paddingTop: 20, paddingBottom: 20}}>
          <div className="text-red-500 text-center p-4">
            {error}
          </div>
        </main>
      );
    }

    if (coupons.length === 0) {
      return (
        <main className='scrollable container' style={{paddingTop: 20, paddingBottom: 20}}>
          <div className="text-center p-4 text-gray-500">
            No coupons available
          </div>
        </main>
      );
    }

    return (
      <main
        className='scrollable container'
        style={{paddingTop: 20, paddingBottom: 20}}
      >
        <ul style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          {coupons.map((coupon) => {
            const couponData: CouponType = {
              id: coupon.id,
              activationCode: coupon.coupon_code,
              discount: coupon.flat_discount,
              title: coupon.workshop_name || 'All Workshops'
            };
            return <items.CouponItem key={coupon.id} coupon={couponData} />;
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
