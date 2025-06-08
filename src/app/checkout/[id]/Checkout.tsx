'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';

import {svg} from '../../../svg';
import {text} from '../../../text';
import {utils} from '../../../utils';
import {Routes} from '../../../routes';
import {theme} from '../../../constants';
import {components} from '../../../components';
import {course as elements} from '../../../course';

import type {CourseType} from '../../../types';

interface User {
  id: number;
}

type Props = {
  id: string;
  courses: CourseType[];
};

export const Checkout: React.FC<Props> = ({courses, id}) => {
  const router = useRouter();
  const course = courses.find((course) => String(course.id) === id);
  const [user, setUser] = useState<User | null>(null);

  if (!course) return null;

  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.white;
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (user && course) {
      const checkPurchase = async () => {
        try {
          const response = await fetch(`/api/check-purchase?userId=${user.id}&workshopId=${course.id}`);
          const data = await response.json();

          if (data.success && data.isPurchased) {
            // If purchased, redirect to workshop detail page
            router.replace(Routes.COURSE_DETAILS.replace(':id', String(course.id)));
          }
        } catch (error) {
          console.error('Error checking purchase status on checkout:', error);
        }
      };
      checkPurchase();
    }
  }, [user, course, router]);

  const renderImageBackground = () => {
    return <components.Background version={1} />;
  };

  const renderHeader = () => {
    return <components.Header title='Checkout' showGoBack={true} />;
  };

  const renderContent = () => {
    return (
      <main style={{paddingBottom: 0}} className='container'>
        <div style={{paddingTop: 20}}>
          {/* Course */}
          <div style={{...utils.rowCenter(), marginBottom: 30}}>
            <Image
              width={0}
              height={0}
              sizes='100vw'
              priority={true}
              src={course?.preview_90x90 || ''}
              alt={course?.name || ''}
              style={{width: 80, height: 80, marginRight: 12}}
            />
            <div>
              <text.T14
                style={{...theme.fonts.Lato_700Bold, marginBottom: 3}}
                numberOfLines={2}
              >
                {course?.name}
              </text.T14>
              <elements.CoursePrice course={course} />
            </div>
          </div>
          {/* Payment method */}
          <Link
            href={Routes.CHOOSE_PAYMENT_METHOD}
            className='custom-block'
            style={{
              padding: '19px 20px',
              ...utils.rowCenter(),
              marginBottom: 20,
            }}
          >
            <text.T16 style={{marginRight: 'auto'}}>Payment method</text.T16>
            <text.T16 style={{marginRight: 6}}>**** 6644</text.T16>
            <svg.RightArrowSvg />
          </Link>
          {/* Apply a coupon */}
          <div
            style={{...utils.rowCenter(), marginBottom: 30}}
            className='clickable'
          >
            <text.T14 style={{marginRight: 8, color: theme.colors.mainColor}}>
              Apply a coupon
            </text.T14>
            <svg.RightArrowSvg />
          </div>
          {/* Total */}
          <div>
            <div style={{...utils.rowCenterSpcBtw(), marginBottom: 7}}>
              <text.T14 style={{color: theme.colors.mainColor}}>
                Subtotal
              </text.T14>
              <text.H6 style={{color: theme.colors.secondaryTextColor}}>
                ${course.price}
              </text.H6>
            </div>
            <div style={{...utils.rowCenterSpcBtw(), marginBottom: 17}}>
              <text.T14 style={{color: theme.colors.mainColor}}>
                Discount
              </text.T14>
              <text.H6 style={{color: theme.colors.secondaryTextColor}}>
                -$0
              </text.H6>
            </div>
            <div
              style={{
                height: 1,
                backgroundColor: '#D8CBE3',
                width: '100%',
                marginBottom: 10,
              }}
            />
            <div style={{...utils.rowCenterSpcBtw(), marginBottom: 17}}>
              <text.H4>Total</text.H4>
              <text.H4>${course.price}</text.H4>
            </div>
          </div>
          {/* Button */}
          <components.Button
            label='Pay Now'
            style={{marginBottom: 20}}
            href={Routes.CHOOSE_PAYMENT_METHOD}
          />
        </div>
      </main>
    );
  };

  return (
    <components.Screen>
      {renderImageBackground()}
      {renderHeader()}
      {renderContent()}
    </components.Screen>
  );
};
