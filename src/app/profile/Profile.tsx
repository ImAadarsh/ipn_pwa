'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, {useEffect, useState} from 'react';

import {text} from '../../text';
import {URLS} from '../../config';
import {items} from '../../items';
import {Routes} from '../../routes';
import {theme} from '../../constants';
import {components} from '../../components';

interface User {
  id: number;
  name: string | null;
  email: string | null;
  mobile: string;
  profile: string;
  designation: string | null;
  institute_name: string | null;
  city: string | null;
  user_type: string;
  membership: number;
  school_id: number | null;
  sessionToken: string;
}

const HeartSvg: React.FC = () => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={20} height={19} fill='none'>
      <path
        stroke='#111'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M17.367 3.586a4.619 4.619 0 0 0-1.488-.928 4.87 4.87 0 0 0-3.508 0 4.619 4.619 0 0 0-1.488.928L10 4.41l-.883-.824a4.756 4.756 0 0 0-3.242-1.254c-1.216 0-2.382.451-3.242 1.254-.86.802-1.342 1.89-1.342 3.025s.483 2.223 1.342 3.026l.884.824L10 16.512l6.483-6.05.884-.825c.425-.397.763-.87.994-1.388.23-.52.349-1.076.349-1.638 0-.562-.119-1.118-.35-1.637-.23-.52-.567-.991-.993-1.388v0Z'
      />
    </svg>
  );
};

const GiftSvg: React.FC = () => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={20} height={20} fill='none'>
      <path
        stroke='#111'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M16.667 10v8.333H3.333V10M18.333 5.833H1.667V10h16.666V5.833ZM10 18.333v-12.5M10 5.833H6.25a2.083 2.083 0 1 1 0-4.166c2.917 0 3.75 4.166 3.75 4.166ZM10 5.833h3.75a2.083 2.083 0 0 0 0-4.166c-2.917 0-3.75 4.166-3.75 4.166Z'
      />
    </svg>
  );
};

const HelpCircleSvg: React.FC = () => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={20} height={20} fill='none'>
      <path
        stroke='#111'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M10 18.333a8.333 8.333 0 1 0 0-16.666 8.333 8.333 0 0 0 0 16.666Z'
      />
      <path
        stroke='#111'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M7.575 7.5a2.5 2.5 0 0 1 4.858.833c0 1.667-2.5 2.5-2.5 2.5M10 14.167h.008'
      />
    </svg>
  );
};

const DocumentSvg: React.FC = () => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={20} height={20} fill='none'>
      <path
        stroke='#111'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M11.667 1.667H5a1.667 1.667 0 0 0-1.667 1.666v13.334A1.667 1.667 0 0 0 5 18.333h10a1.667 1.667 0 0 0 1.667-1.666v-10l-5-5Z'
      />
      <path
        stroke='#111'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M11.667 1.667v5h5M13.333 10.833H6.667M13.333 14.167H6.667M8.333 7.5H6.667'
      />
    </svg>
  );
};

const EditSvg: React.FC = () => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={40} height={40} fill='none'>
      <rect width={40} height={40} fill='#fff' rx={20} />
      <path
        stroke='#333'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M20 25.333h6M23 14.333a1.414 1.414 0 0 1 2 2l-8.333 8.334-2.667.666.667-2.666L23 14.333Z'
      />
    </svg>
  );
};

const LogOutSvg: React.FC = () => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={20} height={20} fill='none'>
      <path
        stroke='#111'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M7.5 17.5H4.167A1.667 1.667 0 0 1 2.5 15.833V4.167A1.667 1.667 0 0 1 4.167 2.5H7.5M13.333 14.167 17.5 10l-4.167-4.167M17.5 10h-10'
      />
    </svg>
  );
};

const menu = [
  {
    id: 1,
    title: 'Wishlist',
    icon: <HeartSvg />,
    url: Routes.MY_WISHLIST,
  },
  {
    id: 2,
    title: 'Coupons',
    icon: <GiftSvg />,
    url: Routes.MY_COUPONS,
  },
  {
    id: 3,
    title: 'Transactions',
    icon: <DocumentSvg />,
    url: Routes.TRANSACTIONS,
  },
  {
    id: 4,
    title: 'Help & Support',
    icon: <HelpCircleSvg />,
    url: Routes.HELP_AND_SUPPORT,
  },
  {
    id: 5,
    title: 'Privacy Policy',
    icon: <DocumentSvg />,
    url: Routes.PRIVACY_POLICY,
  },
];

export const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.white;
    
    // Load user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('sessionToken');
  };

  const renderBackground = () => {
    return <components.Background version={1} />;
  };

  const renderHeader = () => {
    return <components.Header title='My profile' />;
  };

  const renderContent = () => {
    if (!user) {
      return null;
    }

    return (
      <main
        className='scrollable'
        style={{paddingTop: '8%', paddingBottom: '8%'}}
      >
        {/* USER INFO */}
        <section style={{marginBottom: 20}}>
          <Link
            href={Routes.PROFILE_EDIT}
            style={{
              position: 'relative',
              display: 'flex',
              marginBottom: 20,
            }}
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
                src={user.profile ? `${URLS.IMAGE_URL}${user.profile}` : `${URLS.IMAGE_URL}public/img/workshop/oqDdQPGw3UZnIlmNZojNfTvHHVA9KHjO1OqDHJE6.png`}
                alt='User'
                width={120}
                height={120}
                style={{
                  width: '100%',
                  height: 'auto',
                  margin: '0 auto',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
              <div style={{position: 'absolute', bottom: -10, right: 0}}>
                <EditSvg />
              </div>
            </div>
          </Link>

          <text.H2 style={{textAlign: 'center'}}>{user.name || 'User'}</text.H2>
          <span
            style={{
              textAlign: 'center',
              display: 'block',
              marginBottom: 20,
              ...theme.fonts.Lato,
              fontSize: 16,
              color: theme.colors.bodyTextColor,
            }}
          >
            {user.email || user.mobile}
          </span>
        </section>

        {/* MENU */}
        <section>
          <div className='container'>
            {menu.map((item) => (
              <items.ProfileItem
                key={item.id}
                label={item.title}
                icon={item.icon}
                href={item.url}
              />
            ))}
            <Link href={Routes.SIGN_IN} onClick={handleSignOut}>
              <items.ProfileItem
                label='Sign out'
                href={Routes.SIGN_IN}
                icon={<LogOutSvg />}
              />
            </Link>
          </div>
        </section>
      </main>
    );
  };

  const renderBottomTabBar = () => {
    return <components.BottomTabBar />;
  };

  return (
    <components.Screen>
      {renderBackground()}
      {renderHeader()}
      {renderContent()}
      {renderBottomTabBar()}
    </components.Screen>
  );
};
