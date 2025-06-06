'use client';

import Image from 'next/image';
import React, {useEffect} from 'react';

import {svg} from '../../svg';
import {URLS} from '../../config';
import {Routes} from '../../routes';
import {theme} from '../../constants';
import {components} from '../../components';

export const ProfileEdit: React.FC = () => {
  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.white;
  }, []);

  const renderBackground = () => {
    return <components.Background version={1} />;
  };

  const renderHeader = () => {
    return <components.Header showGoBack={true} title='Profile Edit' />;
  };

  const renderContent = () => {
    return (
      <main
        className='scrollable container'
        style={{paddingTop: 20, paddingBottom: 20}}
      >
        <div
          style={{
            position: 'relative',
            maxWidth: 120,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: 30,
          }}
          className='center clickable'
        >
          <Image
            src={`${URLS.MAIN_URL}/assets/users/01.png`}
            alt='User'
            width={0}
            height={0}
            sizes='100vw'
            priority={true}
            style={{
              width: '100%',
              height: 'auto',
              margin: '0 auto',
              borderRadius: '50%',
            }}
          />
          <div style={{position: 'absolute', bottom: -10, right: 0}}>
            <svg.CameraSvg />
          </div>
        </div>
        <components.InputField
          label='Name'
          type='text'
          inputType='username'
          placeholder='Kristin Watson'
          containerStyle={{marginBottom: 10}}
        />
        <components.InputField
          label='Email'
          type='email'
          inputType='email'
          placeholder='kristinwatson@mail.com'
          containerStyle={{marginBottom: 10}}
        />
        <components.InputField
          label='Phone number'
          type='tel'
          inputType='phone'
          placeholder='+17 123456789'
          containerStyle={{marginBottom: 10}}
        />
        <components.InputField
          label='location'
          type='text'
          placeholder='Chicago, USA'
          inputType='location'
          containerStyle={{marginBottom: 20}}
        />
        <components.Button label='save changes' href={Routes.PROFILE} />
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
