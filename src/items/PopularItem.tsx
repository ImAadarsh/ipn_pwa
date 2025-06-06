import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import {svg} from '../svg';
import {text} from '../text';
import {Routes} from '../routes';
import {theme} from '../constants';
import type {CourseType} from '../types';
import {course as elements} from '../course';

type Props = {
  course: CourseType;
};

export const PopularItem: React.FC<Props> = ({course}) => {
  return (
    <Link
      href={Routes.COURSE_DETAILS.replace(':id', String(course.id))}
      key={course.id}
      style={{
        width: 230,
        cursor: 'pointer',
        userSelect: 'none',
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 120,
          marginBottom: 10,
        }}
      >
        <Image
          width={0}
          height={0}
          sizes='100vw'
          priority={true}
          src={course.bigPreview}
          alt={course.name}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            borderRadius: 10,
            inset: 0,
          }}
        />
        <elements.CourseRating
          course={course}
          containerStyle={{
            position: 'absolute',
            left: 2,
            bottom: 2,
          }}
        />
        <elements.CourseInWishlist
          course={course}
          size={20}
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            margin: 10,
          }}
          customFillColor={theme.colors.white}
          customStrokeColor={theme.colors.white}
        />
      </div>
      <div style={{display: 'flex'}}>
        <div style={{marginRight: 8}}>
          <svg.BtnSmallSvg />
        </div>
        <div>
          <elements.CourseName
            course={course}
            numberOfLines={1}
            shortName={true}
          />
          <text.T16 style={{color: theme.colors.secondaryTextColor}}>
            London Universiry
          </text.T16>
        </div>
      </div>
    </Link>
  );
};
