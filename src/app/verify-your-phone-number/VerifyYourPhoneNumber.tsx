'use client';

import React, {useEffect} from 'react';

import {text} from '../../text';
import {Routes} from '../../routes';
import {theme} from '../../constants';
import {components} from '../../components';

export const VerifyYourPhoneNumber: React.FC = () => {
  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.white;
  }, []);

  const renderBackground = () => {
    return <components.Background version={1} />;
  };

  const renderHeader = () => {
    return <components.Header showGoBack={true} title='Verify Number' />;
  };

  const renderContent = () => {
    return (
      <main
        className='scrollable container'
        style={{paddingTop: 30, paddingBottom: 20}}
      >
        <text.T16 style={{marginBottom: 20}}>
          We have sent you an SMS with a code to number +17 0123456789.
        </text.T16>
        <components.InputField
          type='text'
          label='Phone Number'
          inputType='phone'
          placeholder='Enter your phone number'
          containerStyle={{marginBottom: 20}}
        />
        <components.Button label='Confirm' href={Routes.CONFIRMATION_CODE} />
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
