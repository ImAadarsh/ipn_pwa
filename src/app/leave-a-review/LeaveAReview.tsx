'use client';

import React, {useState} from 'react';
import Image from 'next/image';

import {text} from '../../text';
import {URLS} from '../../config';
import {utils} from '../../utils';
import {Routes} from '../../routes';
import {theme} from '../../constants';
import {components} from '../../components';

export const LeaveAReview: React.FC = () => {
  const [rating, setRating] = useState<number>(0);

  const renderImageBackground = () => {
    return <components.Background version={1} />;
  };

  const renderHeader = () => {
    return <components.Header title='Leave a Review' showGoBack={true} />;
  };

  const renderContent = () => {
    return (
      <main
        className='container scrollable'
        style={{paddingTop: 10, paddingBottom: 17}}
      >
        <Image
          alt='order successful'
          src={`${URLS.MAIN_URL}/assets/images/06.png`}
          width={0}
          height={0}
          sizes='100vw'
          priority={true}
          style={{
            width: utils.clcPercentage(375, 237),
            height: 'auto',
            margin: '0 auto',
            marginBottom: 14,
          }}
        />
        <text.H2
          style={{
            textAlign: 'center',
            textTransform: 'capitalize',
            marginBottom: 20,
          }}
        >
          Please rate the course!
        </text.H2>
        <components.RatingStars
          containerStyle={{marginBottom: 20}}
          setRating={setRating}
          rating={rating}
        />
        <text.T16
          style={{
            textAlign: 'center',
            marginBottom: 25,
          }}
        >
          Your comments and suggestions help us <br /> improve the service
          quality better!
        </text.T16>
        <div
          className='custom-block'
          style={{
            position: 'relative',
            marginBottom: 25,
            borderRadius: 10,
          }}
        >
          <textarea
            className='input-field'
            style={{
              width: '100%',
              height: 130,
              borderColor: theme.colors.white,
              borderRadius: 10,
              display: 'block',
              boxSizing: 'border-box',
              verticalAlign: 'top',
              overflow: 'auto',
              textAlign: 'left',
              padding: '8px 20px',
              resize: 'none',
              color: theme.colors.mainColor,
              ...theme.fonts.League_Spartan,
              fontSize: 16,
              paddingTop: 8,
              lineHeight: 1.7,
            }}
            placeholder='Enter your comment'
          />
        </div>

        <components.Button label='submit' href={Routes.HOME} />
      </main>
    );
  };

  return (
    <components.Screen>
      {renderImageBackground()}
      {renderHeader()}
      {renderContent()}
    </components.Screen>
  );
};
