'use client';

import React, {useEffect} from 'react';

import {theme} from '../../../constants';
import {components} from '../../../components';
import type {CourseType} from '../../../types';
import {course as elements} from '../../../course';

type Props = {
  id: string;
  courses: CourseType[];
};

export const CategoryList: React.FC<Props> = ({id, courses}) => {
  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.white;
  }, []);

  const renderBackground = () => {
    return <components.Background version={1} />;
  };

  const renderHeader = () => {
    return (
      <components.Header
        showGoBack={true}
        showFilter={true}
        title='Category List'
      />
    );
  };

  const renderContent = () => {
    return (
      <main style={{paddingBottom: 0}}>
        <div style={{paddingTop: 10, paddingBottom: 20}}>
          {courses.map((course, index, array) => {
            const isLast = index === array.length - 1;
            return (
              <elements.CourseCard
                key={index}
                course={course}
                isLast={isLast}
                section='category list'
              />
            );
          })}
        </div>
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
