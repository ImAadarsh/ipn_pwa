'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import React, {useEffect, useState} from 'react';

import {svg} from '../../svg';
import {text} from '../../text';
import {Routes} from '../../routes';
import {theme} from '../../constants';
import {components} from '../../components';
import { PhoneEmailButton } from '../../components/PhoneEmailButton';

export const SignIn: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.white;
  }, []);

  const handleVerificationSuccess = async (userJsonUrl: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/verify-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userJsonUrl }),
      });

      const data = await response.json();

      if (data.success) {
        // Store the token in localStorage or your preferred storage method
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userId', data.userId.toString());
        
        // Redirect to home page
        router.push(Routes.HOME);
      } else {
        setError('Failed to verify phone number. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderBackground = () => {
    return <components.Background version={1} />;
  };

  const renderHeader = () => {
    return <components.Header title='Sign In' showGoBack={true} />;
  };

  const renderContent = () => {
    return (
      <main
        className='scrollable container'
        style={{paddingTop: 10, paddingBottom: 10}}
      >
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          {/* LOGO */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            <svg.SmallLogoSvg />
          </div>

          {/* HEADER */}
          <section>
            <text.H1 style={{marginBottom: 14, textAlign: 'center'}}>
              Welcome Back to IPN Academy!
            </text.H1>
            <text.T18 style={{marginBottom: 26, textAlign: 'center'}}>
              Sign in to continue
            </text.T18>
          </section>

          {/* ERROR MESSAGE */}
          {error && (
            <section style={{ marginBottom: 20, color: 'red', textAlign: 'center' }}>
              <text.T16>{error}</text.T16>
            </section>
          )}

          {/* PHONE.EMAIL BUTTON */}
          <section style={{ marginBottom: 20 }}>
            <PhoneEmailButton onVerificationSuccess={handleVerificationSuccess} />
          </section>

          {/* LOADING INDICATOR */}
          {isLoading && (
            <section style={{ textAlign: 'center', marginBottom: 20 }}>
              <text.T16>Verifying...</text.T16>
            </section>
          )}

          {/* REGISTER */}
          <section style={{marginBottom: 38}}>
            <text.T16>
              Don't have an account?{' '}
              <Link
                href={Routes.SIGN_UP}
                style={{color: theme.colors.mainColor, fontWeight: 'bold'}}
              >
                Create Free Account.
              </Link>
            </text.T16>
          </section>

          {/* SOCIALS */}
          <section className='container' style={{marginBottom: 30}}>
            <ul
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 10,
                justifyContent: 'center',
              }}
            >
              <li className='clickable'>
                <components.Facebook />
              </li>
              <li className='clickable'>
                <components.Twitter />
              </li>
              <li className='clickable'>
                <components.Google />
              </li>
            </ul>
          </section>
        </section>
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
