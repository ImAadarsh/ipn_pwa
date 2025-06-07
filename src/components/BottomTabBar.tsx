'use client';

import React from 'react';
import {useRouter, usePathname} from 'next/navigation';

// import {svg} from '../svg'; // Removed as we're using image files
import {theme} from '../constants';
import {TabScreens, Routes} from '../routes';

export const BottomTabBar: React.FC = () => {
  const router = useRouter();

  const tabs = [
    {
      id: 1,
      name: TabScreens.HOME,
      imageSrc: '/icons/home.png', // Path to the new home icon
      route: Routes.HOME,
    },
    {
      id: 2,
      name: TabScreens.SEARCH,
      imageSrc: '/icons/search.png', // Path to the new search icon
      route: Routes.SEARCH,
    },
    {
      id: 3,
      name: TabScreens.MY_COURSES,
      imageSrc: '/icons/workshop.png', // Path to the new workshop icon (for My Courses)
      route: Routes.MY_COURSES,
    },
    {
      id: 5,
      name: TabScreens.PROFILE,
      imageSrc: '/icons/profile.png', // Path to the new profile icon
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
            const isActive = pathname === tab.route;
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
                <img 
                  src={tab.imageSrc}
                  alt={tab.name}
                  style={{
                    width: isActive ? 30 : 24, // Increased size when active
                    height: isActive ? 30 : 24, // Increased size when active
                    opacity: isActive ? 1 : 0.6,
                    transition: 'all 0.3s ease-in-out' // Smooth transition
                  }}
                />
                <span
                  style={{
                    fontSize: 8,
                    marginTop: 5,
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    ...theme.fonts.League_Spartan,
                    fontWeight: 600,
                    color: isActive 
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
