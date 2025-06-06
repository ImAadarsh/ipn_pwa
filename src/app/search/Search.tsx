'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, {useEffect} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';

import {svg} from '../../svg';
import {text} from '../../text';
import {items} from '../../items';
import {Routes} from '../../routes';
import {theme} from '../../constants';
import {components} from '../../components';
import {course as elements} from '../../course';

import type {CourseType} from '../../types';

type Props = {
  courses: CourseType[];
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

const tags = [
  {
    id: 1,
    name: 'Java',
  },
  {
    id: 2,
    name: 'Python',
  },
  {
    id: 3,
    name: 'Marketing',
  },
  {
    id: 4,
    name: 'App',
  },
  {
    id: 5,
    name: 'Database',
  },
  {
    id: 6,
    name: 'Analytics',
  },
  {
    id: 7,
    name: 'UI/UX',
  },
];

export const Search: React.FC<Props> = ({courses}) => {
  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.white;
  }, []);

  const renderSearch = () => {
    return (
      <section className='container' style={{marginTop: 10, marginBottom: 30}}>
        <Link
          href={Routes.CATEGORY_LIST}
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
        </Link>
      </section>
    );
  };

  const renderBackground = () => {
    return <components.Background version={1} />;
  };

  const renderNewCourses = () => {
    return (
      <section style={{marginBottom: 30}}>
        <div className='container'>
          <components.BlockHeading
            title='New courses'
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
                <items.NewCourseItem index={index} course={course} />
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

  const renderSpecialForYou = () => {
    return (
      <div style={{marginBottom: 30}}>
        <components.BlockHeading
          title='Specially for you'
          href={Routes.CATEGORY_LIST}
          containerStyle={{marginBottom: 7, padding: '0 20px'}}
        />
        <Swiper
          spaceBetween={16}
          slidesPerView={'auto'}
          style={{padding: '0 20px'}}
          pagination={{clickable: true}}
        >
          {courses.slice(0, 3).map((course: CourseType, index) => {
            return (
              <SwiperSlide key={course.id} style={{width: 'auto'}}>
                <Link
                  href={Routes.COURSE_DETAILS.replace(':id', String(course.id))}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: 230,
                    height: 100,
                    backgroundColor: index % 2 === 0 ? '#FDF4EF' : '#EEF7FE',
                    borderRadius: 10,
                    padding: 16,
                    position: 'relative',
                    cursor: 'pointer',
                    userSelect: 'none',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: 100,
                      height: 100,
                      backgroundColor: '#FED7C7',
                      borderRadius: 50,
                      position: 'absolute',
                      right: -20,
                      bottom: -40,
                    }}
                  />
                  <Image
                    width={0}
                    height={0}
                    sizes='100vw'
                    priority={true}
                    src={course.threeDPreview}
                    alt={course.name}
                    style={{
                      width: 70,
                      height: 'auto',
                      position: 'absolute',
                      right: 0,
                      bottom: 0,
                    }}
                  />
                  <div style={{marginRight: 50, marginBottom: 'auto'}}>
                    <elements.CourseName
                      course={course}
                      numberOfLines={2}
                      style={{color: theme.colors.bodyTextColor}}
                    />
                  </div>
                  <text.T14 style={{color: theme.colors.secondaryTextColor}}>
                    {[3, 5, 7, 9, 11, 13, 15, 17][index]} Courses
                  </text.T14>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    );
  };

  const renderOftenSearched = () => {
    return (
      <section style={{paddingBottom: 30}} className='container'>
        <components.BlockHeading
          title='Often searched'
          containerStyle={{marginBottom: 7}}
        />
        <ul
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          {tags.map((tag) => {
            return (
              <Link
                href={Routes.CATEGORY_LIST}
                key={tag.id}
                style={{
                  backgroundColor: '#EBE2FE',
                  padding: '10px 16px',
                  borderRadius: 10,
                }}
                className='clickable'
              >
                <text.H6 style={{color: '#7C6F97'}}>{tag.name}</text.H6>
              </Link>
            );
          })}
        </ul>
      </section>
    );
  };

  const renderContent = () => {
    return (
      <main className='scrollable'>
        {renderSearch()}
        {renderNewCourses()}
        {renderTopRated()}
        {renderSpecialForYou()}
        {renderOftenSearched()}
      </main>
    );
  };

  const renderBottomTabBar = () => {
    return <components.BottomTabBar />;
  };

  return (
    <components.Screen>
      {renderBackground()}
      {renderContent()}
      {renderBottomTabBar()}
    </components.Screen>
  );
};
