'use client';

import React, {useEffect, useState} from 'react';

import {utils} from '../../utils';
import {theme} from '../../constants';
import {components} from '../../components';
import {course as elements} from '../../course';

import type {CourseType} from '../../types';

type Props = {
  courses: CourseType[];
};

export const MyCourses: React.FC<Props> = ({courses}) => {
  const [selectedTab, setSelectedTab] = useState('ongoing');

  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.white;
  }, []);

  const renderImageBackground = () => {
    return <components.Background version={1} />;
  };

  const renderHeader = () => {
    return <components.Header title='My Courses' />;
  };

  const renderTabs = () => {
    return (
      <div style={{marginTop: 8, ...utils.rowCenter(), marginBottom: 20}}>
        {['ongoing', 'completed'].map((tab) => {
          return (
            <button
              key={tab}
              style={{
                width: '50%',
                padding: '8px 20px',
                textTransform: 'capitalize',
                lineHeight: 1.7,
                textAlign: 'center',
                ...theme.fonts.Lato,
                fontWeight: tab === selectedTab ? 700 : 400,
                fontSize: 14,
                color:
                  tab === selectedTab
                    ? theme.colors.mainColor
                    : theme.colors.secondaryTextColor,
                borderBottom:
                  tab === selectedTab
                    ? '1px solid #111111'
                    : '1px solid #E7E6E7',
              }}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          );
        })}
      </div>
    );
  };

  const renderCourses = () => {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        {courses.map((course: any) => {
          return (
            <elements.CourseCard
              key={course.id}
              course={course}
              section='my courses'
              status={selectedTab as 'ongoing' | 'completed'}
            />
          );
        })}
      </div>
    );
  };

  const renderBottomTabBar = () => {
    return <components.BottomTabBar />;
  };

  const renderContent = () => {
    return (
      <main className='container scrollable'>
        {renderTabs()}
        {renderCourses()}
      </main>
    );
  };

  return (
    <components.Screen>
      {renderImageBackground()}
      {renderHeader()}
      {renderContent()}
      {renderBottomTabBar()}
    </components.Screen>
  );
};
