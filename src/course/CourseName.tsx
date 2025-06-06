'use client';

import React from 'react';

import {text} from '../text';
import {CourseType} from '../types';

type Props = {
  course: CourseType;
  shortName?: boolean;
  numberOfLines?: number;
  style?: React.CSSProperties;
};

export const CourseName: React.FC<Props> = ({
  course,
  style,
  shortName,
  numberOfLines,
}) => {
  return (
    <text.H6 style={style} numberOfLines={numberOfLines}>
      {shortName ? course.shortName : course.name}
    </text.H6>
  );
};
