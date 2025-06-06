'use client';

import React, {useEffect} from 'react';
import Link from 'next/link';

import {svg} from '../../svg';
import {text} from '../../text';
import {Routes} from '../../routes';
import {theme} from '../../constants';
import {components} from '../../components';

export const SignUp: React.FC = () => {
  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.white;
  }, []);

  const renderBackground = () => {
    return <components.Background version={1} />;
  };

  const renderHeader = () => {
    return <components.Header title='Sign up' showGoBack={true} />;
  };

  const renderContent = () => {
    return (
      <main
        className='scrollable container'
        style={{paddingTop: '8%', paddingBottom: '8%'}}
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
          <text.H1
            style={{
              marginBottom: 30,
              textAlign: 'center',
              textTransform: 'capitalize',
            }}
          >
            Sign up
          </text.H1>
        </section>

        {/* INPUT FIELDS */}
        <section style={{marginBottom: 20}}>
          <components.InputField
            label='Name'
            inputType='text'
            placeholder='Enter your name'
            containerStyle={{marginBottom: '10px'}}
          />
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
            containerStyle={{marginBottom: '10px'}}
          />
          <components.InputField
            label='Confirm Password'
            inputType='password'
            placeholder='Confirm your password'
          />
        </section>

        {/* SIGN IN BUTTON */}
        <section style={{marginBottom: 14}}>
          <components.Button
            label='Sign up'
            href={Routes.VERIFY_YOUR_PHONE_NUMBER}
          />
        </section>

        {/* REGISTER */}
        <section style={{marginBottom: '10%'}}>
          <text.T16>
            Already have an account?{' '}
            <Link
              href={Routes.SIGN_IN}
              style={{color: theme.colors.mainColor, fontWeight: 700}}
            >
              Sign in.
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
