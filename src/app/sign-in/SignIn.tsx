'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import React, {useEffect, useState} from 'react';

import {svg} from '../../svg';
import {text} from '../../text';
import {Routes} from '../../routes';
import {theme} from '../../constants';
import {components} from '../../components';

// Add type definitions for phone.email
declare global {
  interface Window {
    phoneEmailListener: ((userObj: { user_json_url: string }) => void) | null;
  }
}

interface User {
  id: number;
  name: string | null;
  email: string | null;
  mobile: string;
  profile: string;
  designation: string | null;
  institute_name: string | null;
  city: string | null;
  user_type: string;
  membership: number;
  school_id: number | null;
  sessionToken: string;
}

export const SignIn: React.FC = () => {
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.white;

    // Load the external script
    const script = document.createElement('script');
    script.src = "https://www.phone.email/sign_in_button_v1.js";
    script.async = true;
    document.querySelector('.pe_signin_button')?.appendChild(script);

    // Define the listener function
    const handlePhoneEmail = async (userObj: { user_json_url: string }) => {
      try {
        setIsVerifying(true);
        setVerificationStatus('Verifying...');
        
        // Call your API endpoint to verify the user
        const response = await fetch('/api/auth/verify-phone', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_json_url: userObj.user_json_url }),
        });

        const data = await response.json();
        
        if (data.success) {
          // Store user details in localStorage
          const user: User = data.user;
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('sessionToken', user.sessionToken);
          
          // If remember me is checked, store for longer duration
          if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
          }

          setVerificationStatus('Verification successful!');
          // Redirect to home page or dashboard
          router.push(Routes.HOME);
        } else {
          setVerificationStatus(data.message || 'Verification failed. Please try again.');
          console.error('Verification failed:', data);
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('An error occurred. Please try again.');
      } finally {
        setIsVerifying(false);
      }
    };

    window.phoneEmailListener = handlePhoneEmail;

    return () => {
      // Cleanup the listener function when the component unmounts
      window.phoneEmailListener = null;
    };
  }, [router, rememberMe]);

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

          {/* PHONE VERIFICATION */}
          <section style={{marginBottom: 20}}>
            <div className="pe_signin_button" data-client-id="15695407177920574360"></div>
            {verificationStatus && (
              <text.T16 
                style={{
                  marginTop: 10, 
                  textAlign: 'center', 
                  color: verificationStatus.includes('successful') ? 'green' : 'red',
                  opacity: isVerifying ? 0.7 : 1
                }}
              >
                {verificationStatus}
              </text.T16>
            )}
          </section>

          {/* REMEMBER ME */}
          <section
            style={{
              marginBottom: 30,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                gap: '10px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
              className='clickable'
              onClick={() => setRememberMe(!rememberMe)}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 4,
                  border: '1px solid #333333',
                }}
              >
                {rememberMe && <svg.InputCheckSvg />}
              </div>
              <text.T16>Remember me</text.T16>
            </div>
          </section>

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
