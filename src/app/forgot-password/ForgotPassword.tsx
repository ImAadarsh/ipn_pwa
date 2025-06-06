'use client';

import React, {useEffect} from 'react';

import {text} from '../../text';
import {Routes} from '../../routes';
import {theme} from '../../constants';
import {components} from '../../components';

export const ForgotPassword: React.FC = () => {
  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.white;
  }, []);

  const renderBackground = () => {
    return <components.Background version={1} />;
  };

  const renderHeader = () => {
    return <components.Header title='Forgot password' showGoBack={true} />;
  };

  const renderContent = () => {
    return (
      <main
        className='scrollable container'
        style={{paddingTop: 30, paddingBottom: 20}}
      >
        <text.T16 style={{marginBottom: 20}}>
          Please enter your email address. You will receive a link to create a
          new password via email.
        </text.T16>
        <components.InputField
          label='Email'
          type='email'
          inputType='email'
          placeholder='Enter your email'
          containerStyle={{marginBottom: 20}}
        />
        <components.Button label='Send' href={Routes.NEW_PASSWORD} />
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
