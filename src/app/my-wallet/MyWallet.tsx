'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, {useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';

import {URLS} from '../../config';
import {Routes} from '../../routes';
import {theme} from '../../constants';
import {components} from '../../components';

const cards = [
  {
    id: 1,
    image: `${URLS.MAIN_URL}/assets/cards/01.png`,
  },
  {
    id: 2,
    image: `${URLS.MAIN_URL}/assets/cards/01.png`,
  },
  {
    id: 3,
    image: `${URLS.MAIN_URL}/assets/cards/01.png`,
  },
];

const PlusSvg: React.FC = () => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={12} height={12} fill='none'>
      <path
        fill='#111'
        d='M6.612 0v5.124h4.884v1.62H6.612v5.16H4.86v-5.16H0v-1.62h4.86V0h1.752Z'
      />
    </svg>
  );
};

export const MyWallet: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const handleSlideChange = (swiper: any) => {
    setActiveSlide(swiper.activeIndex);
  };

  const renderBackground = () => {
    return <components.Background version={1} />;
  };

  const renderHeader = () => {
    return <components.Header title='My Wallet' showGoBack={true} />;
  };

  const renderCarousel = () => {
    return (
      <section style={{marginBottom: 30}}>
        <Swiper
          slidesPerView={'auto'}
          pagination={{clickable: true}}
          navigation={true}
          mousewheel={true}
          style={{marginBottom: 16}}
          onSlideChange={handleSlideChange}
        >
          {cards.map((image, index) => {
            return (
              <SwiperSlide key={index} style={{padding: '0 20px'}}>
                <Link href={'/'}>
                  <Image
                    src={image.image}
                    alt='Banner'
                    width={0}
                    height={0}
                    sizes='100vw'
                    priority={true}
                    className='clickable'
                    style={{width: '100%', height: 'auto', borderRadius: 10}}
                  />
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
          }}
        >
          {cards.map((_, index) => {
            return (
              <div
                key={_.id}
                style={{
                  width: activeSlide === index ? 25 : 10,
                  height: 2,
                  borderRadius: 10,
                  backgroundColor:
                    activeSlide === index
                      ? theme.colors.mainColor
                      : theme.colors.secondaryTextColor,
                }}
              />
            );
          })}
        </div>
      </section>
    );
  };

  const renderPaymentMethods = () => {
    const btnStyle = {
      borderRadius: 10,
      padding: '18px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      border: '1px solid #FFFFFF',
      backgroundColor: `${'#FFFFFF'}50`,
      boxShadow: '0px 4px 10px rgba(37, 73, 150, 0.05)',
    };

    return (
      <section className='container' style={{marginBottom: '10%'}}>
        <ul>
          <li style={{...btnStyle, marginBottom: 10}} className='clickable'>
            <span style={{...theme.fonts.Lato, fontSize: 16}}>Apple Pay</span>
            <span style={{...theme.fonts.Lato, fontSize: 16}}>$346.84</span>
          </li>
          <li style={{...btnStyle, marginBottom: 10}} className='clickable'>
            <span style={{...theme.fonts.Lato, fontSize: 16}}>Pay Pal</span>
            <span style={{...theme.fonts.Lato, fontSize: 16}}>$91.84</span>
          </li>
          <li style={{...btnStyle}} className='clickable'>
            <span style={{...theme.fonts.Lato, fontSize: 16}}>Payoneer</span>
            <span style={{...theme.fonts.Lato, fontSize: 16}}>
              <PlusSvg />
            </span>
          </li>
        </ul>
      </section>
    );
  };

  const renderButton = () => {
    return (
      <section style={{display: 'flex', justifyContent: 'center'}}>
        <Link
          style={{
            width: 70,
            height: 70,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 35,
            border: '1px solid #FFFFFF',
            backgroundColor: `${'#FFFFFF'}50`,
            boxShadow: '0px 4px 10px rgba(37, 73, 150, 0.05)',
          }}
          href={Routes.ADD_A_NEW_CARD}
        >
          <PlusSvg />
        </Link>
      </section>
    );
  };

  const renderContent = () => {
    return (
      <main className='scrollable' style={{paddingTop: 20, paddingBottom: 20}}>
        {renderCarousel()}
        {renderPaymentMethods()}
        {renderButton()}
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
