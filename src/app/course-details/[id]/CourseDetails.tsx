'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, {useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import * as Accordion from '@radix-ui/react-accordion';

import {svg} from '../../../svg';
import {text} from '../../../text';
import {utils} from '../../../utils';
import {items} from '../../../items';
import {theme} from '../../../constants';
import {components} from '../../../components';
import {course as elements} from '../../../course';

import {Routes} from '../../../routes';
import type {CourseType} from '../../../types';

const tabs = [
  {
    id: 1,
    name: 'Description',
  },
  {
    id: 2,
    name: 'Lessons',
  },
  {
    id: 3,
    name: 'Instructor',
  },
  {
    id: 4,
    name: 'Reviews',
  },
];

const reviews = [
  {
    id: 1,
    name: 'Lillian Davis',
    rating: 5,
    date: 'March 3, 2022',
    comment: 'Lots of good info.',
    avatar: 'https://george-fx.github.io/nuton_api/assets/users/02.jpg',
  },
  {
    id: 2,
    name: 'Adam Thompson',
    rating: 5,
    date: 'March 28, 2022',
    comment: 'Great course!',
    avatar: 'https://george-fx.github.io/nuton_api/assets/users/03.jpg',
  },
  {
    id: 3,
    name: 'Ryan Howard',
    rating: 5,
    date: 'February 12, 2022',
    comment: 'It was a great course.',
    avatar: 'https://george-fx.github.io/nuton_api/assets/users/04.jpg',
  },
];

const lessons = [
  {
    id: 1,
    title: '01. Introduction',
    lecture: '3 lectures',
    duration: '7 min',
    content: [
      {
        id: 1,
        title: 'Setting up individual Camera Rigs',
        duration: '00:44',
      },
      {
        id: 2,
        title: 'Setting Up VRTKs Tracked Alias',
        duration: '03:49',
      },
      {
        id: 3,
        title: 'Setting Up VRTKs Tracked Alias',
        duration: '02:22',
        locked: true,
      },
    ],
  },
  {
    id: 2,
    title: '02. Movement in VR',
    lecture: '8 lectures',
    duration: '1h 33 min',
    content: [
      {
        id: 1,
        title: 'Setting up individual Camera Rigs',
        duration: '00:44',
      },
      {
        id: 2,
        title: 'Setting Up VRTKs Tracked Alias',
        duration: '03:49',
      },
      {
        id: 3,
        title: 'Setting Up VRTKs Tracked Alias',
        duration: '02:22',
        locked: true,
      },
    ],
  },
  {
    id: 3,
    title: '03. Distance Grabber',
    lecture: '8 lectures',
    duration: '1h 33 min',
    content: [
      {
        id: 1,
        title: 'Setting up individual Camera Rigs',
        duration: '00:44',
      },
      {
        id: 2,
        title: 'Setting Up VRTKs Tracked Alias',
        duration: '03:49',
      },
      {
        id: 3,
        title: 'Setting Up VRTKs Tracked Alias',
        duration: '02:22',
        locked: true,
      },
    ],
  },
  {
    id: 4,
    title: '04. Snap Zones',
    lecture: '8 lectures',
    duration: '1h 33 min',
    content: [
      {
        id: 1,
        title: 'Setting up individual Camera Rigs',
        duration: '00:44',
      },
      {
        id: 2,
        title: 'Setting Up VRTKs Tracked Alias',
        duration: '03:49',
      },
      {
        id: 3,
        title: 'Setting Up VRTKs Tracked Alias',
        duration: '02:22',
        locked: true,
      },
    ],
  },
];

type Props = {
  id: string;
  courses: CourseType[];
};

export const CourseDetails: React.FC<Props> = ({courses, id}) => {
  if (!id || !courses) return null;

  const course = courses.find((item) => String(item.id) === String(id));

  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [openItem, setOpenItem] = useState<string | null>(null);

  const formatWithBreaks = (text: string, wordsPerLine = 4) => {
    return text
      .split(' ')
      .map((word, index) =>
        (index + 1) % wordsPerLine === 0 ? word + ' <br />' : word
      )
      .join(' ')
      .split('<br />')
      .map((item, idx) => (
        <React.Fragment key={idx}>
          {item}
          <br />
        </React.Fragment>
      ));
  };

  const renderImageBackground = () => {
    return <components.Background version={1} />;
  };

  const renderPreviewImage = () => {
    return (
      <div style={{marginTop: 10, marginBottom: 20}} className='container'>
        <Image
          width={0}
          height={0}
          sizes='100vw'
          src={course?.innerPreview || ''}
          alt='preview'
          style={{
            height: 'auto',
            width: '100%',
            objectFit: 'cover',
            borderRadius: 10,
          }}
        />
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <components.Header
        course={course}
        showGoBack={true}
        showAddToWishlist={true}
      />
    );
  };

  const renderTitle = () => {
    return (
      <div className='container'>
        <text.H4 style={{marginBottom: 6}} numberOfLines={2}>
          {formatWithBreaks(course?.name || '')}
        </text.H4>
      </div>
    );
  };

  const renderRating = () => {
    return (
      <div
        style={{...utils.rowCenter({gap: 6}), marginBottom: 20}}
        className='container'
      >
        <div
          style={{
            ...utils.rowCenter({gap: 3}),
          }}
        >
          <text.T10
            style={{
              ...theme.fonts.Lato_700Bold,
              color: '#FFC700',
              marginTop: 3,
            }}
          >
            5.0
          </text.T10>
          <components.Rating />
        </div>
        <text.T10>(149 ratings) 2,719 students</text.T10>
      </div>
    );
  };

  const renderTabs = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 20,
        }}
        className='container'
      >
        {tabs.map((item) => {
          const activeTabStyle = {
            borderRadius: 10,
            border: '1px solid #FFFFFF',
            backgroundColor: `${'#FFFFFF'}50`,
            boxShadow: '0px 4px 10px rgba(37, 73, 150, 0.05)',
          };

          return (
            <div
              className={selectedTab.id === item.id ? 'custom-block' : ''}
              key={item.id}
              style={{
                cursor: 'pointer',
                userSelect: 'none',
                ...utils.rowCenter(),
                padding: '14px 10px',
                ...(selectedTab.id === item.id ? activeTabStyle : {}),
              }}
              onClick={() => setSelectedTab(item)}
            >
              <span
                style={{
                  color:
                    selectedTab.id === item.id
                      ? theme.colors.mainColor
                      : theme.colors.secondaryTextColor,
                  ...theme.fonts.League_Spartan,
                  fontWeight: 500,
                  fontSize: 8,
                  textTransform: 'uppercase',
                }}
              >
                {item.name}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderAboutCourse = () => {
    if (selectedTab.id === 1) {
      return (
        <div className='container' style={{marginBottom: 20}}>
          <text.H5 style={{marginBottom: 10}}>About Course</text.H5>
          <span style={{...utils.rowCenter({gap: 10}), marginBottom: 6}}>
            <svg.CourseUserSvg />
            <text.T16>{course?.author}</text.T16>
          </span>
          <span style={{...utils.rowCenter({gap: 10}), marginBottom: 6}}>
            <svg.VideoSvg />
            <text.T16>14 hours on-demand video</text.T16>
          </span>
          <span style={{...utils.rowCenter({gap: 10}), marginBottom: 6}}>
            <svg.DownloadSvg />
            <text.T16>16 downloadable resources</text.T16>
          </span>
          <span style={{...utils.rowCenter({gap: 10}), marginBottom: 10}}>
            <svg.CertificateSvg />
            <text.T16>Certificate of completion</text.T16>
          </span>
          <text.T16 style={{marginBottom: 24}}>
            Welcome to Udemy's first, No Coding Required, VR development course,
            using VRTK 4. Build once and deploy to both Oculus.
          </text.T16>
          <components.Button
            label='Buy course'
            href={Routes.CHECKOUT.replace(':id', String(course?.id))}
          />
        </div>
      );
    }

    return null;
  };

  const renderLessons = () => {
    if (selectedTab.id === 2) {
      return (
        <div className='container'>
          <Accordion.Root type='single' collapsible={true}>
            {lessons?.map((item: any) => {
              const isOpen = openItem === item.id;
              return (
                <Accordion.Item
                  key={item.id}
                  value={item.id}
                  onClick={() => setOpenItem(isOpen ? null : item.id)}
                >
                  <Accordion.Trigger
                    className='custom-block'
                    style={{
                      width: '100%',
                      padding: '13px 20px',
                      cursor: 'pointer',
                      userSelect: 'none',
                      borderRadius: 10,
                      marginBottom: 10,
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1px solid #FFFFFF',
                      backgroundColor: `${'#FFFFFF'}50`,
                      boxShadow: '0px 4px 10px rgba(37, 73, 150, 0.05)',
                    }}
                  >
                    <text.H5 numberOfLines={1}>{item.title}</text.H5>
                    <text.T10>
                      {item.lecture} • {item.duration}
                    </text.T10>
                  </Accordion.Trigger>
                  <Accordion.Content style={{marginBottom: 20, marginTop: 20}}>
                    {item.content.map((content: any) => {
                      return (
                        <div
                          key={content.id}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginBottom: 6,
                            paddingLeft: 10,
                            paddingRight: 10,
                          }}
                        >
                          <div style={{...utils.rowCenter()}}>
                            <svg.LessonPlaySvg />
                            <text.T14
                              numberOfLines={1}
                              style={{marginRight: 'auto', marginLeft: 10}}
                            >
                              {content.title}
                            </text.T14>
                            <text.T14 numberOfLines={1}>
                              {content.duration}
                            </text.T14>
                          </div>
                        </div>
                      );
                    })}
                  </Accordion.Content>
                </Accordion.Item>
              );
            })}
          </Accordion.Root>
          <components.Button
            label='Buy course'
            href={Routes.CHECKOUT}
            style={{marginBottom: 20, marginTop: 20}}
          />
        </div>
      );
    }

    return null;
  };

  const renderReviews = () => {
    if (selectedTab.id === 4) {
      return (
        <div style={{marginBottom: 20}} className='container'>
          {reviews.map((item, index, array) => {
            const isLast = index === array.length - 1;
            return (
              <items.ReviewItem key={item.id} review={item} isLast={isLast} />
            );
          })}
        </div>
      );
    }
  };

  const renderInstructor = () => {
    const filteredCourses = courses.filter(
      (course: CourseType) => String(course.id) !== String(id)
    );
    if (selectedTab.id === 3) {
      return (
        <div>
          <div className='container' style={{marginBottom: 30}}>
            <text.H5 style={{marginBottom: 2}}>{course?.author}</text.H5>
            <text.T10 style={{marginBottom: 10}}>{course?.position}</text.T10>
            <div style={{...utils.rowCenter(), marginBottom: 30}}>
              <Image
                width={0}
                height={0}
                sizes='100vw'
                priority={true}
                src={course?.authorImage || ''}
                alt='author'
                style={{
                  borderRadius: 5,
                  width: 91,
                  marginRight: 10,
                  height: 'auto',
                }}
              />
              <div>
                <div style={{...utils.rowCenter({gap: 7}), marginBottom: 6}}>
                  <svg.StarSvg color={theme.colors.mainColor} />
                  <text.T10 style={{color: theme.colors.bodyTextColor}}>
                    4.5 Instructor Rating
                  </text.T10>
                </div>
                <div style={{...utils.rowCenter({gap: 7}), marginBottom: 6}}>
                  <svg.ChatSvg />
                  <text.T10 style={{color: theme.colors.bodyTextColor}}>
                    116 Reviews
                  </text.T10>
                </div>
                <div style={{...utils.rowCenter({gap: 7}), marginBottom: 6}}>
                  <svg.GraduateSvg />
                  <text.T10 style={{color: theme.colors.bodyTextColor}}>
                    936 Students
                  </text.T10>
                </div>
                <div style={{...utils.rowCenter({gap: 7}), marginBottom: 6}}>
                  <svg.BtnPlaySvg />
                  <text.T10 style={{color: theme.colors.bodyTextColor}}>
                    12 Courses
                  </text.T10>
                </div>
              </div>
            </div>
            <text.H5 style={{marginBottom: 10}}>About teacher</text.H5>
            <text.T16
              style={{color: theme.colors.bodyTextColor, marginBottom: 10}}
            >
              I started working as a software developer at the age of 23, and
              never looked back. I explored careers as varied as being a Game
              Developer, Educator and Drone Pilot, over the last 25 years. None
              of these provided a continual challenge in the same way the
              combination of...
            </text.T16>
            <button>
              <svg.ShowMoreSvg />
            </button>
          </div>
          <div style={{marginBottom: 30, width: '100%'}}>
            <components.BlockHeading
              title='Courses'
              href={Routes.CATEGORY_LIST}
              containerStyle={{padding: '0 20px', marginBottom: 7}}
            />
            <Swiper
              spaceBetween={16}
              style={{padding: '0 20px'}}
              slidesPerView={'auto'}
              pagination={{clickable: true}}
            >
              {filteredCourses.map((course: CourseType, index: number) => {
                return (
                  <SwiperSlide
                    key={course.id}
                    style={{width: 230, height: 300}}
                  >
                    <Link
                      href={Routes.COURSE_DETAILS.replace(
                        ':id',
                        String(course.id)
                      )}
                      style={{
                        width: 230,
                        height: 300,
                        padding: 10,
                        cursor: 'pointer',
                        userSelect: 'none',
                        backgroundColor:
                          index % 2 === 0 ? '#AEB7F8' : '#FE9BB3',
                        borderRadius: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                      }}
                    >
                      <Image
                        width={0}
                        height={0}
                        sizes='100vw'
                        priority={true}
                        src={course.threeDPreview}
                        alt={course.name}
                        style={{
                          width: '88%',
                          height: 'auto',
                          margin: '0 auto',
                          marginTop: 10,
                          marginBottom: 'auto',
                        }}
                      />
                      <elements.CourseName
                        course={course}
                        numberOfLines={2}
                        style={{color: theme.colors.white, marginBottom: 16}}
                      />
                      <div style={{...utils.rowCenterSpcBtw()}}>
                        <div style={{...utils.rowCenter()}}>
                          <svg.ClockSvg color='#D7D9FE' />
                          <text.T14
                            style={{
                              marginLeft: 6,
                              marginRight: 'auto',
                              color: '#D7D9FE',
                            }}
                          >
                            {course.duration}
                          </text.T14>
                        </div>
                        <text.T16
                          style={{
                            color: theme.colors.white,
                            ...theme.fonts.Lato_700Bold,
                          }}
                        >
                          ${course.price.toFixed(2)}
                        </text.T16>
                      </div>
                      <elements.CourseRating
                        course={course}
                        containerStyle={{
                          position: 'absolute',
                          top: 2,
                          left: 2,
                          borderBottomRightRadius: 10,
                          borderTopLeftRadius: 10,
                          borderTopRightRadius: 0,
                          borderBottomLeftRadius: 0,
                        }}
                      />
                      <elements.CourseInWishlist
                        course={course}
                        size={20}
                        customFillColor={theme.colors.white}
                        customStrokeColor={theme.colors.white}
                        style={{position: 'absolute', right: 10, top: 10}}
                      />
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderContent = () => {
    return (
      <main style={{paddingBottom: 0}} className='scrollable'>
        {renderPreviewImage()}
        {renderTitle()}
        {renderRating()}
        {renderTabs()}
        {renderAboutCourse()}
        {renderLessons()}
        {renderReviews()}
        {renderInstructor()}
      </main>
    );
  };

  return (
    <>
      {renderImageBackground()}
      {renderHeader()}
      {renderContent()}
    </>
  );
};
