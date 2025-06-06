'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import {svg} from '../svg';
import {text} from '../text';
import {utils} from '../utils';
import {Routes} from '../routes';
import {theme} from '../constants';
import type {CourseType} from '../types';
import {course as elements} from '../course';

type Props = {
  index: number;
  course: CourseType;
};

export const NewCourseItem: React.FC<Props> = ({index, course}) => {
  return (
    <Link
      key={course.id}
      style={{
        width: 230,
        height: 300,
        padding: 10,
        cursor: 'pointer',
        userSelect: 'none',
        backgroundColor: index % 2 === 0 ? '#AEB7F8' : '#FE9BB3',
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
      href={Routes.COURSE_DETAILS.replace(':id', String(course.id))}
    >
      <Image
        width={0}
        height={0}
        priority={true}
        sizes='100vw'
        src={course.threeDPreview}
        alt={course.name}
        style={{
          height: 'auto',
          width: '88%',
          margin: '0 auto',
          marginTop: 10,
          marginBottom: 'auto',
        }}
      />
      <elements.CourseName
        course={course}
        numberOfLines={2}
        style={{color: theme.colors.white, marginBottom: 16}}
      />
      <div style={{...utils.rowCenterSpcBtw()}}>
        <div style={{...utils.rowCenter()}}>
          <svg.ClockSvg color='#D7D9FE' />
          <text.T14
            style={{
              marginLeft: 6,
              marginRight: 'auto',
              color: '#D7D9FE',
            }}
          >
            {course.duration}
          </text.T14>
        </div>
        <text.T16
          style={{
            color: theme.colors.white,
            ...theme.fonts.Lato_700Bold,
          }}
        >
          ${course.price.toFixed(2)}
        </text.T16>
      </div>
      <elements.CourseRating
        course={course}
        containerStyle={{
          position: 'absolute',
          top: 2,
          left: 2,
          borderBottomRightRadius: 10,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 0,
        }}
      />
      <elements.CourseInWishlist
        course={course}
        size={20}
        customFillColor={theme.colors.white}
        customStrokeColor={theme.colors.white}
        style={{position: 'absolute', right: 10, top: 10}}
      />
    </Link>
  );
};
