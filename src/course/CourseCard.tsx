'use client';

import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import Script from 'next/script';

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
  orderId?: string;
  workshopId?: number;
  startDate?: string;
  meetingId?: string;
  passcode?: string;
  userId?: number;
  userName?: string;
  userEmail?: string;
};

interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  profile: string;
  token: string;
}

interface AccessDetails {
  paymentDate: string;
  workshopStartDate: string;
  accessUntil: string;
  daysRemaining: number;
}

interface RecordingResponse {
  success: boolean;
  url?: string;
  message?: string;
  accessType?: 'exception' | 'regular';
  details?: AccessDetails;
}

export const CourseCard: React.FC<Props> = ({
  course,
  section,
  isLast,
  status,
  orderId,
  workshopId,
  startDate,
  meetingId,
  passcode,
  userId: propUserId,
  userName,
  userEmail,
}) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showAccessAlert, setShowAccessAlert] = useState<string | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [accessDetails, setAccessDetails] = useState<AccessDetails | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleViewRecording = async () => {
    if (!user || !course.id) {
      setShowAccessAlert('Please sign in to view the recording.');
      return;
    }

    try {
      const response = await fetch(`/api/workshop-recording?userId=${user.id}&workshopId=${course.id}`);
      const data: RecordingResponse = await response.json();

      if (data.success && data.url) {
        setVideoUrl(data.url);
        setShowVideoModal(true);
        setAccessDetails(data.details || null);
      } else {
        let message = data.message || 'Failed to retrieve recording link.';
        if (data.details) {
          if (data.details.daysRemaining === 0) {
            message = 'Your access to this recording has expired.';
          } else {
            message = `You have ${data.details.daysRemaining} days remaining to access this recording.`;
          }
        }
        setShowAccessAlert(message);
      }
    } catch (error) {
      console.error('Error fetching recording link:', error);
      setShowAccessAlert('An unexpected error occurred while fetching the recording link.');
    }
  };

  const renderAccessAlert = () => {
    if (!showAccessAlert) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}>
        <div style={{
          backgroundColor: theme.colors.white,
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center',
          maxWidth: '400px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <text.H4 style={{marginBottom: '15px', color: theme.colors.mainColor}}>
            {accessDetails?.daysRemaining === 0 ? 'Access Expired' : 'Access Information'}
          </text.H4>
          <text.T14 style={{marginBottom: '20px', color: theme.colors.secondaryTextColor}}>
            {showAccessAlert}
          </text.T14>
          {accessDetails && (
            <div style={{
              marginBottom: '20px',
              padding: '10px',
              backgroundColor: '#f5f5f5',
              borderRadius: '5px',
              textAlign: 'left'
            }}>
              <text.T12 style={{color: theme.colors.secondaryTextColor}}>
                Workshop Start: {new Date(accessDetails.workshopStartDate).toLocaleDateString()}
              </text.T12>
              <text.T12 style={{color: theme.colors.secondaryTextColor, display: 'block', marginTop: '5px'}}>
                Payment Date: {new Date(accessDetails.paymentDate).toLocaleDateString()}
              </text.T12>
              <text.T12 style={{color: theme.colors.secondaryTextColor, display: 'block', marginTop: '5px'}}>
                Access Until: {new Date(accessDetails.accessUntil).toLocaleDateString()}
              </text.T12>
            </div>
          )}
          <button 
            onClick={() => {
              setShowAccessAlert(null);
              setAccessDetails(null);
            }}
            style={{
              backgroundColor: theme.colors.mainColor,
              color: theme.colors.white,
              padding: '10px 20px',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            OK
          </button>
        </div>
      </div>
    );
  };

  const renderVideoModal = () => {
    if (!showVideoModal || !videoUrl) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}>
        <div style={{
          position: 'relative',
          width: '90%',
          maxWidth: '1200px',
          backgroundColor: theme.colors.white,
          borderRadius: '10px',
          padding: '20px',
        }}>
          <button
            onClick={() => setShowVideoModal(false)}
            style={{
              position: 'absolute',
              top: '-40px',
              right: '0',
              backgroundColor: 'transparent',
              border: 'none',
              color: theme.colors.white,
              fontSize: '24px',
              cursor: 'pointer',
              padding: '10px',
            }}
          >
            ×
          </button>
          <div style={{
            position: 'relative',
            paddingTop: '56.25%', // 16:9 Aspect Ratio
            width: '100%',
            backgroundColor: '#000',
            borderRadius: '8px',
            overflow: 'hidden',
          }}>
            <iframe
              src={`https://player.vimeo.com/video/${videoUrl}?h=18291dcbb6&badge=0&autopause=0&player_id=0&app_id=58479`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    );
  };

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
            width: 270,
            height: 86,
            marginRight: 12,
            position: 'relative',
          }}
        >
          <Image
            width={635}
            height={176}
            sizes='100vw'
            alt={course.name}
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
          <div style={{display: 'flex', alignItems: 'center', marginTop: 8}}>
            <svg.CourseUserSvg />
            <text.T14 style={{marginLeft: 6, marginRight: 'auto'}}>
              {course.trainer?.name || 'Trainer'}
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
            width: 130,
            height: 75,
            marginRight: 12,
            position: 'relative',
          }}
        >
          <Image
            width={0}
            height={0}
            sizes='100vw'
            alt={course.name}
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
        <div style={{flex: 1, position: 'relative'}}>
          <div style={{marginRight: 30}}>
            <text.H6 numberOfLines={2} style={{marginBottom: 10}}>
              {course.name}
            </text.H6>
          </div>
          <div style={{display: 'flex', alignItems: 'center', marginTop: 8}}>
            <svg.CourseUserSvg />
            <text.T14 style={{marginLeft: 6, marginRight: 'auto'}}>
              {course.trainer?.name || 'Trainer'}
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
      <>
        <button
          style={{
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
              width: '100%',
              height: 196,
              position: 'relative',
              display: 'flex'
            }}
            href={Routes.COURSE_DETAILS.replace(':id', String(course.id))}
          >
            <Image
              width={0}
              height={0}
              sizes='100vw'
              priority={true}
              src={`${URLS.IMAGE_URL}${course.image}`}
              alt={course.name}
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
            {status === 'completed' && (
              <svg.PlayBtnSvg
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            )}
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
                    marginBottom: 10,
                    justifyContent: 'space-between',
                  }}
                >
                  {startDate && (
                    <text.T12
                      style={{
                        color: theme.colors.secondaryTextColor,
                        ...theme.fonts.Lato,
                      }}
                    >
                      Starts: {new Date(startDate).toLocaleDateString()}
                    </text.T12>
                  )}
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
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: 3,
                      backgroundColor: '#55ACEE',
                      borderRadius: 3,
                    }}
                  />
                </div>
                {user && user.id && course.id && (
                  <>
                    {meetingId && passcode ? (
                      <Link
                        href={`https://meet.ipnacademy.in/?display_name=${user.id}_${encodeURIComponent(user.name || '')}&mn=${meetingId}&pwd=${passcode}&meeting_email=${user.email || ''}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        style={{
                          width: '100%',
                          padding: '8px 16px',
                          backgroundColor: theme.colors.mainColor,
                          color: 'white',
                          border: 'none',
                          borderRadius: 4,
                          cursor: 'pointer',
                          ...theme.fonts.Lato,
                          textAlign: 'center',
                        }}
                      >
                        Joining Link
                      </Link>
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          padding: '8px 16px',
                          color: theme.colors.secondaryTextColor,
                          border: '1px solid',
                          borderRadius: 4,
                          textAlign: 'center',
                          ...theme.fonts.Lato,
                        }}
                      >
                        Joining Link Available Soon
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            {status === 'completed' && (
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px'}}>
                {orderId && workshopId && (
                  <Link
                    href={`${Routes.COURSE_COMPLETED}?orderId=${orderId}&workshopId=${workshopId}`}
                    style={{
                      width: '100%',
                      border: `1px solid ${theme.colors.secondaryTextColor}`,
                      borderRadius: 5,
                      padding: '8px 0px',
                      ...utils.flexCenter(),
                      textDecoration: 'none',
                      color: theme.colors.mainColor,
                      ...theme.fonts.Lato_700Bold,
                      fontSize: 14
                    }}
                  >
                    View Certificate
                  </Link>
                )}
                {course.rlink && (
                  <button
                    onClick={handleViewRecording}
                    style={{
                      width: '100%',
                      padding: '8px 0px',
                      backgroundColor: theme.colors.mainColor,
                      color: theme.colors.white,
                      border: 'none',
                      borderRadius: 5,
                      cursor: 'pointer',
                      ...utils.flexCenter(),
                      ...theme.fonts.Lato_700Bold,
                      fontSize: 14,
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    View Recording
                  </button>
                )}
              </div>
            )}
          </div>
        </button>
        {renderAccessAlert()}
        {renderVideoModal()}
        <Script src="https://player.vimeo.com/api/player.js" strategy="lazyOnload" />
      </>
    );
  }

  return null;
};
