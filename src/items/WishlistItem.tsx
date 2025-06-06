'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import {text} from '../text';
import {utils} from '../utils';
import {Routes} from '../routes';
import {theme} from '../constants';
import {CourseType} from '../types';
import {course as elements} from '../course';

type Props = {
  isLast?: boolean;
  course: CourseType;
};

export const WishlistItem: React.FC<Props> = ({course, isLast}) => {
  return (
    <div
      style={{
        width: '100%',
        ...utils.rowCenter(),
        padding: '0 20px 10px 20px',
        marginBottom: isLast ? 0 : 10,
        borderBottom: '1px solid rgba(59, 89, 153, 0.1)',
      }}
    >
      {/* Image */}
      <Link style={{minWidth: 110, height: 110, marginRight: 12}} href={'/'}>
        <Image
          src={course.preview_90x90}
          alt='course'
          width={110}
          height={110}
        />
      </Link>

      {/* Content */}
      <div style={{width: '100%', position: 'relative'}}>
        <div style={{width: 190}}>
          <elements.CourseName
            course={course}
            numberOfLines={2}
            style={{marginBottom: 4}}
          />
        </div>
        <elements.CourseDuration
          course={course}
          containerStyle={{marginBottom: 3}}
        />
        <div style={{...utils.rowCenterSpcBtw()}}>
          <elements.CoursePrice course={course} />
          <Link
            href={Routes.CHECKOUT.replace(':id', String(course.id))}
            style={{
              borderRadius: 5,
              cursor: 'pointer',
              userSelect: 'none',
              padding: '5px 19.5px',
              border: '1px solid #666666',
            }}
          >
            <text.T10
              style={{
                textTransform: 'capitalize',
                color: theme.colors.mainColor,
              }}
            >
              buy now
            </text.T10>
          </Link>
        </div>
        <elements.CourseInWishlist
          course={course}
          size={20}
          style={{position: 'absolute', right: 0, top: 0}}
        />
      </div>
    </div>
  );
};
