'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import Image from 'next/image';

import {text} from '../../../text';
import {theme} from '../../../constants';
import {URLS} from '../../../config';
import {components} from '../../../components';
import {svg} from '../../../svg';
import {LoadingSkeleton} from '../../../components/LoadingSkeleton';

interface Workshop {
  id: number;
  name: string;
  image: string;
  price: number;
  price_2: number;
  type: number;
  cut_price: number | null;
}

interface Coupon {
  id: number;
  coupon_code: string;
  flat_discount: number;
  valid_till: string;
  count: number;
  workshop_id: number | null;
  workshop_type: number;
  is_visible: number;
}

interface Cart {
  id: number;
  user_id: number;
  is_bought: number;
  coupon_code: string | null;
  discount: number;
  price: number;
  payment_id: string | null;
  payment_status: number;
  requesting_payment: number;
  order_id: string | null;
  verify_token: string | null;
  url: string | null;
  webhook: string | null;
  created_at: string;
  updated_at: string;
}

interface Props {
  params: {
    id: string;
  };
}

export default function CheckoutPage({params}: Props) {
  const {id} = params;
  const router = useRouter();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showMultipleAccounts, setShowMultipleAccounts] = useState(false);
  const [multipleAccounts, setMultipleAccounts] = useState<any[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/sign-in');
      return;
    }
    setUser(JSON.parse(userData));
    // Fetch all data concurrently
    Promise.all([
      fetchWorkshopDetails(),
      fetchApplicableCoupons(),
      fetchCart()
    ]).finally(() => setLoading(false));

  }, [id]);

  const fetchWorkshopDetails = async () => {
    try {
      setError(null);
      
      const response = await fetch(`/api/workshops/${id}`);
      const data = await response.json();
      
      if (response.ok) {
        setWorkshop(data.workshop);
      } else {
        setError(data.error || 'Failed to fetch workshop details');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    }
  };

  const fetchApplicableCoupons = async () => {
    try {
      const response = await fetch(`/api/coupons/applicable?workshop_id=${id}`);
      const data = await response.json();
      
      if (data.success) {
        setCoupons(data.coupons);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  const fetchCart = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return;

      const user = JSON.parse(userData);
      const response = await fetch(`/api/carts?user_id=${user.id}&workshop_id=${id}`);
      const data = await response.json();

      if (data.success) {
        if (data.cart) {
          setCart(data.cart);
          if (data.cart.coupon_code) {
            const coupon = coupons.find(c => c.coupon_code === data.cart.coupon_code);
            if (coupon) {
              setSelectedCoupon(coupon);
            }
          }
        } else {
          const createResponse = await fetch('/api/coupons/apply', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              workshop_id: id,
              user_id: user.id,
            }),
          });

          const createData = await createResponse.json();
          if (createData.success) {
            setCart(createData.cart);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const handleRemoveCoupon = async () => {
    if (!cart || !workshop) {
      console.log('Cart or workshop is missing:', { cart, workshop });
      return;
    }

    try {
      setError(null);
      console.log('Removing coupon from cart:', cart.id);
      
      const response = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workshop_id: id,
          user_id: user.id,
          cart_id: cart.id,
        }),
      });

      const data = await response.json();
      console.log('Coupon removal response:', data);
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to remove coupon');
      }

      const updatedCart = {
        ...cart,
        coupon_code: null,
        discount: 0,
        price: workshop.type === 0 ? workshop.price : workshop.price_2,
      };
      console.log('Updating cart with:', updatedCart);
      
      setCart(updatedCart);
      setSelectedCoupon(null);
    } catch (error) {
      console.error('Error removing coupon:', error);
      setError(error instanceof Error ? error.message : 'Failed to remove coupon');
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || !user) return;

    try {
      setIsApplyingCoupon(true);
      setError(null);

      const response = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coupon_code: couponCode,
          workshop_id: id,
          user_id: user.id,
          cart_id: cart?.id,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to apply coupon');
      }

      setSelectedCoupon(data.coupon);
      setCart(data.cart);
      setCouponCode('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to apply coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const calculateFinalPrice = () => {
    if (!workshop) return 0;

    const basePrice = workshop.type === 0 ? workshop.price : workshop.price_2;
    if (!selectedCoupon) return basePrice;

    return Math.max(0, basePrice - selectedCoupon.flat_discount);
  };

  const handleAccountSelect = async (selectedUser: any) => {
    try {
      setIsProcessingPayment(true);
      setError(null);

      const response = await fetch('/api/auth/verify-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: selectedUser.name,
          email: selectedUser.email,
          phone: selectedUser.mobile,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to select account');
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('sessionToken', data.user.sessionToken);
      setUser(data.user);
      setShowMultipleAccounts(false);
      setMultipleAccounts([]);

      await handleProceedToPayment();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to select account');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleProceedToPayment = async () => {
    if (!user || !workshop || !cart) return;

    try {
      setIsProcessingPayment(true);
      setError(null);

      // Check if user has required fields
      if (!user.name || !user.email || !user.mobile) {
        throw new Error('Please complete your profile with name, email and mobile number before proceeding with payment');
      }

      const response = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          workshop_id: workshop.id,
          amount: calculateFinalPrice(),
          coupon_code: selectedCoupon?.coupon_code || null,
          cart_id: cart.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
        }),
      });

      const data = await response.json();

      if (data.success && data.payment_url) {
        router.push(data.payment_url);
      } else {
        throw new Error(data.message || 'Payment initiation failed');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to initiate payment');
    } finally {
      setIsProcessingPayment(false);
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

  const renderCouponSection = () => {
    if (!workshop || !cart) return null; 
    
    return (
      <section style={{marginBottom: 32}}>
        <text.H3 style={{marginBottom: 16}}>Apply Coupon</text.H3>
        {selectedCoupon ? (
          <div style={{
            padding: 20,
            borderRadius: 16,
            backgroundColor: `${theme.colors.mainColor}05`,
            boxShadow: '0 4px 15px rgba(37, 73, 150, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <text.T16 style={{...theme.fonts.Lato_700Bold, color: theme.colors.mainColor}}>
                {selectedCoupon.coupon_code} Applied!
              </text.T16>
              <text.T14 style={{color: theme.colors.secondaryTextColor, marginTop: 4}}>
                You save ₹{selectedCoupon.flat_discount} with this coupon.
              </text.T14>
            </div>
            <button
              onClick={handleRemoveCoupon}
              style={{
                backgroundColor: theme.colors.coralRed,
                color: theme.colors.white,
                padding: '8px 16px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                ...theme.fonts.Lato_700Bold,
                fontSize: 14,
                transition: 'background-color 0.2s ease',
              }}
              className="clickable"
            >
              Remove
            </button>
          </div>
        ) : (
          <div style={{display: 'flex', gap: 12}}>
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: 8,
                border: `1px solid ${theme.colors.secondaryTextColor}20`,
                fontSize: 14,
                color: theme.colors.mainColor,
              }}
            />
            <button
              onClick={handleApplyCoupon}
              disabled={isApplyingCoupon || !couponCode.trim()}
              style={{
                padding: '12px 24px',
                borderRadius: 8,
                backgroundColor: theme.colors.mainColor,
                color: theme.colors.white,
                ...theme.fonts.Lato_700Bold,
                fontSize: 14,
                cursor: isApplyingCoupon || !couponCode.trim() ? 'not-allowed' : 'pointer',
                opacity: isApplyingCoupon || !couponCode.trim() ? 0.7 : 1,
                border: 'none',
                transition: 'opacity 0.2s ease',
              }}
              className="clickable"
            >
              {isApplyingCoupon ? 'Applying...' : 'Apply'}
            </button>
          </div>
        )}

        {error && ( // Display general error for coupon application
          <text.T14 style={{color: 'red', marginTop: 12, textAlign: 'center'}}>
            {error}
          </text.T14>
        )}

        {coupons.length > 0 && !selectedCoupon && (
          <div style={{marginTop: 20}}>
            <text.T14 style={{marginBottom: 10, color: theme.colors.secondaryTextColor}}>
              Available Coupons:
            </text.T14>
            <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  onClick={() => setCouponCode(coupon.coupon_code)}
                  style={{
                    padding: '10px 15px',
                    borderRadius: 8,
                    border: `1px dashed ${theme.colors.mainColor}`,
                    backgroundColor: `${theme.colors.mainColor}05`,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'background-color 0.2s ease',
                  }}
                  className="clickable"
                >
                  <div>
                    <text.T14 style={{...theme.fonts.Lato_700Bold, color: theme.colors.mainColor}}>
                      {coupon.coupon_code}
                    </text.T14>
                    <text.T12 style={{color: theme.colors.secondaryTextColor, marginTop: 2}}>
                      Flat ₹{coupon.flat_discount} OFF
                    </text.T12>
                  </div>
                  <text.T12 style={{color: theme.colors.secondaryTextColor}}>
                    Valid till {new Date(coupon.valid_till).toLocaleDateString()}
                  </text.T12>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    );
  };

  const renderPriceDetails = () => {
    if (!workshop || !cart) return null; 

    return (
      <section style={{marginBottom: 32}}>
        <text.H3 style={{marginBottom: 16}}>Price Details</text.H3>
        <div style={{
          padding: 20,
          borderRadius: 16,
          backgroundColor: theme.colors.white,
          boxShadow: '0 4px 15px rgba(37, 73, 150, 0.1)',
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 12}}>
            <text.T16 style={{color: theme.colors.secondaryTextColor}}>Workshop Price</text.T16>
            <text.T16 style={{color: theme.colors.mainColor, ...theme.fonts.Lato_700Bold}}>
              ₹{workshop.type === 0 ? workshop.price : workshop.price_2}
            </text.T16>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 12}}>
            <text.T16 style={{color: theme.colors.secondaryTextColor}}>Discount</text.T16>
            <text.T16 style={{color: theme.colors.coralRed, ...theme.fonts.Lato_700Bold}}>
              - ₹{selectedCoupon ? selectedCoupon.flat_discount : 0}
            </text.T16>
          </div>
          <div style={{
            height: 1,
            backgroundColor: `${theme.colors.secondaryTextColor}20`,
            margin: '20px 0',
          }} />
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <text.H3 style={{color: theme.colors.mainColor}}>Total Amount</text.H3>
            <text.H3 style={{color: theme.colors.mainColor}}>
              ₹{calculateFinalPrice()}
            </text.H3>
          </div>
        </div>
      </section>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingSkeleton />;
    }

    if (error) {
      return (
        <div style={{textAlign: 'center', padding: '20px', color: 'red'}}>
          {error}
        </div>
      );
    }

    if (!workshop) {
      return (
        <div style={{textAlign: 'center', padding: '20px'}}>
          Workshop not found
        </div>
      );
    }

    return (
      <main className='scrollable' style={{paddingBottom: 100}}>
        <div style={{maxWidth: 800, margin: '0 auto', padding: '20px'}}>
          {/* Workshop Details */}
          <section style={{marginBottom: 32}}>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: 20}}>
              <div style={{
                position: 'relative',
                width: 100,
                height: 100,
                borderRadius: 12,
                overflow: 'hidden',
                marginRight: 16,
                boxShadow: '0 4px 15px rgba(37, 73, 150, 0.1)',
              }}>
                <Image
                  src={workshop.image ? `${URLS.IMAGE_URL}${workshop.image}` : `${URLS.IMAGE_URL}/public/img/workshop/placeholder.png`}
                  alt={workshop.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div>
                <text.H3 style={{color: theme.colors.mainColor, marginBottom: 8}}>
                  {workshop.name}
                </text.H3>
                <text.T14 style={{color: theme.colors.secondaryTextColor}}>
                  Price: ₹{workshop.type === 0 ? workshop.price : workshop.price_2}
                </text.T14>
                {workshop.cut_price && (
                  <text.T12 style={{color: theme.colors.secondaryTextColor, textDecoration: 'line-through'}}>
                    MRP: ₹{workshop.cut_price}
                  </text.T12>
                )}
              </div>
            </div>
          </section>

          {renderCouponSection()}
          {renderPriceDetails()}

          <components.Button
            label={isProcessingPayment ? 'Processing Payment...' : `Pay Now - ₹${calculateFinalPrice()}`}
            onClick={handleProceedToPayment}
            style={{marginBottom: 20, width: '100%'}}
            disabled={isProcessingPayment || !cart}
          />
        </div>
        {renderMultipleAccountsModal()}
      </main>
    );
  };

  return (
    <components.Screen>
      <components.Header title="Checkout" showGoBack={true} />
      {renderContent()}
      <components.BottomTabBar />
    </components.Screen>
  );
}
