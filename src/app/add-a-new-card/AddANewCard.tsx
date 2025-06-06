'use client';

import React from 'react';
import Image from 'next/image';
import {useRouter} from 'next/navigation';

import {components} from '../../components';

export const AddANewCard: React.FC = () => {
  const router = useRouter();

  const renderImageBackground = () => {
    return <components.Background version={1} />;
  };

  const renderHeader = () => {
    return <components.Header title='Add a new card' showGoBack={true} />;
  };

  const renderContent = () => {
    return (
      <main style={{paddingBottom: 0}} className='container'>
        <Image
          src={'assets/other/12.png'}
          alt='card'
          width={0}
          height={0}
          sizes='100vw'
          priority={true}
          style={{
            width: '100%',
            height: 'auto',
            marginTop: 20,
            marginBottom: 30,
          }}
        />
        <components.InputField
          label='Name'
          inputType='text'
          placeholder='Kristin Watson'
          containerStyle={{marginBottom: 10}}
        />
        <components.InputField
          label='Сard number'
          inputType='card number'
          placeholder='7741 6588 2123 6644'
          containerStyle={{marginBottom: 10}}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 10,
            width: '100%',
            marginBottom: 20,
          }}
        >
          <components.InputField
            label='Expiry date'
            placeholder='MM/YY'
            inputType='text'
            containerStyle={{width: 'calc(50% - 5px)'}}
          />
          <components.InputField
            label='CVV'
            placeholder='123'
            inputType='text'
            containerStyle={{width: 'calc(50% - 5px)'}}
          />
        </div>
        <components.Button
          label='Save card'
          style={{marginBottom: 20}}
          onClick={() => router.back()}
        />
      </main>
    );
  };

  return (
    <components.Screen>
      {renderImageBackground()}
      {renderHeader()}
      {renderContent()}
    </components.Screen>
  );
};
