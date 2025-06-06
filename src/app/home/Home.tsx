'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, {useEffect, useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';

import {svg} from '../../svg';
import {text} from '../../text';
import {URLS} from '../../config';
import {items} from '../../items';
import {Routes} from '../../routes';
import {theme} from '../../constants';
import {components} from '../../components';

import type {CourseType} from '../../types';
import type {CategoryType} from '../../types';
import type {CarouselType} from '../../types';
import {course as elements} from '../../course';

type Props = {
  courses: CourseType[];
  categories: CategoryType[];
};

const SearchSvg: React.FC = () => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={14} height={14} fill='none'>
      <path
        fill='#666'
        fillRule='evenodd'
        d='M6.417 2.188a4.23 4.23 0 1 0 0 8.458 4.23 4.23 0 0 0 0-8.459ZM1.313 6.417a5.104 5.104 0 1 1 10.208 0 5.104 5.104 0 0 1-10.209 0Z'
        clipRule='evenodd'
      />
      <path
        fill='#666'
        fillRule='evenodd'
        d='M9.3 9.3a.583.583 0 0 1 .825 0l2.537 2.537a.583.583 0 0 1-.825.825L9.3 10.125a.583.583 0 0 1 0-.825Z'
        clipRule='evenodd'
      />
    </svg>
  );
};

const carousel: CarouselType[] = [
  {
    id: 1,
    image: `${URLS.MAIN_URL}/assets/banners/01.png`,
  },
  {
    id: 2,
    image: `${URLS.MAIN_URL}/assets/banners/01.png`,
  },
  {
    id: 3,
    image: `${URLS.MAIN_URL}/assets/banners/01.png`,
  },
];

export const Home: React.FC<Props> = ({courses, categories}) => {
  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.white;
  }, []);

  const [activeSlide, setActiveSlide] = useState(0);

  const handleSlideChange = (swiper: any) => {
    setActiveSlide(swiper.activeIndex);
  };

  const renderSearchBar = () => {
    return (
      <section className='container' style={{marginTop: 10, marginBottom: 20}}>
        <Link
          href={Routes.CATEGORY_LIST}
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: 20,
            borderRadius: 10,
            border: `1px solid ${theme.colors.white}50`,
            backgroundColor: `${theme.colors.white}50`,
            boxShadow: '0px 4px 10px rgba(37, 73, 150, 0.05)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 4,
            }}
          >
            <Image
              alt='User'
              width={24}
              height={24}
              sizes='100vw'
              priority={true}
              src={`${URLS.MAIN_URL}/assets/users/01.png`}
            />
            <text.H2 style={{lineHeight: 1.2, marginTop: 4}}>
              Hello, Kristin
            </text.H2>
          </div>
          <span
            style={{
              ...theme.fonts.Lato,
              fontSize: 14,
              fontWeight: 400,
              marginBottom: 12,
              color: theme.colors.bodyTextColor,
            }}
          >
            Find a course you want to learn.
          </span>
          <button
            style={{
              width: '100%',
              height: 42,
              borderRadius: 5,
              display: 'flex',
              gap: 8,
              flexDirection: 'row',
              alignItems: 'center',
              padding: '0 16px',
              background: `linear-gradient(90deg, rgba(246, 189, 229, 0.5) 0%, rgba(174, 183, 248, 0.5) 100%)`,
            }}
          >
            <SearchSvg />
            <span
              style={{
                ...theme.fonts.Lato,
                fontSize: 14,
                marginRight: 'auto',
                color: theme.colors.bodyTextColor,
              }}
            >
              Search
            </span>
            <svg.FilterSvg />
          </button>
        </Link>
      </section>
    );
  };

  const renderBackground = () => {
    return <components.Background version={1} />;
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
          {carousel.map((image, index) => {
            return (
              <SwiperSlide key={index} style={{padding: '0 20px'}}>
                <Link href={Routes.CATEGORY_LIST}>
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
          {carousel.map((_, index) => {
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

  const renderCategories = () => {
    return (
      <section style={{marginBottom: 30}}>
        <div className='container'>
          <components.BlockHeading
            title='Categories'
            href={Routes.CATEGORY_GRID}
            containerStyle={{marginBottom: 7}}
          />
        </div>
        <Swiper
          spaceBetween={10}
          slidesPerView={'auto'}
          onSlideChange={() => {}}
          onSwiper={(swiper) => {}}
          style={{padding: '0 20px'}}
        >
          {categories.map((category, index) => {
            return (
              <SwiperSlide key={category.id} style={{width: 'auto'}}>
                <Link
                  href={Routes.CATEGORY_LIST}
                  style={{
                    height: 89,
                    display: 'flex',
                    padding: '8px 20px',
                    borderRadius: 10,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundImage: `url(${category.image})`,
                  }}
                  className='clickable'
                >
                  <span
                    style={{
                      fontSize: 14,
                      ...theme.fonts.Lato,
                      fontWeight: 700,
                      lineHeight: 1.5,
                      color: theme.colors.white,
                    }}
                  >
                    {category.name}
                  </span>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </section>
    );
  };

  const renderTopRated = () => {
    if (!courses.length) return null;
    return (
      <section style={{paddingBottom: 30}}>
        <div className='container'>
          <components.BlockHeading
            title='Top rated'
            href={Routes.CATEGORY_LIST}
            containerStyle={{marginBottom: 7}}
          />
        </div>

        <ul style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          {courses.map((course, index, array) => {
            const isLast = index === array.length - 1;
            return (
              <elements.CourseCard
                key={course.id}
                course={course}
                isLast={isLast}
                section='top rated'
              />
            );
          })}
        </ul>
      </section>
    );
  };

  const renderPopular = () => {
    return (
      <section style={{paddingBottom: 30}}>
        <div className='container'>
          <components.BlockHeading
            title='Popular'
            href={Routes.CATEGORY_LIST}
            containerStyle={{marginBottom: 7}}
          />
        </div>
        <Swiper
          spaceBetween={16}
          slidesPerView={'auto'}
          onSlideChange={() => {}}
          onSwiper={(swiper) => {}}
          style={{padding: '0 20px'}}
        >
          {courses.map((course, index) => {
            return (
              <SwiperSlide key={index} style={{width: 'auto'}}>
                <items.PopularItem course={course} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </section>
    );
  };

  const renderBottomTabBar = () => {
    return <components.BottomTabBar />;
  };

  const renderContent = () => {
    return (
      <main className='scrollable'>
        {renderSearchBar()}
        {renderCarousel()}
        {renderCategories()}
        {renderTopRated()}
        {renderPopular()}
      </main>
    );
  };

  return (
    <components.Screen>
      {renderBackground()}
      {renderContent()}
      {renderBottomTabBar()}
    </components.Screen>
  );
};
