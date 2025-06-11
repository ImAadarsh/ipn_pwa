'use client';

import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import { FaRegClock, FaRegCalendarAlt, FaUsers, FaRegStar, FaCentos, FaTrophy } from 'react-icons/fa';
import { MdOutlineDateRange, MdLocationPin } from "react-icons/md";

import {text} from '../../../text';
import {Routes} from '../../../routes';
import {theme} from '../../../constants';
import {URLS} from '../../../config';
import {components} from '../../../components';
import {utils} from '../../../utils';
import {svg} from '../../../svg';
import {LoadingSkeleton} from '../../../components/LoadingSkeleton';

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

interface Stats {
  total_users_count: number;
  workshops_count: number;
  countries_count: number;
  educators_count: number;
  cities_count: number;
  certifications_count: number;
  learning_hours_count: number;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  user_name: string;
  user_profile: string;
  trainer_name: string;
  created_at: string;
}

interface FAQ {
  id: number;
  name: string; // This will be the question
  description: string; // This will be the answer
}

interface RecentPurchase {
  user_name: string;
  workshop_name: string;
  purchase_date: string;
  user_profile: string;
  user_city: string;
}

interface Props {
  id: string;
}

export const CourseDetails: React.FC<Props> = ({id}) => {
  const router = useRouter();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [recentPurchases, setRecentPurchases] = useState<RecentPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'trainer' | 'reviews'>('description');
  const [showRegistration, setShowRegistration] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [multipleAccounts, setMultipleAccounts] = useState<User[]>([]);
  const [showMultipleAccounts, setShowMultipleAccounts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  };

  const calculateTimeLeft = () => {
    if (!workshop?.start_date) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    
    const difference = new Date(workshop.start_date).getTime() - new Date().getTime();
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchWorkshopDetails();
    fetchStats();
    fetchReviews();
    fetchFaqs();
    fetchRecentPurchases();
  }, [id]);

  useEffect(() => {
    if (user?.id && workshop?.id) {
      checkPurchaseStatus();
    }
  }, [user?.id, workshop?.id]);

  useEffect(() => {
    if (workshop?.start_date) {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [workshop?.start_date]);

  const checkPurchaseStatus = async () => {
    if (!user || !workshop) return;

    try {
      const response = await fetch(`/api/check-purchase?userId=${user.id}&workshopId=${workshop.id}`);
      const data = await response.json();

      if (response.ok && data.isPurchased) {
        setIsPurchased(true);
      } else {
        setIsPurchased(false);
      }
    } catch (error) {
      console.error('Error checking purchase status:', error);
      setIsPurchased(false);
    }
  };

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

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      
      if (response.ok && data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews?limit=10');
      const data = await response.json();
      
      if (response.ok && data.success) {
        setReviews(data.data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchFaqs = async () => {
    try {
      const response = await fetch('/api/faqs');
      const data = await response.json();
      if (response.ok && data.success) {
        setFaqs(data.data);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  const fetchRecentPurchases = async () => {
    try {
      const response = await fetch('/api/recent-purchases');
      const data = await response.json();
      if (response.ok && data.success) {
        setRecentPurchases(data.data);
      }
    } catch (error) {
      console.error('Error fetching recent purchases:', error);
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
                        <svg.CheckSvg color={theme.colors.mainColor} />
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

                        {/* Countdown Timer Section */}
            {workshop?.start_date && new Date(workshop.start_date).getTime() > Date.now() && (
              <div style={{
                marginTop: 60,
                padding: '40px',
                borderRadius: 20,
                background: `linear-gradient(45deg, ${theme.colors.mainOrange}, ${theme.colors.mainColor})`,
                color: theme.colors.white,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                animation: 'pulse-gradient 2s infinite alternate',
                border: '2px solid rgba(255, 255, 255, 0.5)',
                backgroundSize: '200% 200%',
                backgroundPosition: '0% 50%',
                filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.5))',
              }}>
                <style jsx>{`
                  @keyframes pulse-gradient {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 100% 50%; }
                  }
                  .timer-unit {
                    display: inline-block;
                    margin: 0 5px;
                    padding: 4px 6px;
                    background: rgba(255, 255, 255, 0.15);
                    border-radius: 15px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    min-width: 55px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    transform: scale(1); /* Added initial transform */
                  }
                  .timer-unit:hover {
                    transform: scale(1.05) rotate(1deg);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
                  }
                  .timer-number {
                    font-size: 2.5rem;
                    font-weight: 800;
                    line-height: 1;
                    color: #FFF;
                    text-shadow: 0 2px 5px rgba(0,0,0,0.3);
                    position: relative;
                    z-index: 1;
                    transition: all 0.3s ease;
                  }
                  .timer-label {
                    font-size: 0.6rem;
                    font-weight: 600;
                    margin-top: 10px;
                    opacity: 0.8;
                    color: white;
                    position: relative;
                    z-index: 1;
                  }
                  .sparkle {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    background: #FFF;
                    border-radius: 50%;
                    opacity: 0;
                    animation: sparkle 1s forwards;
                  }
                  @keyframes sparkle {
                    0% { transform: scale(0) translateY(0); opacity: 1; }
                    100% { transform: scale(1) translateY(-20px); opacity: 0; }
                  }
                  .hover-scale:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 25px rgba(0,0,0,0.4);
                  }
                  .active-scale:active {
                    transform: translateY(2px);
                  }
                `}</style>
                <text.T14 style={{
                  ...theme.fonts.Lato_700Bold,
                  fontSize: 16,
                  marginBottom: 3,
                  textShadow: '0 2px 5px rgba(0,0,0,0.3)',
                  letterSpacing: 2,
                  color: 'rgba(255, 255, 255, 0.9)',
                }}>
                  Limited Time Offer !!
                </text.T14>
                <text.T10 style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: 30,
                  fontWeight: 600,
                }}>
                  Workshop starts in:
                </text.T10>
                <div id="countdown-timer" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div className="timer-unit">
                    <div className="timer-number">{timeLeft.days}</div>
                    <div className="timer-label">Days</div>
                  </div>
                  <div className="timer-unit">
                    <div className="timer-number">{timeLeft.hours}</div>
                    <div className="timer-label">Hours</div>
                  </div>
                  <div className="timer-unit">
                    <div className="timer-number">{timeLeft.minutes}</div>
                    <div className="timer-label">Minutes</div>
                  </div>
                  <div className="timer-unit">
                    <div className="timer-number">{timeLeft.seconds}</div>
                    <div className="timer-label">Seconds</div>
                  </div>
                </div>
                <button
                  onClick={handleEnrollClick}
                  disabled={isPurchased}
                  style={{
                    marginTop: 40,
                    padding: '16px 32px',
                    borderRadius: 12,
                    background: isPurchased ? 'rgba(255, 255, 255, 0.3)' : theme.colors.white,
                    color: isPurchased ? 'rgba(255, 255, 255, 0.7)' : theme.colors.mainColor,
                    ...theme.fonts.Lato_700Bold,
                    fontSize: 14,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                    cursor: isPurchased ? 'not-allowed' : 'pointer',
                    border: 'none',
                    opacity: isPurchased ? 0.7 : 1,
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                  className="hover-scale active-scale"
                >
                  {isPurchased ? 'Purchased' : (user ? 'Enroll Now' : 'Register & Enroll')}
                </button>
              </div>
            )}

            {/* Impact Section */}
            <div style={{marginTop: 60}}>
              <style jsx>{`
                @keyframes gradientMove {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
                @keyframes float {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-20px); }
                }
                @keyframes pulse {
                  0%, 100% { transform: scale(1); }
                  50% { transform: scale(1.05); }
                }
                @keyframes shine {
                  0% { background-position: -200% center; }
                  100% { background-position: 200% center; }
                }
                .hover-lift {
                  transition: transform 0.3s ease;
                }
                .hover-lift:hover {
                  transform: translateY(-5px);
                }
                .hover-scale {
                  transition: transform 0.3s ease;
                }
                .hover-scale:hover {
                  transform: translateY(-2px);
                }
              `}</style>

              <div style={{
                position: 'relative',
                padding: '30px 15px',
                borderRadius: 30,
                background: `linear-gradient(135deg, ${theme.colors.mainColor} 0%, ${theme.colors.mainColor}dd 100%)`,
                overflow: 'hidden',
                color: theme.colors.white,
              }}>
                {/* Animated Background */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `
                    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
                  `,
                  animation: 'gradientMove 15s ease infinite alternate',
                }} />

                {/* Content */}
                <div style={{position: 'relative', zIndex: 1}}>
                  {/* Header */}
                  <div style={{
                    textAlign: 'center',
                    marginBottom: 40,
                  }}>
                    <div style={{
                      display: 'inline-block',
                      padding: '8px 24px',
                      borderRadius: 30,
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      marginBottom: 20,
                      animation: 'pulse 2s infinite',
                    }}>
                      <text.T14 style={{
                        color: theme.colors.white,
                        ...theme.fonts.Lato_700Bold,
                        textAlign: 'center'
                      }}>
                        South Asia's #1 Teacher Training Platform
                      </text.T14>
                    </div>
                    <text.T16 style={{
                      ...theme.fonts.Lato_700Bold,
                      fontSize: 25,
                      color: theme.colors.white,
                      marginBottom: 16,
                      background: 'linear-gradient(90deg, #fff, #f0f0f0, #fff)',
                      backgroundSize: '200% auto',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      animation: 'shine 3s linear infinite',
                      textAlign: 'center'
                    }}>
                      Join {stats?.total_users_count || 0}+ Users
                    </text.T16>
                    <text.T10 style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      maxWidth: 600,
                      margin: '0 auto',
                      textAlign: 'justify'
                    }}>
                      Be part of a global movement that's revolutionizing teaching methods and empowering educators across {stats?.countries_count || 0} countries.
                    </text.T10>
                  </div>

                  {/* Stats Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: 24,
                    marginBottom: 40,
                  }}>
                    {stats && [
                      {
                        icon: <FaUsers size={24} />,
                        value: `${stats.educators_count}+`,
                        label: 'Educators Trained',
                        gradient: 'linear-gradient(45deg, #f59e0b, #fcd34d)',
                      },
                      {
                        icon: <FaRegCalendarAlt size={24} />,
                        value: `${stats.workshops_count}+`,
                        label: 'Workshops',
                        gradient: 'linear-gradient(45deg, #3b82f6, #60a5fa)',
                      },
                      {
                        icon: <FaCentos size={24} />,
                        value: `${stats.countries_count}`,
                        label: 'Countries',
                        gradient: 'linear-gradient(45deg, #10b981, #34d399)',
                      },
                      {
                        icon: <FaRegStar size={24} />,
                        value: `4.7/5`,
                        label: 'Rating',
                        gradient: 'linear-gradient(45deg, #8b5cf6, #c4b5fd)',
                      },
                    ].map((stat, index) => (
                      <div key={index} style={{
                        padding: '24px',
                        borderRadius: 20,
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'transform 0.3s ease',
                        cursor: 'pointer',
                      }} className="hover-lift">
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 16,
                          marginBottom: 16,
                        }}>
                          <div style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            background: stat.gradient,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            {stat.icon}
                          </div>
                          <div>
                            <text.H3 style={{
                              ...theme.fonts.Lato_700Bold,
                              fontSize: 28,
                              color: theme.colors.white,
                              marginBottom: 4,
                            }}>
                              {stat.value}
                            </text.H3>
                            <text.T14 style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                            }}>
                              {stat.label}
                            </text.T14>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Testimonials */}
                  <div style={{
                    padding: '8px',
                    borderRadius: 20,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    marginBottom: 40,
                  }}>
                    <text.T14 style={{
                      ...theme.fonts.Lato_700Bold,
                      fontSize: 28,
                      color: theme.colors.white,
                      marginBottom: 24,
                      textAlign: 'center',
                    }}>
                      What Our Educators Say
                    </text.T14>
                    {reviews.length > 0 ? (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: 24,
                      }}>
                        {reviews.map((review, index) => (
                          <div key={index} style={{
                            padding: '24px',
                            borderRadius: 16,
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                          }}>
                            <div style={{
                              display: 'flex',
                              gap: 8,
                              marginBottom: 16,
                            }}>
                              {[...Array(review.rating)].map((_, i) => (
                                <svg.StarSvg key={i} color={theme.colors.white} />
                              ))}
                            </div>
                            <text.T16 style={{
                              color: 'rgba(255, 255, 255, 0.9)',
                              fontStyle: 'italic',
                              marginBottom: 20,
                              lineHeight: 1.6,
                            }}>
                              "{review.comment}"
                            </text.T16>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 12,
                            }}>
                              <div style={{
                                width: 48,
                                height: 48,
                                borderRadius: 24,
                                background: 'rgba(255, 255, 255, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                              }}>
                                {review.user_profile ? (
                                  <Image
                                    src={`${URLS.IMAGE_URL}${review.user_profile}`}
                                    alt={review.user_name}
                                    width={48}
                                    height={48}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                    }}
                                  />
                                ) : (
                                  <text.T16 style={{
                                    color: theme.colors.white,
                                    ...theme.fonts.Lato_700Bold,
                                  }}>
                                    {review.user_name[0]}
                                  </text.T16>
                                )}
                              </div>
                              <div>
                                <text.T14 style={{
                                  ...theme.fonts.Lato_700Bold,
                                  color: theme.colors.white,
                                }}>
                                  {review.user_name}
                                </text.T14>
                                <text.T12 style={{
                                  color: 'rgba(255, 255, 255, 0.8)',
                                }}>
                                  {review.trainer_name} • {new Date(review.created_at).toLocaleDateString()}
                                </text.T12>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 16,
                      }}>
                        <text.T16 style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                        }}>
                          Be the first to share your experience!
                        </text.T16>
                      </div>
                    )}
                  </div>

                  {/* CTA Section */}
                  <div style={{
                    textAlign: 'center',
                  }}>
                    <button
                      onClick={handleEnrollClick}
                      disabled={isPurchased}
                      style={{
                        padding: '16px 32px',
                        borderRadius: 12,
                        background: isPurchased ? 'rgba(255, 255, 255, 0.3)' : theme.colors.white,
                        color: isPurchased ? 'rgba(255, 255, 255, 0.7)' : theme.colors.mainColor,
                        ...theme.fonts.Lato_700Bold,
                        fontSize: 16,
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                        cursor: isPurchased ? 'not-allowed' : 'pointer',
                        border: 'none',
                        opacity: isPurchased ? 0.7 : 1,
                        transition: 'transform 0.3s ease',
                      }} className="hover-scale"
                    >
                      {isPurchased ? 'You Already Purchased It' : (user ? 'Enroll Now' : 'Register & Enroll')}
                    </button>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      marginTop: 16,
                    }}>
                      <svg.ClockSvg color={theme.colors.white} />
                      <text.T14 style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                      }}>
                        Limited seats available. Secure your spot today!
                      </text.T14>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Purchases Section */}
            {recentPurchases.length > 0 && (
              <div style={{marginTop: 60}}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 30,
                }}>
                  <div>
                    <text.H3 style={{
                      ...theme.fonts.Lato_700Bold,
                      fontSize: 24,
                      color: theme.colors.mainColor,
                      marginBottom: 8,
                    }}>
                      Recent Workshops Bought
                    </text.H3>
                    <text.T14 style={{
                      color: theme.colors.secondaryTextColor,
                    }}>
                      See what others are learning
                    </text.T14>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: 12,
                  }}>
                    <button
                      onClick={() => {
                        const container = document.getElementById('recent-purchases-slider');
                        if (container) {
                          container.scrollLeft -= 400;
                        }
                      }}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        background: theme.colors.white,
                        border: `1px solid ${theme.colors.mainColor}20`,
                        color: theme.colors.mainColor,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                      }}
                      className="hover-scale"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => {
                        const container = document.getElementById('recent-purchases-slider');
                        if (container) {
                          container.scrollLeft += 400;
                        }
                      }}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        background: theme.colors.white,
                        border: `1px solid ${theme.colors.mainColor}20`,
                        color: theme.colors.mainColor,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                      }}
                      className="hover-scale"
                    >
                      →
                    </button>
                  </div>
                </div>
                <div
                  id="recent-purchases-slider"
                  style={{
                    display: 'flex',
                    gap: 24,
                    overflowX: 'auto',
                    scrollBehavior: 'smooth',
                    padding: '10px 0',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    position: 'relative',
                  }}
                >
                  <style jsx>{`
                    #recent-purchases-slider::-webkit-scrollbar {
                      display: none;
                    }
                    @keyframes slideIn {
                      from { transform: translateX(20px); opacity: 0; }
                      to { transform: translateX(0); opacity: 1; }
                    }
                    .purchase-card {
                      animation: slideIn 0.5s ease forwards;
                      min-width: 320px;
                      flex: 0 0 auto;
                      height: 280px;
                      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                      position: relative;
                      backdrop-filter: blur(10px);
                      background: rgba(255, 255, 255, 0.9);
                      border: 1px solid rgba(255, 255, 255, 0.2);
                    }
                    .purchase-card::before {
                      content: '';
                      position: absolute;
                      inset: 0;
                      border-radius: 20px;
                      padding: 2px;
                      background: linear-gradient(135deg, ${theme.colors.mainColor}40, ${theme.colors.mainColor}10);
                      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                      -webkit-mask-composite: xor;
                      mask-composite: exclude;
                      pointer-events: none;
                    }
                    .purchase-card:hover {
                      transform: translateY(-8px) scale(1.02);
                      box-shadow: 
                        0 20px 40px rgba(37, 73, 150, 0.15),
                        0 0 20px rgba(37, 73, 150, 0.1);
                    }
                    .purchase-card:hover::after {
                      content: '';
                      position: absolute;
                      inset: 0;
                      border-radius: 20px;
                      padding: 2px;
                      background: linear-gradient(135deg, ${theme.colors.mainColor}, ${theme.colors.mainColor}80);
                      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                      -webkit-mask-composite: xor;
                      mask-composite: exclude;
                      opacity: 0;
                      animation: borderGlow 2s infinite;
                    }
                    @keyframes borderGlow {
                      0% { opacity: 0; }
                      50% { opacity: 1; }
                      100% { opacity: 0; }
                    }
                    @keyframes float {
                      0% { transform: translateY(0px); }
                      50% { transform: translateY(-5px); }
                      100% { transform: translateY(0px); }
                    }
                    .user-avatar {
                      animation: float 3s ease-in-out infinite;
                    }
                    @keyframes autoScroll {
                      0% { transform: translateX(0); }
                      100% { transform: translateX(-50%); }
                    }
                    .auto-scroll {
                      animation: autoScroll 30s linear infinite;
                    }
                    .auto-scroll:hover {
                      animation-play-state: paused;
                    }
                  `}</style>
                  <div style={{
                    display: 'flex',
                    gap: 24,
                    animation: 'autoScroll 30s linear infinite',
                  }} className="auto-scroll">
                    {[...recentPurchases, ...recentPurchases, ...recentPurchases].map((purchase, index) => (
                      <div
                        key={index}
                        className="purchase-card"
                        style={{
                          padding: '24px',
                          borderRadius: 20,
                          background: 'linear-gradient(135deg, #ffffff, #f8f9ff)',
                          boxShadow: '0 10px 30px rgba(37, 73, 150, 0.08)',
                          border: '1px solid rgba(37, 73, 150, 0.1)',
                          transition: 'all 0.3s ease',
                          animationDelay: `${index * 0.1}s`,
                          position: 'relative',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                      >
                        {/* Decorative Elements */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          width: 100,
                          height: 100,
                          background: `linear-gradient(135deg, ${theme.colors.mainColor}10, transparent)`,
                          borderRadius: '0 0 0 100%',
                        }} />
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: 80,
                          height: 80,
                          background: `linear-gradient(135deg, transparent, ${theme.colors.mainColor}05)`,
                          borderRadius: '0 100% 0 0',
                        }} />

                        <div style={{
                          position: 'relative',
                          zIndex: 1,
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
                          borderRadius: 16,
                          padding: '16px',
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 16,
                            marginBottom: 20,
                          }}>
                            <div className="user-avatar" style={{
                              width: 60,
                              height: 60,
                              borderRadius: 30,
                              background: `linear-gradient(135deg, ${theme.colors.mainColor}, ${theme.colors.mainColor}80)`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              overflow: 'hidden',
                              flexShrink: 0,
                              border: '2px solid rgba(255, 255, 255, 0.7)',
                              boxShadow: '0 4px 15px rgba(37, 73, 150, 0.2)',
                            }}>
                              {purchase.user_profile && purchase.user_profile !== 'public/img/workshop/oqDdQPGw3UZnIlmNZojNfTvHHVA9KHjO1OqDHJE6.png' ? (
                                <Image
                                  src={`${URLS.IMAGE_URL}${purchase.user_profile}`}
                                  alt={purchase.user_name}
                                  width={60}
                                  height={60}
                                  style={{ objectFit: 'cover' }}
                                />
                              ) : (
                                <text.T16 style={{ color: theme.colors.white, ...theme.fonts.Lato_700Bold, fontSize: 24 }}>
                                  {purchase.user_name ? purchase.user_name[0] : 'U'}
                                </text.T16>
                              )}
                            </div>
                            <div style={{flex: 1}}>
                              <text.T16 style={{
                                ...theme.fonts.Lato_700Bold,
                                color: theme.colors.mainColor,
                                marginBottom: 4,
                              }}>
                                {purchase.user_name}
                              </text.T16>
                              {purchase.user_city && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6}}>
                                  <MdLocationPin size={16} color={theme.colors.secondaryTextColor} />
                                  <text.T12 style={{color: theme.colors.secondaryTextColor}}>
                                    {purchase.user_city}
                                  </text.T12>
                                </div>
                              )}
                            </div>
                          </div>

                          <div style={{
                            padding: '16px',
                            background: `${theme.colors.mainColor}08`,
                            borderRadius: 16,
                            marginBottom: 16,
                            border: `1px solid ${theme.colors.mainColor}15`,
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              marginBottom: 8,
                            }}>
                              <FaRegCalendarAlt size={16} color={theme.colors.mainColor} />
                              <text.T14 style={{
                                color: theme.colors.mainColor,
                                ...theme.fonts.Lato_700Bold,
                              }}>
                                Workshop
                              </text.T14>
                            </div>
                            <text.T14 style={{
                              color: theme.colors.secondaryTextColor,
                              lineHeight: 1.5,
                            }}>
                              {purchase.workshop_name}
                            </text.T14>
                          </div>

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '12px 16px',
                            background: `${theme.colors.mainColor}05`,
                            borderRadius: 12,
                            border: `1px solid ${theme.colors.mainColor}10`,
                          }}>
                            <MdOutlineDateRange size={18} color={theme.colors.mainColor} />
                            <text.T12 style={{color: theme.colors.mainColor}}>
                              Purchased {getTimeAgo(purchase.purchase_date)}
                            </text.T12>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* FAQs Section */}
            {faqs.length > 0 && (
              <div style={{marginTop: 60}}>
                <text.H3 style={{
                  ...theme.fonts.Lato_700Bold,
                  marginBottom: 30,
                  fontSize: 24,
                  textAlign: 'center',
                  color: theme.colors.mainColor,
                }}>
                  Frequently Asked Questions
                </text.H3>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  maxWidth: 800,
                  margin: '0 auto',
                }}>
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      style={{
                        borderRadius: 16,
                        background: 'rgba(255, 255, 255, 0.9)',
                        boxShadow: '0 4px 20px rgba(37, 73, 150, 0.08)',
                        overflow: 'hidden',
                        border: '1px solid rgba(37, 73, 150, 0.1)',
                        transition: 'all 0.3s ease',
                      }}
                      className="hover-scale"
                    >
                      <details style={{ cursor: 'pointer' }}>
                        <summary style={{
                          ...theme.fonts.Lato_700Bold,
                          color: theme.colors.mainColor,
                          padding: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: 16,
                          transition: 'all 0.3s ease',
                        }}>
                          <span style={{flex: 1}}>{faq.name}</span>
                          <span style={{
                            marginLeft: 16,
                            fontSize: 20,
                            transition: 'transform 0.3s ease',
                            transform: 'rotate(0deg)',
                            color: theme.colors.mainColor,
                          }} className="details-arrow">
                            ▼
                          </span>
                        </summary>
                        <style jsx>{`
                          details[open] .details-arrow {
                            transform: rotate(180deg);
                          }
                          details[open] summary {
                            border-bottom: 1px solid rgba(37, 73, 150, 0.1);
                          }
                          @keyframes slideDown {
                            from { opacity: 0; transform: translateY(-10px); }
                            to { opacity: 1; transform: translateY(0); }
                          }
                          details[open] p {
                            animation: slideDown 0.3s ease forwards;
                          }
                        `}</style>
                        <p style={{
                          color: theme.colors.secondaryTextColor,
                          padding: '20px',
                          margin: 0,
                          lineHeight: 1.6,
                          background: `${theme.colors.mainColor}05`,
                        }}>
                          {faq.description}
                        </p>
                      </details>
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
      return <LoadingSkeleton />;
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
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                padding: '5px',
              }}
            />
            <div style={{
              height: '4px',
              width: '100%',
              background: `linear-gradient(90deg, ${theme.colors.mainColor}00, ${theme.colors.mainColor}80, ${theme.colors.mainColor}00)`,
              marginTop: '10px',
              borderRadius: '2px',
            }} />
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
                  padding: '6px 14px',
                  borderRadius: 30,
                  background: 'linear-gradient(45deg, #FFDB58, #FF8C00)',
                  marginRight: 12,
                  ...theme.fonts.Lato_700Bold,
                  fontSize: 13,
                  color: theme.colors.bodyTextColor,
                  boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  border: `1px solid ${theme.colors.white}50`,
                  animation: 'premiumPulse 2s infinite alternate',
                }}>
                  <style jsx>{`
                    @keyframes premiumPulse {
                      0% { transform: scale(1); box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4); }
                      50% { transform: scale(1.02); box-shadow: 0 6px 20px rgba(255, 215, 0, 0.6); }
                      100% { transform: scale(1); box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4); }
                    }
                  `}</style>
                  <FaTrophy size={14} color={theme.colors.bodyTextColor} style={{textShadow: '0 1px 2px rgba(0,0,0,0.2)'}} />
                  <span style={{textShadow: '0 1px 2px rgba(0,0,0,0.2)'}}>Premium Workshop</span>
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
                  backgroundColor: 'transparent',
                  marginRight: 12,
                  border: `1px solid ${theme.colors.secondaryTextColor}20`,
                }}>
                  <FaRegClock size={24} color={theme.colors.lightGrey} />
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
                  backgroundColor: 'transparent',
                  marginRight: 12,
                  border: `1px solid ${theme.colors.secondaryTextColor}20`,
                }}>
                  <FaRegCalendarAlt size={24} color={theme.colors.lightGrey} />
                </div>
                <div>
                  <text.T12 style={{color: theme.colors.secondaryTextColor}}>Date & Time</text.T12>
                  <text.T14 style={{color: theme.colors.mainColor, ...theme.fonts.Lato_700Bold}}>
                    {new Date(workshop.start_date).toLocaleDateString()} at {new Date(workshop.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </text.T14>
                </div>
              </div>
              <div style={{...utils.rowCenter()}}>
                <div style={{
                  padding: 6,
                  borderRadius: 12,
                  backgroundColor: 'transparent',
                  marginRight: 12,
                  border: `1px solid ${theme.colors.secondaryTextColor}20`,
                }}>
                  <FaUsers size={24} color={theme.colors.lightGrey} />
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
                  backgroundColor: 'transparent',
                  marginRight: 12,
                  border: `1px solid ${theme.colors.secondaryTextColor}20`,
                }}>
                  <FaRegStar size={24} color={theme.colors.lightGrey} />
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
                    backgroundColor: 'transparent',
                    marginRight: 12,
                    border: `1px solid ${theme.colors.secondaryTextColor}20`,
                  }}>
                    <FaCentos size={24} color={theme.colors.lightGrey} />
                  </div>
                  <div>
                    <text.T12 style={{color: theme.colors.secondaryTextColor}}>Certification</text.T12>
                    <text.T14 style={{color: theme.colors.mainColor, ...theme.fonts.Lato_700Bold}}>
                      Yes ({workshop.cpd} CPD Hrs)
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
              disabled={isPurchased}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: 12,
                backgroundColor: isPurchased ? theme.colors.lightGrey : theme.colors.mainColor,
                color: theme.colors.white,
                ...theme.fonts.Lato_700Bold,
                fontSize: 16,
                boxShadow: '0 4px 15px rgba(37, 73, 150, 0.2)',
                cursor: isPurchased ? 'not-allowed' : 'pointer',
                border: 'none',
                opacity: isPurchased ? 0.7 : 1,
              }}
            >
              {isPurchased ? 'You Already Purchased It' : (user ? 'Enroll Now' : 'Register & Enroll')} - ₹{workshop.type === 0 ? workshop.price : workshop.price_2}
            </button>
          </div>
        </div>

        {/* Registration Form Slide-up */}
        {!user && showRegistration && renderRegistrationForm()}
        {renderMultipleAccountsModal()}

        {/* Final CTA Section */}
        <div style={{
          marginTop: 80,
          marginBottom: 100,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '80px 40px',
            borderRadius: 40,
            background: `linear-gradient(135deg, ${theme.colors.mainColor}, ${theme.colors.mainOrange})`,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 30px 60px rgba(37, 73, 150, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
            {/* Animated Background Elements */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
              `,
              animation: 'gradientMove 15s ease infinite alternate',
            }} />
            <style jsx>{`
              @keyframes gradientMove {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
              @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
              }
              @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
              }
              @keyframes shine {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
              }
              @keyframes sparkle {
                0% { transform: scale(0) rotate(0deg); opacity: 0; }
                50% { opacity: 1; }
                100% { transform: scale(1) rotate(180deg); opacity: 0; }
              }
              .sparkle {
                position: absolute;
                width: 4px;
                height: 4px;
                background: white;
                border-radius: 50%;
                animation: sparkle 2s infinite;
              }
              .hover-scale {
                transition: all 0.3s ease;
              }
              .hover-scale:hover {
                transform: translateY(-5px) scale(1.02);
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
              }
            `}</style>

            {/* Sparkle Effects */}
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="sparkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}

            {/* Content */}
            <div style={{
              position: 'relative',
              zIndex: 1,
              textAlign: 'center',
              maxWidth: 900,
              margin: '0 auto',
            }}>
              <div style={{
                display: 'inline-block',
                padding: '12px 32px',
                borderRadius: 30,
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                marginBottom: 24,
                animation: 'pulse 2s infinite',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}>
                <text.T14 style={{
                  color: theme.colors.white,
                  ...theme.fonts.Lato_700Bold,
                  fontSize: 12,
                  letterSpacing: 1,
                }}>
                  ⭐️ Limited Time Offer - Join Now ⭐️
                </text.T14>
              </div>

              <text.T14 style={{
                ...theme.fonts.Lato_700Bold,
                fontSize: 25,
                color: theme.colors.white,
                textAlign: 'center',
                marginBottom: 24,
                background: 'linear-gradient(90deg, #fff, #f0f0f0, #fff)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'shine 3s linear infinite',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                lineHeight: 1.3,
              }}>
                Transform Your Teaching Career with {workshop?.name}
              </text.T14>

              <text.T16 style={{
                color: 'rgba(255, 255, 255, 0.95)',
                marginBottom: 50,
                lineHeight: 1.8,
                fontSize: 14,
                textAlign: 'justify',
                maxWidth: 700,
                margin: '0 auto 50px',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}>
                Join thousands of educators who have already enhanced their skills and advanced their careers with our premium workshops. Don't miss this opportunity to elevate your teaching journey!
              </text.T16>

              <div style={{
                display: 'flex',
                gap: 24,
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: 40,
              }}>
                <button
                  onClick={handleEnrollClick}
                  disabled={isPurchased}
                  style={{
                    padding: '24px 48px',
                    borderRadius: 20,
                    background: isPurchased ? 'rgba(255, 255, 255, 0.3)' : theme.colors.white,
                    color: isPurchased ? 'rgba(255, 255, 255, 0.7)' : theme.colors.mainColor,
                    ...theme.fonts.Lato_700Bold,
                    fontSize: 20,
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
                    cursor: isPurchased ? 'not-allowed' : 'pointer',
                    border: 'none',
                    opacity: isPurchased ? 0.7 : 1,
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  className="hover-scale"
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                    transform: 'translateX(-100%)',
                    animation: 'shine 3s infinite',
                  }} />
                  <FaTrophy size={24} style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))' }} />
                  {isPurchased ? 'You Already Purchased It' : (user ? 'Enroll Now' : 'Register & Enroll')} - ₹{workshop?.type === 0 ? workshop?.price : workshop?.price_2}
                </button>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 20,
                flexWrap: 'wrap',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 24px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: 30,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}>
                  <FaUsers size={20} color={theme.colors.white} style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))' }} />
                  <text.T14 style={{color: theme.colors.white, ...theme.fonts.Lato_700Bold}}>
                    {workshop?.total_subscribers}+ Educators Enrolled
                  </text.T14>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 24px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: 30,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}>
                  <FaRegStar size={20} color={theme.colors.white} style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))' }} />
                  <text.T14 style={{color: theme.colors.white, ...theme.fonts.Lato_700Bold}}>
                    4.7 Rating
                  </text.T14>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 24px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: 30,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}>
                  <FaRegClock size={20} color={theme.colors.white} style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))' }} />
                  <text.T14 style={{color: theme.colors.white, ...theme.fonts.Lato_700Bold}}>
                    {workshop?.duration} Duration
                  </text.T14>
                </div>
              </div>
            </div>
          </div>
        </div>
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
