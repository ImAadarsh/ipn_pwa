'use client';

import React from 'react';

import {text} from '../../text';
import {Routes} from '../../routes';
import {components} from '../../components';

export const NewPassword: React.FC = () => {
  const renderBackground = () => {
    return <components.Background version={1} />;
  };

  const renderHeader = () => {
    return <components.Header title='Reset password' showGoBack={true} />;
  };

  const renderContent = () => {
    return (
      <main
        className='scrollable container'
        style={{paddingTop: 30, paddingBottom: 20}}
      >
        <text.T16 style={{marginBottom: 20}}>
          Enter new password and confirm.
        </text.T16>
        <components.InputField
          label='New Password'
          inputType='password'
          placeholder='Enter your password'
          containerStyle={{marginBottom: 10}}
        />
        <components.InputField
          label='Confirm Password'
          inputType='password'
          placeholder='Confirm your password'
          containerStyle={{marginBottom: '20px'}}
        />
        <components.Button
          label='Change Password'
          href={Routes.FORGOT_PASSWORD_SENT_EMAIL}
        />
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
