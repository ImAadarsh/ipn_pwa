'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import {svg} from '../svg';
import {text} from '../text';
import {utils} from '../utils';
import {Routes} from '../routes';
import {theme} from '../constants';
import {URLS} from '../config';
import {CourseType} from '../types';
import {course as elements} from '../course';

type Props = {
  isLast?: boolean;
  course: CourseType;
  status?: 'ongoing' | 'completed';
  section: 'top rated' | 'category list' | 'my courses';
};

export const CourseCard: React.FC<Props> = ({
  course,
  section,
  isLast,
  status,
}) => {
  if (section === 'top rated') {
    return (
      <Link
        href={Routes.COURSE_DETAILS.replace(':id', String(course.id))}
        style={{
          display: 'flex',
          width: '100%',
          padding: '0 20px',
          cursor: 'pointer',
          userSelect: 'none',
          ...utils.rowCenter(),
          marginBottom: isLast ? 0 : 10,
          paddingBottom: isLast ? 0 : 10,
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomStyle: isLast ? 'none' : 'solid',
          borderBottomColor: `rgba(59, 89, 153, 0.1)`,
        }}
      >
        <div
          style={{
            width: 295,
            height: 96,
            marginRight: 12,
            position: 'relative',
          }}
        >
          <Image
            width={675}
            height={196}
            sizes='100vw'
            alt='course'
            priority={true}
            src={`${URLS.IMAGE_URL}${course.image}`}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 10,
              objectFit: 'cover',
            }}
          />
          <elements.CourseRating
            course={course}
            containerStyle={{
              margin: 2,
              position: 'absolute',
              bottom: 0,
              left: 0,
            }}
          />
        </div>
        <div style={{width: '100%', position: 'relative'}}>
          <div style={{width: 202, marginRight: 30}}>
            <text.H6 numberOfLines={2} style={{marginBottom: 10}}>
              {course.name}
            </text.H6>
          </div>
          <div style={{...utils.rowCenter()}}>
            <svg.ClockSvg color={theme.colors.secondaryTextColor} />
            <text.T14
              style={{
                marginLeft: 6,
                marginRight: 'auto',
                color: theme.colors.secondaryTextColor,
              }}
            >
              {course.trainer.name}
            </text.T14>
            {course.price >= 0 && <elements.CoursePrice course={course} />}
          </div>
          <elements.CourseInWishlist
            course={course}
            size={20}
            style={{position: 'absolute', right: 0, top: 0}}
          />
        </div>
      </Link>
    );
  }

  if (section === 'category list') {
    return (
      <Link
        href={Routes.COURSE_DETAILS.replace(':id', String(course.id))}
        style={{
          display: 'flex',
          width: '100%',
          padding: '0 20px',
          cursor: 'pointer',
          userSelect: 'none',
          ...utils.rowCenter(),
          marginBottom: isLast ? 0 : 10,
          paddingBottom: isLast ? 0 : 10,
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomStyle: isLast ? 'none' : 'solid',
          borderBottomColor: `rgba(59, 89, 153, 0.1)`,
        }}
      >
        <div
          style={{
            width: 375,
            height: 196,
            marginRight: 12,
            position: 'relative',
          }}
        >
          <Image
            width={375}
            height={196}
            sizes='100vw'
            alt='course'
            priority={true}
            src={`${URLS.IMAGE_URL}${course.image}`}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 10,
              objectFit: 'cover',
            }}
          />
          <elements.CourseRating
            course={course}
            containerStyle={{
              margin: 2,
              position: 'absolute',
              bottom: 0,
              left: 0,
            }}
          />
        </div>
        <div style={{width: '100%', position: 'relative'}}>
          <div style={{width: 202, marginRight: 30}}>
            <text.H6 numberOfLines={2} style={{marginBottom: 10}}>
              {course.name}
            </text.H6>
          </div>
          <div style={{...utils.rowCenter()}}>
            <svg.ClockSvg />
            <text.T14 style={{marginLeft: 6, marginRight: 'auto'}}>
              {course.trainer.name}
            </text.T14>
            {course.price >= 0 && <elements.CoursePrice course={course} />}
          </div>
          <elements.CourseInWishlist
            course={course}
            size={20}
            style={{position: 'absolute', right: 0, top: 0}}
          />
        </div>
      </Link>
    );
  }

  if (section === 'my courses') {
    return (
      <button
        style={{
          width: '48%',
          marginBottom: 15,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 10,
          border: '1px solid #FFFFFF',
          backgroundColor: `${'#FFFFFF'}50`,
          boxShadow: '0px 4px 10px rgba(37, 73, 150, 0.05)',
        }}
      >
        <Link
          style={{
            width: 375,
            height: 196,
            position: 'relative',
            display: 'flex'
          }}
          href={Routes.COURSE_DETAILS.replace(':id', String(course.id))}
        >
          <Image
            width={375}
            height={196}
            priority={true}
            src={`${URLS.IMAGE_URL}${course.image}`}
            alt='course'
            style={{
              width: '100%',
              height: '100%',
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              objectFit: 'cover',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
            }}
          />
          <svg.PlayBtnSvg
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </Link>
        <div style={{padding: '11px 14px 14px 14px'}}>
          <text.T14 numberOfLines={2} style={{color: theme.colors.mainColor}}>
            {course.name}
          </text.T14>
          {status === 'ongoing' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: 8,
                  justifyContent: 'space-between',
                }}
              >
                <text.T12
                  style={{
                    color: theme.colors.secondaryTextColor,
                    ...theme.fonts.Lato,
                  }}
                >
                  56%
                </text.T12>
                <div style={{...utils.rowCenter({gap: 3})}}>
                  <svg.StarSvg />
                  <text.T10
                    style={{
                      ...theme.fonts.Lato_700Bold,
                      color: theme.colors.mainColor,
                    }}
                  >
                    {course.rating}
                  </text.T10>
                </div>
              </div>
              <div
                style={{
                  width: '100%',
                  height: 3,
                  backgroundColor: '#C3D9FD',
                  borderRadius: 3,
                }}
              >
                <div
                  style={{
                    width: '56%',
                    height: 3,
                    backgroundColor: '#55ACEE',
                    borderRadius: 3,
                  }}
                />
              </div>
            </div>
          )}
          {status === 'completed' && (
            <Link
              href={Routes.COURSE_COMPLETED}
              style={{
                width: '100%',
                border: `1px solid ${theme.colors.secondaryTextColor}`,
                borderRadius: 5,
                marginTop: 6,
                padding: '4px 0px',
                ...utils.flexCenter(),
              }}
            >
              <text.T10 style={{color: theme.colors.mainColor}}>
                View certificate
              </text.T10>
            </Link>
          )}
        </div>
      </button>
    );
  }

  return null;
};
