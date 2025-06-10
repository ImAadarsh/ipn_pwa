'use client';

import Image from 'next/image';
import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';

import {text} from '../../../text';
import {utils} from '../../../utils';
import {Routes} from '../../../routes';
import {theme} from '../../../constants';
import {components} from '../../../components';
import {course as elements} from '../../../course';

import type {CourseType} from '../../../types';

interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
}

type Props = {
  id: string;
  courses: CourseType[];
};

export const Checkout: React.FC<Props> = ({courses, id}) => {
  const router = useRouter();
  const course = courses.find((course) => String(course.id) === id);
  const [user, setUser] = useState<User | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!course) return null;

  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.white;
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      console.log('User data from localStorage:', parsedUser);
      setUser(parsedUser);
    } else {
      console.log('No user data found in localStorage');
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

  const handlePayment = async () => {
    if (!user || !course) {
      console.log('Missing user or course:', { user, course });
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      console.log('Creating cart with data:', {
        workshop_id: course.id,
        user_id: user.id,
      });

      // Create cart first
      const cartResponse = await fetch('/api/cart/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workshop_id: course.id,
          user_id: user.id,
        }),
      });

      const cartData = await cartResponse.json();
      console.log('Cart creation response:', cartData);

      if (!cartData.success) {
        throw new Error(cartData.message || 'Failed to create cart');
      }

      console.log('Initiating payment with data:', {
        cart_id: cartData.cart_id,
        workshop_id: course.id,
        user_id: user.id,
        amount: course.price,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      });

      // Initiate payment
      const paymentResponse = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart_id: cartData.cart_id,
          workshop_id: course.id,
          user_id: user.id,
          amount: course.price,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
        }),
      });

      const paymentData = await paymentResponse.json();
      console.log('Payment initiation response:', paymentData);

      if (!paymentData.success) {
        throw new Error(paymentData.message || 'Failed to initiate payment');
      }

      // Redirect to payment URL
      window.location.href = paymentData.url;
    } catch (error) {
      console.error('Payment error:', error);
      setError(error instanceof Error ? error.message : 'Failed to process payment');
    } finally {
      setIsProcessing(false);
    }
  };

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

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#ffebee',
              color: '#c62828',
              borderRadius: 8,
              marginBottom: 20,
              fontSize: 14,
            }}>
              {error}
            </div>
          )}

          {/* Total */}
          <div>
            <div style={{...utils.rowCenterSpcBtw(), marginBottom: 7}}>
              <text.T14 style={{color: theme.colors.mainColor}}>
                Subtotal
              </text.T14>
              <text.H6 style={{color: theme.colors.secondaryTextColor}}>
                ₹{course.price}
              </text.H6>
            </div>
            <div style={{...utils.rowCenterSpcBtw(), marginBottom: 17}}>
              <text.T14 style={{color: theme.colors.mainColor}}>
                Discount
              </text.T14>
              <text.H6 style={{color: theme.colors.secondaryTextColor}}>
                -₹0
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
              <text.H4>₹{course.price}</text.H4>
            </div>
          </div>

          {/* Button */}
          <components.Button
            label={isProcessing ? 'Processing...' : 'Pay Now'}
            onClick={handlePayment}
            style={{marginBottom: 20}}
            disabled={isProcessing || !user}
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
