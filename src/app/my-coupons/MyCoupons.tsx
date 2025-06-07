'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';

import {text} from '../../text';
import {Routes} from '../../routes';
import {theme} from '../../constants';
import {components} from '../../components';
import {LoadingSkeleton} from '../../components/LoadingSkeleton';

interface Coupon {
  id: number;
  coupon_code: string;
  flat_discount: number;
  valid_till: string;
  count: number;
  school_id: number | null;
  workshop_id: number | null;
  workshop_type: number;
  is_visible: number;
  workshop_name?: string;
  school_name?: string;
}

export const MyCoupons: React.FC = () => {
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      router.push(Routes.SIGN_IN);
      return;
    }
    
    document.body.style.backgroundColor = theme.colors.white;
    fetchCoupons();
  }, [router]);

  const copyToClipboard = async (code: string, id: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/coupons');
      const data = await response.json();

      if (data.success) {
        setCoupons(data.coupons);
      } else {
        setError(data.message || 'Failed to fetch coupons');
      }
    } catch (error) {
      setError('An error occurred while fetching coupons');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCouponStatus = (validTill: string) => {
    const now = new Date();
    const validDate = new Date(validTill);
    return now < validDate ? 'Active' : 'Expired';
  };

  const renderBackground = () => {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        overflow: 'hidden'
      }}>
        <components.Background version={1} />
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)'
      }}>
        <components.Header showGoBack={true} title='Available Coupons' />
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <LoadingSkeleton />
      );
    }

    if (error) {
      return (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 12,
          margin: '20px',
          color: 'red',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          {error}
        </div>
      );
    }

    if (coupons.length === 0) {
      return (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 12,
          margin: '20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          No coupons available at the moment
        </div>
      );
    }

    return (
      <main className='scrollable' style={{
        paddingTop: '8%',
        paddingBottom: '8%',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div className='container' style={{padding: '0 20px'}}>
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="coupon-card"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 16,
                padding: 24,
                marginBottom: 20,
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease-in-out',
                cursor: 'pointer'
              }}
            >
              <style jsx>{`
                .coupon-card:hover {
                  transform: translateY(-2px);
                }
                .copy-feedback {
                  animation: fadeInOut 2s ease-in-out;
                }
                @keyframes fadeInOut {
                  0% { opacity: 0; }
                  20% { opacity: 1; }
                  80% { opacity: 1; }
                  100% { opacity: 0; }
                }
              `}</style>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16
              }}>
                <div>
                  <div 
                    onClick={() => copyToClipboard(coupon.coupon_code, coupon.id)}
                    style={{
                      position: 'relative',
                      cursor: 'pointer'
                    }}
                  >
                    <text.H3 style={{
                      margin: 0,
                      color: theme.colors.mainColor,
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      {coupon.coupon_code}
                      <span style={{
                        fontSize: '0.9rem',
                        color: theme.colors.bodyTextColor,
                        opacity: 0.7
                      }}>
                        (tap to copy)
                      </span>
                    </text.H3>
                    {copiedId === coupon.id && (
                      <div className="copy-feedback" style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        fontSize: '0.8rem',
                        color: theme.colors.mainColor,
                        marginTop: '4px'
                      }}>
                        Copied to clipboard!
                      </div>
                    )}
                  </div>
                  <div style={{
                    fontSize: 14,
                    color: theme.colors.bodyTextColor,
                    marginTop: 8
                  }}>
                    {coupon.workshop_name || 'All Workshops'}
                  </div>
                </div>
                <div style={{
                  backgroundColor: getCouponStatus(coupon.valid_till) === 'Active' 
                    ? 'rgba(76, 175, 80, 0.1)' 
                    : 'rgba(244, 67, 54, 0.1)',
                  padding: '8px 16px',
                  borderRadius: 20,
                  color: getCouponStatus(coupon.valid_till) === 'Active'
                    ? theme.colors.mainColor
                    : theme.colors.coralRed,
                  fontWeight: 'bold',
                  fontSize: 14
                }}>
                  {getCouponStatus(coupon.valid_till)}
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 16,
                paddingTop: 16,
                borderTop: '1px solid rgba(0,0,0,0.1)'
              }}>
                <div>
                  <div style={{
                    fontSize: 28,
                    fontWeight: 'bold',
                    color: theme.colors.mainColor
                  }}>
                    ₹{coupon.flat_discount}
                  </div>
                  <div style={{
                    fontSize: 14,
                    color: theme.colors.bodyTextColor,
                    marginTop: 4
                  }}>
                    Flat Discount
                  </div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{
                    fontSize: 14,
                    color: theme.colors.bodyTextColor
                  }}>
                    Valid till
                  </div>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: theme.colors.bodyTextColor
                  }}>
                    {formatDate(coupon.valid_till)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  };

  return (
    <div className='screen' style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {renderBackground()}
      {renderHeader()}
      {renderContent()}
    </div>
  );
};
