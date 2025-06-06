import React from 'react';

import {text} from '../text';
import {utils} from '../utils';
import {components} from '../components';
import type {ReviewType} from '../types';

type Props = {
  review: ReviewType;
  isLast: boolean;
};

export const ReviewItem: React.FC<Props> = ({review, isLast}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        marginBottom: isLast ? 0 : 20,
        paddingBottom: 20,
        borderBottom: '1px solid #EBD7EC',
      }}
    >
      <img
        src={review.avatar}
        alt='review'
        style={{width: 40, height: 40, borderRadius: 5, marginRight: 10}}
      />
      <div style={{width: '100%'}}>
        <div style={{...utils.rowCenterSpcBtw()}}>
          <text.T10 style={{marginBottom: 5}}>{review.name}</text.T10>
          <components.Rating />
        </div>
        <text.H5 style={{marginBottom: 6}} numberOfLines={1}>
          {review.name}
        </text.H5>
        <text.T14>{review.comment}</text.T14>
      </div>
    </div>
  );
};
