'use client';

import React from 'react';

import {text} from '../text';
import {utils} from '../utils';
import {theme} from '../constants';
import {CourseType} from '../types';

type Props = {
  course: CourseType;
  containerStyle?: React.CSSProperties;
};

export const CoursePrice: React.FC<Props> = ({containerStyle, course}) => {
  return (
    <div style={{...utils.rowCenter(), ...containerStyle}}>
      {course.oldPrice && (
        <span
          style={{
            marginRight: 6,
            color: theme.colors.secondaryTextColor,
            textDecorationLine: 'line-through',
            ...theme.fonts.Lato_400Regular,
            fontSize: 12,
            lineHeight: 1.5,
            marginTop: 3,
          }}
        >
          ${course.oldPrice.toFixed(2)}
        </span>
      )}
      <text.T16 style={{color: theme.colors.mainColor}}>
        ${course.price.toFixed(2)}
      </text.T16>
    </div>
  );
};
