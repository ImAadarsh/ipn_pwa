'use client';

import React from 'react';

import {text} from '../../text';
import {components} from '../../components';
import {theme} from '@/constants';

const privacyPolicy = [
  {
    id: 1,
    title: '1. Terms',
    content:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    id: 2,
    title: '2. Use license',
    content:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    id: 3,
    title: '3. Disclaimer',
    content:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
];

export const PrivacyPolicy: React.FC = () => {
  const renderBackground = () => {
    return <components.Background version={1} />;
  };

  const renderHeader = () => {
    return <components.Header title='Privacy Policy' showGoBack={true} />;
  };

  const renderContent = () => {
    return (
      <main
        className='container scrollable'
        style={{paddingBottom: 20, paddingTop: 20}}
      >
        {privacyPolicy.map((item) => {
          return (
            <div style={{marginBottom: '10%'}} key={item.id}>
              <text.H5 style={{marginBottom: 10}}>{item.title}</text.H5>
              <p
                style={{
                  ...theme.fonts.Lato,
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: theme.colors.bodyTextColor,
                }}
              >
                {item.content}
              </p>
            </div>
          );
        })}
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
