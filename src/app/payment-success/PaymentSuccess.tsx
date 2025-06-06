'use client';

import Image from 'next/image';
import React, {useEffect} from 'react';

import {svg} from '../../svg';
import {text} from '../../text';
import {URLS} from '../../config';
import {Routes} from '../../routes';
import {theme} from '../../constants';
import {components} from '../../components';

export const PaymentSuccess: React.FC = () => {
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
          style={{marginBottom: 10, display: 'flex', justifyContent: 'center'}}
        >
          <svg.BigLogoSvg />
        </div>
        <span
          className='t12'
          style={{
            textAlign: 'center',
            display: 'block',
            fontWeight: 500,
            color: theme.colors.mainColor,
            ...theme.fonts.League_Spartan,
          }}
        >
          Nuton
        </span>
        <Image
          src={`${URLS.MAIN_URL}/assets/images/08.png`}
          alt='Account created'
          width={0}
          height={0}
          sizes='100vw'
          priority={true}
          className='status-image'
        />
        <text.H2 style={{marginBottom: 10}}>Congratulations!</text.H2>
        <p
          className='t16'
          style={{
            marginBottom: 24,
            textAlign: 'center',
            fontSize: 16,
            lineHeight: 1.7,
            color: theme.colors.bodyTextColor,
            ...theme.fonts.Lato,
          }}
        >
          Your payment is successful! <br />
          Thank you!
        </p>
        <div className='container'>
          <components.Button
            label='Continue'
            href={Routes.SIGN_IN}
            containerStyle={{width: '100%'}}
          />
        </div>
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
