'use client';

import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import {useRouter} from 'next/navigation';

import {text} from '../../../text';
import {Routes} from '../../../routes';
import {theme} from '../../../constants';
import {URLS} from '../../../config';
import {components} from '../../../components';
import {utils} from '../../../utils';
import {svg} from '../../../svg';

interface Feedback {
  id: number;
  rating: number;
  comment: string;
  user_name: string;
  user_image: string;
  created_at: string;
}

interface Workshop {
  id: number;
  name: string;
  image: string;
  start_date: string;
  duration: string;
  price: number;
  price_2: number;
  cut_price: number | null;
  description: string;
  trainer_name: string;
  trainer_designation: string;
  trainer_image: string;
  trainer_description: string;
  total_subscribers: number;
  average_rating: number;
  total_reviews: number;
  skills: string | null;
  requirements?: string[];
  what_you_will_learn?: string[];
  info?: string;
  is_premium: number;
  category_id: number;
  category_name?: string;
  type: number;
  cpd: number;
}

interface User {
  id: number;
  name: string | null;
  email: string | null;
  mobile: string;
  profile: string;
  designation: string | null;
  institute_name: string | null;
  city: string | null;
  user_type: string;
  membership: number;
  school_id: number | null;
  sessionToken: string;
}

interface Props {
  id: string;
}

export const CourseDetails: React.FC<Props> = ({id}) => {
  const router = useRouter();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'trainer' | 'reviews'>('description');
  const [showRegistration, setShowRegistration] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [multipleAccounts, setMultipleAccounts] = useState<User[]>([]);
  const [showMultipleAccounts, setShowMultipleAccounts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchWorkshopDetails();
  }, [id]);

  const fetchWorkshopDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/workshops/${id}`);
      const data = await response.json();
      
      if (response.ok) {
        setWorkshop(data.workshop);
        setFeedback(data.feedback);
      } else {
        setError(data.error || 'Failed to fetch workshop details');
        setWorkshop(null);
        setFeedback([]);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again later.');
      setWorkshop(null);
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/verify-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationForm),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      if (data.status === 'multiple_accounts') {
        setMultipleAccounts(data.users);
        setShowMultipleAccounts(true);
        setShowRegistration(false);
        return;
      }

      // Store user data and session token
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('sessionToken', data.user.sessionToken);
      setUser(data.user);
      setShowRegistration(false);

      // Proceed to checkout
      router.push(Routes.CHECKOUT.replace(':id', String(workshop?.id)));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccountSelect = async (selectedUser: User) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Generate a new session token for the selected account
      const response = await fetch('/api/auth/verify-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: selectedUser.name || registrationForm.name,
          email: selectedUser.email || registrationForm.email,
          phone: selectedUser.mobile,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to select account');
      }

      // Store user data and session token
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('sessionToken', data.user.sessionToken);
      setUser(data.user);
      setShowMultipleAccounts(false);
      setMultipleAccounts([]);

      // Proceed to checkout
      router.push(Routes.CHECKOUT.replace(':id', String(workshop?.id)));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to select account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEnrollClick = () => {
    if (user) {
      router.push(Routes.CHECKOUT.replace(':id', String(workshop?.id)));
    } else {
      setShowRegistration(true);
    }
  };

  const renderMultipleAccountsModal = () => {
    if (!showMultipleAccounts || !multipleAccounts.length) return null;

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 20,
        }}
      >
        <div
          style={{
            backgroundColor: theme.colors.white,
            borderRadius: 15,
            padding: 20,
            width: '100%',
            maxWidth: 400,
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          <div style={{marginBottom: 20}}>
            <text.H2 style={{marginBottom: 8}}>Select Account</text.H2>
            <text.T14 style={{color: theme.colors.secondaryTextColor}}>
              We found multiple accounts associated with your email or phone number. Please select the account you want to use:
            </text.T14>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
            {multipleAccounts.map((account) => (
              <div
                key={account.id}
                onClick={() => handleAccountSelect(account)}
                style={{
                  padding: 16,
                  borderRadius: 10,
                  border: `1px solid ${theme.colors.white}50`,
                  backgroundColor: `${theme.colors.white}50`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(37, 73, 150, 0.05)',
                }}
                className="clickable"
              >
                <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12}}>
                  <div style={{
                    position: 'relative',
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(37, 73, 150, 0.1)',
                  }}>
                    <Image
                      src={account.profile ? `${URLS.IMAGE_URL}${account.profile}` : `${URLS.IMAGE_URL}/public/img/workshop/oqDdQPGw3UZnIlmNZojNfTvHHVA9KHjO1OqDHJE6.png`}
                      alt={account.name || 'User'}
                      width={48}
                      height={48}
                      style={{objectFit: 'cover'}}
                    />
                  </div>
                  <div>
                    <text.H3 style={{
                      marginBottom: 4,
                      color: theme.colors.mainColor,
                      ...theme.fonts.Lato_700Bold,
                    }}>
                      {account.name || 'User'}
                    </text.H3>
                    <text.T14 style={{color: theme.colors.secondaryTextColor}}>
                      {account.email || 'No email'}
                    </text.T14>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  paddingLeft: 60,
                  paddingTop: 8,
                  borderTop: `1px solid ${theme.colors.white}50`,
                }}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                    <div style={{
                      padding: 6,
                      borderRadius: 8,
                      backgroundColor: theme.colors.white,
                      boxShadow: '0 2px 8px rgba(37, 73, 150, 0.1)',
                    }}>
                      <svg.PhoneSvg />
                    </div>
                    <text.T14 style={{color: theme.colors.bodyTextColor}}>
                      {account.mobile}
                    </text.T14>
                  </div>
                  {account.institute_name && (
                    <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                      <div style={{
                        padding: 6,
                        borderRadius: 8,
                        backgroundColor: theme.colors.white,
                        boxShadow: '0 2px 8px rgba(37, 73, 150, 0.1)',
                      }}>
                        <svg.MapPinSvg />
                      </div>
                      <text.T14 style={{color: theme.colors.bodyTextColor}}>
                        {account.institute_name}
                      </text.T14>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{marginTop: 20, display: 'flex', justifyContent: 'flex-end'}}>
            <button
              onClick={() => {
                setShowMultipleAccounts(false);
                setMultipleAccounts([]);
              }}
              style={{
                padding: '12px 24px',
                borderRadius: 8,
                backgroundColor: theme.colors.white,
                border: `1px solid ${theme.colors.mainColor}`,
                color: theme.colors.mainColor,
                ...theme.fonts.Lato_700Bold,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              className="clickable"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderRegistrationForm = () => {
    if (!showRegistration) return null;

    return (
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.colors.white,
        boxShadow: '0 -4px 20px rgba(37, 73, 150, 0.1)',
        zIndex: 1000,
        padding: '24px 20px',
        transform: 'translateY(0)',
        transition: 'transform 0.3s ease-in-out',
      }}>
        <div style={{maxWidth: 1200, margin: '0 auto'}}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}>
            <text.H3 style={{
              ...theme.fonts.Lato_700Bold,
              fontSize: 20,
              color: theme.colors.mainColor,
            }}>
              Quick Registration
            </text.H3>
            <button
              onClick={() => setShowRegistration(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 8,
              }}
            >
              <svg.CloseSvg />
            </button>
          </div>
          <form onSubmit={handleRegistrationSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16,
              marginBottom: 20,
            }}>
              <div>
                <text.T12 style={{
                  color: theme.colors.secondaryTextColor,
                  marginBottom: 8,
                  display: 'block',
                }}>
                  Full Name
                </text.T12>
                <input
                  type="text"
                  required
                  value={registrationForm.name}
                  onChange={(e) => setRegistrationForm(prev => ({ ...prev, name: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: `1px solid ${theme.colors.secondaryTextColor}20`,
                    fontSize: 14,
                    color: theme.colors.mainColor,
                  }}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <text.T12 style={{
                  color: theme.colors.secondaryTextColor,
                  marginBottom: 8,
                  display: 'block',
                }}>
                  Email Address
                </text.T12>
                <input
                  type="email"
                  required
                  value={registrationForm.email}
                  onChange={(e) => setRegistrationForm(prev => ({ ...prev, email: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: `1px solid ${theme.colors.secondaryTextColor}20`,
                    fontSize: 14,
                    color: theme.colors.mainColor,
                  }}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <text.T12 style={{
                  color: theme.colors.secondaryTextColor,
                  marginBottom: 8,
                  display: 'block',
                }}>
                  Phone Number
                </text.T12>
                <input
                  type="tel"
                  required
                  value={registrationForm.phone}
                  onChange={(e) => setRegistrationForm(prev => ({ ...prev, phone: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: `1px solid ${theme.colors.secondaryTextColor}20`,
                    fontSize: 14,
                    color: theme.colors.mainColor,
                  }}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
            {error && (
              <text.T14 style={{
                color: 'red',
                marginBottom: 16,
                textAlign: 'center',
              }}>
                {error}
              </text.T14>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: 12,
                backgroundColor: theme.colors.mainColor,
                color: theme.colors.white,
                ...theme.fonts.Lato_700Bold,
                fontSize: 16,
                boxShadow: '0 4px 15px rgba(37, 73, 150, 0.2)',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                border: 'none',
              }}
            >
              {isSubmitting ? 'Processing...' : 'Continue to Checkout'} - ₹{workshop?.type === 0 ? workshop?.price : workshop?.price_2}
            </button>
          </form>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    if (!workshop) return null;

    switch (activeTab) {
      case 'description':
        return (
          <div>
            <text.T16 style={{
              color: theme.colors.secondaryTextColor,
              lineHeight: 1.8,
              marginBottom: 30,
            }}>
              {workshop.description}
            </text.T16>
            {workshop.info && (
              <div>
                <text.H3 style={{
                  ...theme.fonts.Lato_700Bold,
                  marginBottom: 20,
                  fontSize: 20,
                }}>
                  What You'll Learn
                </text.H3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: 20,
                }}>
                  {workshop.info.split('<br>').map((item: string, index: number) => (
                    item.trim() && (
                      <div key={index} style={{
                        padding: 20,
                        borderRadius: 12,
                        backgroundColor: `${theme.colors.mainColor}10`,
                        ...utils.rowCenter(),
                      }}>
                        <svg.CheckSvg />
                        <text.T14 style={{
                          marginLeft: 12,
                          color: theme.colors.secondaryTextColor,
                        }}>
                          {item.trim()}
                        </text.T14>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
            {workshop.skills && (
              <div style={{marginTop: 30}}>
                <text.H3 style={{
                  ...theme.fonts.Lato_700Bold,
                  marginBottom: 20,
                  fontSize: 20,
                }}>
                  Skills You'll Gain
                </text.H3>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 12,
                }}>
                  {(typeof workshop.skills === 'string' 
                    ? workshop.skills.split('<br>').map((s: string) => s.trim()).filter(Boolean)
                    : []).map((skill: string, index: number) => (
                    <div key={index} style={{
                      padding: '12px 24px',
                      borderRadius: 30,
                      backgroundColor: `${theme.colors.mainColor}15`,
                      color: theme.colors.mainColor,
                      ...theme.fonts.Lato_700Bold,
                      fontSize: 14,
                      transition: 'transform 0.2s',
                      cursor: 'pointer',
                    }}>
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'trainer':
        return (
          <div style={{
            display: 'flex',
            gap: 20,
            alignItems: 'flex-start',
          }}>
            <div style={{
              position: 'relative',
              width: 80,
              height: 80,
              borderRadius: 40,
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(37, 73, 150, 0.2)',
              flexShrink: 0,
            }}>
              <Image
                width={80}
                height={80}
                src={`${URLS.IMAGE_URL}${workshop.trainer_image}`}
                alt={workshop.trainer_name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
            <div style={{flex: 1}}>
              <text.H3 style={{
                ...theme.fonts.Lato_700Bold,
                fontSize: 20,
                marginBottom: 8,
              }}>
                {workshop.trainer_name}
              </text.H3>
              <text.T14 style={{
                color: theme.colors.mainColor,
                marginBottom: 12,
              }}>
                {workshop.trainer_designation}
              </text.T14>
              <text.T14 style={{
                color: theme.colors.secondaryTextColor,
                lineHeight: 1.6,
              }}>
                {workshop.trainer_description}
              </text.T14>
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div>
            <div style={{
              ...utils.rowCenterSpcBtw(),
              marginBottom: 20,
              padding: '16px 24px',
              borderRadius: 12,
              backgroundColor: `${theme.colors.mainColor}10`,
            }}>
              <text.T16 style={{...theme.fonts.Lato_700Bold}}>
                Overall Rating
              </text.T16>
              <div style={{...utils.rowCenter()}}>
                <svg.StarSvg color={theme.colors.mainColor} />
                <text.T16 style={{
                  marginLeft: 8,
                  color: theme.colors.mainColor,
                  ...theme.fonts.Lato_700Bold,
                }}>
                  {Number(workshop.average_rating || 0).toFixed(1)} ({workshop.total_reviews} reviews)
                </text.T16>
              </div>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
              {feedback.map((review) => (
                <div key={review.id} style={{
                  padding: 20,
                  borderRadius: 12,
                  backgroundColor: theme.colors.white,
                  boxShadow: '0 4px 15px rgba(37, 73, 150, 0.05)',
                }}>
                  <div style={{
                    display: 'flex',
                    gap: 16,
                    marginBottom: 16,
                  }}>
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      overflow: 'hidden',
                    }}>
                      <Image
                        width={48}
                        height={48}
                        src={`${URLS.IMAGE_URL}${review.user_image}`}
                        alt={review.user_name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                    <div>
                      <text.T16 style={{
                        ...theme.fonts.Lato_700Bold,
                        marginBottom: 4,
                      }}>
                        {review.user_name}
                      </text.T16>
                      <div style={{...utils.rowCenter()}}>
                        {[...Array(5)].map((_, index) => (
                          <svg.StarSvg
                            key={index}
                            color={index < review.rating ? theme.colors.mainColor : theme.colors.secondaryTextColor}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <text.T16 style={{
                    color: theme.colors.secondaryTextColor,
                    lineHeight: 1.6,
                  }}>
                    {review.comment}
                  </text.T16>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <main className='scrollable container' style={{paddingTop: 20, paddingBottom: 20}}>
          <div className="flex justify-center items-center min-h-[200px]">
            Loading...
          </div>
        </main>
      );
    }

    if (!workshop) {
      return (
        <main className='scrollable container' style={{paddingTop: 20, paddingBottom: 20}}>
          <div className="text-center p-4 text-gray-500">
            Workshop not found
          </div>
        </main>
      );
    }

    return (
      <main className='scrollable'>
        {/* Hero Image Section */}
        <section style={{position: 'relative'}}>
          <div style={{
            width: '100%',
            height: 'auto',
            position: 'relative',
          }}>
            <Image
              src={`${URLS.IMAGE_URL}${workshop.image}`}
              alt={workshop.name}
              width={1920}
              height={1080}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </div>
        </section>

        {/* Main Content */}
        <div style={{maxWidth: 1200, margin: '0 auto', padding: '32px 20px', paddingBottom: '100px'}}>
          {/* Workshop Info Card */}
          <section style={{
            marginBottom: 32,
            padding: 24,
            borderRadius: 16,
            backgroundColor: theme.colors.white,
            boxShadow: '0 10px 30px rgba(37, 73, 150, 0.1)',
          }}>
            <div style={{...utils.rowCenter(), marginBottom: 16}}>
              {workshop.is_premium === 1 && (
                <div style={{
                  padding: '4px 12px',
                  borderRadius: 30,
                  backgroundColor: theme.colors.mainOrange,
                  marginRight: 12,
                  ...theme.fonts.Lato_700Bold,
                  fontSize: 12
                }}>
                  Premium Workshop
                </div>
              )}
              {workshop.category_name && (
                <div style={{
                  padding: '4px 12px',
                  borderRadius: 30,
                  backgroundColor: `${theme.colors.mainColor}15`,
                  ...theme.fonts.Lato_700Bold,
                  fontSize: 12,
                }}>
                  {workshop.category_name}
                </div>
              )}
            </div>

            <text.H4 style={{
              color: theme.colors.mainColor,
              fontSize: 22,
              lineHeight: 1.4,
              marginBottom: 40,
              fontWeight: 600,
              wordBreak: 'break-word',
              whiteSpace: 'normal',
              overflow: 'visible',
              height: 'auto',
              minHeight: 'auto',
            }}>
              {workshop.name}
            </text.H4>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 20,
              marginBottom: 24,
              padding: '16px',
              backgroundColor: `${theme.colors.mainColor}05`,
              borderRadius: 12,
            }}>
              <div style={{...utils.rowCenter()}}>
                <div style={{
                  padding: 6,
                  borderRadius: 12,
                  backgroundColor: theme.colors.white,
                  marginRight: 12,
                  boxShadow: '0 2px 8px rgba(37, 73, 150, 0.1)',
                }}>
                  <svg.ClockSvg color={theme.colors.mainColor} />
                </div>
                <div>
                  <text.T12 style={{color: theme.colors.secondaryTextColor}}>Duration</text.T12>
                  <text.T14 style={{color: theme.colors.mainColor, ...theme.fonts.Lato_700Bold}}>
                    {workshop.duration}
                  </text.T14>
                </div>
              </div>
              <div style={{...utils.rowCenter()}}>
                <div style={{
                  padding: 6,
                  borderRadius: 12,
                  backgroundColor: theme.colors.white,
                  marginRight: 12,
                  boxShadow: '0 2px 8px rgba(37, 73, 150, 0.1)',
                }}>
                  <svg.CourseUserSvg />
                </div>
                <div>
                  <text.T12 style={{color: theme.colors.secondaryTextColor}}>Enrolled</text.T12>
                  <text.T14 style={{color: theme.colors.mainColor, ...theme.fonts.Lato_700Bold}}>
                    {workshop.total_subscribers} Educators
                  </text.T14>
                </div>
              </div>
              <div style={{...utils.rowCenter()}}>
                <div style={{
                  padding: 6,
                  borderRadius: 12,
                  backgroundColor: theme.colors.white,
                  marginRight: 12,
                  boxShadow: '0 2px 8px rgba(37, 73, 150, 0.1)',
                }}>
                  <svg.StarSvg color={theme.colors.mainColor} />
                </div>
                <div>
                  <text.T12 style={{color: theme.colors.secondaryTextColor}}>Rating</text.T12>
                  <text.T14 style={{color: theme.colors.mainColor, ...theme.fonts.Lato_700Bold}}>
                    {Number(workshop.average_rating || 0).toFixed(1)} ({workshop.total_reviews} reviews)
                  </text.T14>
                </div>
              </div>
              {workshop.cpd > 0 && (
                <div style={{...utils.rowCenter()}}>
                  <div style={{
                    padding: 6,
                    borderRadius: 12,
                    backgroundColor: theme.colors.white,
                    marginRight: 12,
                    boxShadow: '0 2px 8px rgba(37, 73, 150, 0.1)',
                  }}>
                    <svg.ClockSvg color={theme.colors.mainColor} />
                  </div>
                  <div>
                    <text.T12 style={{color: theme.colors.secondaryTextColor}}>CPD Hours</text.T12>
                    <text.T14 style={{color: theme.colors.mainColor, ...theme.fonts.Lato_700Bold}}>
                      {workshop.cpd} Hours
                    </text.T14>
                  </div>
                </div>
              )}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              backgroundColor: `${theme.colors.mainColor}05`,
              borderRadius: 12,
            }}>
              <div>
                <text.T12 style={{color: theme.colors.secondaryTextColor, marginBottom: 6}}>
                  Workshop Price
                </text.T12>
                <div style={{...utils.rowCenter()}}>
                  <text.H2 style={{...theme.fonts.Lato_700Bold, color: theme.colors.mainColor, fontSize: 24}}>
                    ₹{workshop.type === 0 ? workshop.price : workshop.price_2}
                  </text.H2>
                  {workshop.cut_price && (
                    <text.T14 style={{
                      color: theme.colors.secondaryTextColor,
                      textDecoration: 'line-through',
                      marginLeft: 12,
                    }}>
                      ₹{workshop.cut_price}
                    </text.T14>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Tabbed Content Section */}
          <section style={{
            marginBottom: 32,
            borderRadius: 16,
            backgroundColor: theme.colors.white,
            boxShadow: '0 10px 30px rgba(37, 73, 150, 0.1)',
            overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex',
              borderBottom: '1px solid rgba(37, 73, 150, 0.1)',
            }}>
              {[
                { id: 'description', label: 'Description' },
                { id: 'trainer', label: 'Trainer' },
                { id: 'reviews', label: 'Reviews' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'description' | 'trainer' | 'reviews')}
                  style={{
                    padding: '16px 24px',
                    backgroundColor: activeTab === tab.id ? theme.colors.white : 'transparent',
                    color: activeTab === tab.id ? theme.colors.mainColor : theme.colors.secondaryTextColor,
                    ...theme.fonts.Lato_700Bold,
                    fontSize: 14,
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    borderBottom: activeTab === tab.id ? `2px solid ${theme.colors.mainColor}` : 'none',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div style={{padding: 24}}>
              {renderTabContent()}
            </div>
          </section>
        </div>

        {/* Sticky CTA Button */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 20px',
          backgroundColor: theme.colors.white,
          boxShadow: '0 -4px 20px rgba(37, 73, 150, 0.1)',
          zIndex: 1000,
        }}>
          <div style={{maxWidth: 1200, margin: '0 auto'}}>
            <button
              onClick={handleEnrollClick}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: 12,
                backgroundColor: theme.colors.mainColor,
                color: theme.colors.white,
                ...theme.fonts.Lato_700Bold,
                fontSize: 16,
                boxShadow: '0 4px 15px rgba(37, 73, 150, 0.2)',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              {user ? 'Enroll Now' : 'Register & Enroll'} - ₹{workshop.type === 0 ? workshop.price : workshop.price_2}
            </button>
          </div>
        </div>

        {/* Registration Form Slide-up */}
        {!user && showRegistration && renderRegistrationForm()}
        {renderMultipleAccountsModal()}
      </main>
    );
  };

  return (
    <components.Screen>
      <components.Header title="Workshop Details" showGoBack={true} />
      {renderContent()}
      <components.BottomTabBar />
    </components.Screen>
  );
};
