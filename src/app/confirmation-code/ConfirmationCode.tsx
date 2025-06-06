'use client';

import React, {useEffect} from 'react';

import {text} from '../../text';
import {Routes} from '../../routes';
import {theme} from '../../constants';
import {components} from '../../components';

export const ConfirmationCode: React.FC = () => {
  const inputs = ['', '', '', '', ''];

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
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value.length > 1) {
        e.target.value = e.target.value.slice(0, 1);
      }
    };

    return (
      <main
        className='scrollable container'
        style={{paddingTop: 30, paddingBottom: 20}}
      >
        <text.T16 style={{marginBottom: 27}}>
          Enter your OTP code here.
        </text.T16>
        <ul
          style={{
            marginBottom: 30,
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 9,
          }}
        >
          {inputs.map((_, index) => (
            <li
              key={index}
              style={{
                display: 'flex',
                width: '100%',
                aspectRatio: 1 / 1,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                border: '1px solid #FFFFFF',
                backgroundColor: `${'#FFFFFF'}50`,
                boxShadow: '0px 4px 10px rgba(37, 73, 150, 0.05)',
              }}
            >
              <input
                maxLength={1}
                style={{
                  textAlign: 'center',
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  fontSize: 20,
                }}
                type='number'
                min={0}
                max={9}
                onInput={handleInput}
              />
            </li>
          ))}
        </ul>
        <text.T16>
          Didn’t receive the OTP?{' '}
          <span
            style={{color: theme.colors.mainColor, fontWeight: 700}}
            className='clickable'
          >
            Resend.
          </span>
        </text.T16>
        <components.Button
          label='verify'
          style={{marginTop: 30}}
          href={Routes.SIGN_UP_ACCOUNT_CREATED}
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
