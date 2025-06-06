'use client';

import Image from 'next/image';
import React, {useEffect} from 'react';

import {svg} from '../../svg';
import {text} from '../../text';
import {URLS} from '../../config';
import {Routes} from '../../routes';
import {theme} from '../../constants';
import {components} from '../../components';

export const PaymentFailed: React.FC = () => {
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
          src={`${URLS.MAIN_URL}/assets/images/09.png`}
          alt='Account created'
          width={0}
          height={0}
          sizes='100vw'
          priority={true}
          className='status-image'
        />
        <text.H2 style={{marginBottom: 10, textTransform: 'capitalize'}}>
          Something went wrong!
        </text.H2>
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
          Please try again to finish <br />
          your payment!
        </p>
        <div
          style={{width: '100%', display: 'flex', flexDirection: 'column'}}
          className='container'
        >
          <components.Button
            label='Try again'
            href={Routes.HOME}
            containerStyle={{width: '100%', marginBottom: 6}}
          />
          <components.Button
            label='Go to my profile'
            href={Routes.PROFILE}
            containerStyle={{width: '100%'}}
            style={{
              fontSize: 14,
              fontWeight: 500,
              backgroundColor: theme.colors.transparent,
              color: theme.colors.mainColor,
            }}
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
