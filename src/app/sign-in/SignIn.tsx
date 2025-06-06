'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import React, {useEffect, useState} from 'react';

import {svg} from '../../svg';
import {text} from '../../text';
import {Routes} from '../../routes';
import {theme} from '../../constants';
import {components} from '../../components';

export const SignIn: React.FC = () => {
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.white;
  }, []);

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
              Welcome Back!
            </text.H1>
            <text.T18 style={{marginBottom: 26, textAlign: 'center'}}>
              Sign in to continue
            </text.T18>
          </section>

          {/* INPUT FIELDS */}
          <section style={{marginBottom: 20}}>
            <components.InputField
              label='Email'
              inputType='email'
              placeholder='Enter your email'
              containerStyle={{marginBottom: '10px'}}
            />
            <components.InputField
              label='Password'
              inputType='password'
              placeholder='Enter your password'
            />
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
            <text.T16
              onClick={() => router.push(Routes.FORGOT_PASSWORD)}
              style={{color: theme.colors.mainColor, fontWeight: 700}}
              className='clickable'
            >
              Forgot password?
            </text.T16>
          </section>

          {/* BUTTON */}
          <section style={{marginBottom: 20}}>
            <components.Button label='Sign In' href={Routes.HOME} />
          </section>

          {/* REGISTER */}
          <section style={{marginBottom: 38}}>
            <text.T16>
              Don’t have an account?{' '}
              <Link
                href={Routes.SIGN_UP}
                style={{color: theme.colors.mainColor, fontWeight: 'bold'}}
              >
                Sign up.
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
