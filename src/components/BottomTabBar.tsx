'use client';

import React from 'react';
import {useRouter, usePathname} from 'next/navigation';

import {svg} from '../svg';
import {theme} from '../constants';
import {TabScreens, Routes} from '../routes';

export const BottomTabBar: React.FC = () => {
  const router = useRouter();

  const tabs = [
    {
      id: 1,
      name: TabScreens.HOME,
      icon: svg.HomeTabSvg,
      route: Routes.HOME,
    },
    {
      id: 2,
      name: TabScreens.SEARCH,
      icon: svg.SearchTabSvg,
      route: Routes.SEARCH,
    },
    {
      id: 3,
      name: TabScreens.MY_COURSES,
      icon: svg.MyCourses,
      route: Routes.MY_COURSES,
    },
    {
      id: 5,
      name: TabScreens.PROFILE,
      icon: svg.ProfileTabSvg,
      route: Routes.PROFILE,
    },
  ];

  const pathname = usePathname();

  return (
    <section
      style={{
        backgroundColor: theme.colors.white,
        borderTop: '1px solid #EEEEEE',
        paddingLeft: 10,
        paddingRight: 10,
      }}
    >
      <nav>
        <ul
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}
        >
          {tabs.map((tab) => {
            return (
              <li
                key={tab.id}
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  paddingTop: 15,
                  paddingBottom: 15,
                  borderRadius: 10,
                }}
                className='clickable'
                onClick={() => {
                  router.push(tab.route);
                }}
              >
                <tab.icon
                  key={tab.id}
                  color={
                    pathname === tab.route
                      ? theme.colors.mainColor
                      : theme.colors.secondaryTextColor
                  }
                />
                <span
                  style={{
                    fontSize: 8,
                    marginTop: 5,
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    ...theme.fonts.League_Spartan,
                    fontWeight: 600,
                    color:
                      pathname === tab.route
                        ? theme.colors.mainColor
                        : theme.colors.secondaryTextColor,
                  }}
                >
                  {tab.name}
                </span>
              </li>
            );
          })}
        </ul>
      </nav>
    </section>
  );
};
