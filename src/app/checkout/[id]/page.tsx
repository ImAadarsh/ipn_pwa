'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import Image from 'next/image';

import {text} from '../../../text';
import {theme} from '../../../constants';
import {URLS} from '../../../config';
import {components} from '../../../components';
import {svg} from '../../../svg';

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
  params: Promise<{
    id: string;
  }>;
}

export default function CheckoutPage({params}: Props) {
  const resolvedParams = React.use(params);
  const {id} = resolvedParams;
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
    fetchWorkshopDetails();
    fetchApplicableCoupons();
    fetchCart();
  }, [id]);

  const fetchWorkshopDetails = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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
            // Find the coupon in the coupons list
            const coupon = coupons.find(c => c.coupon_code === data.cart.coupon_code);
            if (coupon) {
              setSelectedCoupon(coupon);
            }
          }
        } else {
          // If no cart exists, create one
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

      // Update the cart state with the new data
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
      // Store user data and session token
      localStorage.setItem('user', JSON.stringify(selectedUser));
      localStorage.setItem('sessionToken', selectedUser.sessionToken);
      setUser(selectedUser);
      setShowMultipleAccounts(false);
      setMultipleAccounts([]);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to select account');
    }
  };

  const handleProceedToPayment = async () => {
    if (!user || !workshop) return;

    try {
      setIsProcessingPayment(true);
      setError(null);

      // Create cart if not exists
      if (!cart) {
        const response = await fetch('/api/coupons/apply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            workshop_id: id,
            user_id: user.id,
          }),
        });

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || 'Failed to create cart');
        }
        setCart(data.cart);
      }

      // Initiate payment
      const paymentResponse = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart_id: cart?.id,
          workshop_id: id,
          user_id: user.id,
          amount: calculateFinalPrice(),
          coupon_code: selectedCoupon?.coupon_code,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
        }),
      });

      const paymentData = await paymentResponse.json();
      if (!paymentData.success) {
        throw new Error(paymentData.message || 'Failed to initiate payment');
      }

      // Redirect to payment URL
      if (paymentData.url) {
        window.location.href = paymentData.url;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to process payment');
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
    return (
      <section style={{
        marginBottom: 24,
        padding: 20,
        borderRadius: 12,
        backgroundColor: theme.colors.white,
        boxShadow: '0 4px 15px rgba(37, 73, 150, 0.1)',
      }}>
        <text.H3 style={{marginBottom: 16}}>Apply Coupon</text.H3>
        
        {selectedCoupon ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 12,
            borderRadius: 8,
            backgroundColor: `${theme.colors.mainColor}10`,
            marginBottom: 16,
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
              <svg.TagSvg />
              <text.T14 style={{color: theme.colors.mainColor, ...theme.fonts.Lato_700Bold}}>
                {selectedCoupon.coupon_code}
              </text.T14>
              <text.T14 style={{color: theme.colors.secondaryTextColor}}>
                - ₹{selectedCoupon.flat_discount}
              </text.T14>
            </div>
            <button
              onClick={handleRemoveCoupon}
              style={{
                padding: '8px 16px',
                borderRadius: 6,
                backgroundColor: theme.colors.white,
                border: `1px solid ${theme.colors.mainColor}`,
                color: theme.colors.mainColor,
                ...theme.fonts.Lato_700Bold,
                fontSize: 12,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              className="clickable"
            >
              Remove
            </button>
          </div>
        ) : (
          <div style={{display: 'flex', gap: 12, marginBottom: 16}}>
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
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
              }}
            >
              {isApplyingCoupon ? 'Applying...' : 'Apply'}
            </button>
          </div>
        )}

        {error && (
          <text.T14 style={{
            color: 'red',
            marginBottom: 16,
          }}>
            {error}
          </text.T14>
        )}

        {coupons.length > 0 && !selectedCoupon && (
          <div>
            <text.T14 style={{
              color: theme.colors.secondaryTextColor,
              marginBottom: 12,
            }}>
              Available Coupons:
            </text.T14>
            <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  onClick={() => setCouponCode(coupon.coupon_code)}
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    border: `1px solid ${theme.colors.secondaryTextColor}20`,
                    backgroundColor: theme.colors.white,
                    cursor: 'pointer',
                  }}
                  className="clickable"
                >
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                      <svg.TagSvg />
                      <text.T14 style={{...theme.fonts.Lato_700Bold}}>
                        {coupon.coupon_code}
                      </text.T14>
                    </div>
                    <text.T14 style={{color: theme.colors.mainColor}}>
                      - ₹{coupon.flat_discount}
                    </text.T14>
                  </div>
                  <text.T12 style={{
                    color: theme.colors.secondaryTextColor,
                    marginTop: 4,
                  }}>
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
    if (!workshop) return null;

    const basePrice = workshop.type === 0 ? workshop.price : workshop.price_2;
    const discount = selectedCoupon ? selectedCoupon.flat_discount : 0;
    const finalPrice = calculateFinalPrice();

    return (
      <section style={{
        padding: 20,
        borderRadius: 12,
        backgroundColor: theme.colors.white,
        boxShadow: '0 4px 15px rgba(37, 73, 150, 0.1)',
      }}>
        <text.H3 style={{marginBottom: 16}}>Price Details</text.H3>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <text.T14 style={{color: theme.colors.secondaryTextColor}}>
              Base Price
            </text.T14>
            <text.T14>₹{basePrice}</text.T14>
          </div>

          {workshop.cut_price && (
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <text.T14 style={{color: theme.colors.secondaryTextColor}}>
                Original Price
              </text.T14>
              <text.T14 style={{textDecoration: 'line-through', color: theme.colors.secondaryTextColor}}>
                ₹{workshop.cut_price}
              </text.T14>
            </div>
          )}

          {discount > 0 && (
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <text.T14 style={{color: theme.colors.secondaryTextColor}}>
                Coupon Discount
              </text.T14>
              <text.T14 style={{color: theme.colors.mainColor}}>
                - ₹{discount}
              </text.T14>
            </div>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: 12,
            borderTop: `1px solid ${theme.colors.secondaryTextColor}20`,
          }}>
            <text.H3>Total Amount</text.H3>
            <text.H3 style={{color: theme.colors.mainColor}}>
              ₹{finalPrice}
            </text.H3>
          </div>
        </div>
      </section>
    );
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
        <div style={{maxWidth: 1200, margin: '0 auto', padding: '32px 20px', paddingBottom: '100px'}}>
          {/* Workshop Info */}
          <section style={{
            marginBottom: 24,
            padding: 20,
            borderRadius: 12,
            backgroundColor: theme.colors.white,
            boxShadow: '0 4px 15px rgba(37, 73, 150, 0.1)',
          }}>
            <div style={{display: 'flex', gap: 16}}>
              <div style={{
                position: 'relative',
                width: 120,
                height: 80,
                borderRadius: 8,
                overflow: 'hidden',
                flexShrink: 0,
              }}>
                <Image
                  src={`${URLS.IMAGE_URL}${workshop.image}`}
                  alt={workshop.name}
                  width={120}
                  height={80}
                  style={{objectFit: 'cover'}}
                />
              </div>
              <div>
                <text.H3 style={{marginBottom: 8}}>{workshop.name}</text.H3>
                <text.T14 style={{color: theme.colors.secondaryTextColor}}>
                  {workshop.type === 0 ? 'Regular Workshop' : 'Premium Workshop'}
                </text.T14>
              </div>
            </div>
          </section>

          {/* Coupon Section */}
          {renderCouponSection()}

          {/* Price Details */}
          {renderPriceDetails()}
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
              onClick={handleProceedToPayment}
              disabled={isProcessingPayment}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: 12,
                backgroundColor: theme.colors.mainColor,
                color: theme.colors.white,
                ...theme.fonts.Lato_700Bold,
                fontSize: 16,
                boxShadow: '0 4px 15px rgba(37, 73, 150, 0.2)',
                cursor: isProcessingPayment ? 'not-allowed' : 'pointer',
                border: 'none',
              }}
            >
              {isProcessingPayment ? 'Processing...' : `Proceed to Payment - ₹${calculateFinalPrice()}`}
            </button>
          </div>
        </div>

        {/* Multiple Accounts Modal */}
        {showMultipleAccounts && renderMultipleAccountsModal()}
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
