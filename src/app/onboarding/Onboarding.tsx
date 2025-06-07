'use client';

import Image from 'next/image';
import React, {useEffect, useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import Head from 'next/head';

import {text} from '../../text';
import {URLS} from '../../config';
import {Routes} from '../../routes';
import {theme} from '../../constants';
import {components} from '../../components';

const onboarding = [
  {
    id: 1,
    title: 'Welcome to IPN Academy',
    image: `${URLS.MAIN_URL}/assets/onboarding/01_02.png`,
    description:
      'IPN Academy is your gateway to excellence. \n Discover cutting-edge resources and \n elevate your professional skills.',
  },
  {
    id: 2,
    title: 'Transform Your Career',
    image: `${URLS.MAIN_URL}/assets/onboarding/02_02.png`,
    description:
      'With IPN Academy, unlock new career opportunities. \n Master in-demand skills and \n accelerate your professional growth.',
  },
  {
    id: 3,
    title: 'Advance with Confidence',
    image: `${URLS.MAIN_URL}/assets/onboarding/03_02.png`,
    description:
      'IPN Academy provides a dynamic learning environment. \n Equip yourself with the tools and knowledge \n to move forward with confidence.',
  },
];

export const Onboarding: React.FC = () => {
  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.white;
  }, []);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const renderBackground = () => {
    return <components.Background version={2} />;
  };

  const renderHeader = () => {
    return (
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <Image
          src={`${URLS.MAIN_URL}/assets/other/04.png`}
          alt="IPN Academy Logo"
          width={150}
          height={50}
          priority={true}
        />
      </header>
    );
  };

  const renderCarousel = () => {
    return (
      <section
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Swiper
          onSlideChange={(swiper) => setCurrentSlideIndex(swiper.activeIndex)}
        >
          {onboarding.map((item) => (
            <SwiperSlide key={item.id} style={{width: '100%', height: 'auto'}}>
              <Image
                src={item.image}
                alt='Onboarding'
                width={0}
                height={0}
                sizes='100vw'
                priority={true}
                style={{
                  width: '80%',
                  height: 'auto',
                  margin: '0 auto',
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    );
  };

  const renderDescription = () => {
    const currentItem = onboarding[currentSlideIndex];
    return (
      <section className='container' style={{marginBottom: '8%'}}>
        <text.H2 style={{textAlign: 'center', textTransform: 'capitalize'}}>
          {currentItem.title}
        </text.H2>
        <div style={{maxWidth: 327, margin: '0 auto'}}>
          <p
            className='t16'
            style={{
              marginTop: '14px',
              textAlign: 'center',
              ...theme.fonts.Lato,
              fontSize: 16,
              lineHeight: 1.7,
              color: theme.colors.bodyTextColor,
            }}
          >
            {currentItem.description}
          </p>
        </div>
      </section>
    );
  };

  const renderDots = () => {
    return (
      <section
        className='container'
        style={{
          gap: 10,
          marginBottom: '8%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {onboarding.map((item, index: number) => (
          <div
            key={item.id}
            style={{
              width: currentSlideIndex === index ? 25 : 10,
              height: 2,
              borderRadius: '4px',
              backgroundColor:
                currentSlideIndex === index
                  ? theme.colors.mainColor
                  : theme.colors.secondaryTextColor,
            }}
          />
        ))}
      </section>
    );
  };

  const renderButton = () => {
    return (
      <section style={{padding: 20}}>
        <components.Button label='Get Started' href={Routes.SIGN_IN} />
      </section>
    );
  };

  return (
    <components.Screen>
      <Head>
        <title>Welcome to IPN Academy - Your Gateway to Excellence</title>
        <meta name="description" content="IPN Academy offers cutting-edge resources and professional skills development. Transform your career with our dynamic learning environment." />
        <meta property="og:title" content="Welcome to IPN Academy - Your Gateway to Excellence" />
        <meta property="og:description" content="IPN Academy offers cutting-edge resources and professional skills development. Transform your career with our dynamic learning environment." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://app.ipnacademy.in/" />
        <meta property="og:image" content={`${URLS.MAIN_URL}/assets/other/04.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Welcome to IPN Academy - Your Gateway to Excellence" />
        <meta name="twitter:description" content="IPN Academy offers cutting-edge resources and professional skills development. Transform your career with our dynamic learning environment." />
        <meta name="twitter:image" content={`${URLS.MAIN_URL}/assets/other/04.png`} />
      </Head>
      {renderBackground()}
      {renderHeader()}
      {renderCarousel()}
      {renderDescription()}
      {renderDots()}
      {renderButton()}
    </components.Screen>
  );
};
