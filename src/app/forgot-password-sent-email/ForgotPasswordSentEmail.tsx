'use client';

import Image from 'next/image';
import React, {useEffect} from 'react';

import {svg} from '../../svg';
import {text} from '../../text';
import {URLS} from '../../config';
import {Routes} from '../../routes';
import {theme} from '../../constants';
import {components} from '../../components';

export const ForgotPasswordSentEmail: React.FC = () => {
  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.white;
  }, []);

  const renderBackground = () => {
    return <components.Background version={2} />;
  };

  const renderContent = () => {
    return (
      <main
        className='scrollable container'
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            marginBottom: 10,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <svg.BigLogoSvg />
        </div>
        <text.T12
          style={{
            textAlign: 'center',
            display: 'block',
            fontWeight: 500,
            ...theme.fonts.League_Spartan,
          }}
        >
          Nuton
        </text.T12>
        <Image
          src={`${URLS.MAIN_URL}/assets/images/04.png`}
          alt='Success'
          width={0}
          height={0}
          sizes='100vw'
          priority={true}
          className='status-image'
        />
        <text.H2
          style={{
            marginBottom: 14,
            textTransform: 'capitalize',
            textAlign: 'center',
          }}
          numberOfLines={2}
        >
          Your password has <br />
          been reset!
        </text.H2>
        <text.T16 style={{marginBottom: 24, textAlign: 'center'}}>
          You successfully reset your password. <br />
          Sign in with your new password.
        </text.T16>
        <components.Button
          label='done'
          href={Routes.SIGN_IN}
          containerStyle={{width: '100%'}}
        />
      </main>
    );
  };

  return (
    <components.Screen>
      {renderBackground()}
      {renderContent()}
    </components.Screen>
  );
};
