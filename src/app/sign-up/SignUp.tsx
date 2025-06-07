'use client';

import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

import {svg} from '../../svg';
import {text} from '../../text';
import {Routes} from '../../routes';
import {theme} from '../../constants';
import {components} from '../../components';

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

interface ExistingAccount {
  id: number;
  name: string | null;
  email: string | null;
  mobile: string;
  profile: string;
}

export const SignUp: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    instituteName: '',
    city: '',
    email: '',
    phone: ''
  });
  const [existingAccounts, setExistingAccounts] = useState<ExistingAccount[]>([]);
  const [showExistingAccounts, setShowExistingAccounts] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.white;
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsVerifying(true);
      setVerificationStatus('Verifying...');

      const response = await fetch('/api/auth/verify-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          designation: formData.designation,
          institute_name: formData.instituteName,
          city: formData.city
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.status === 'multiple_accounts') {
          setExistingAccounts(data.users);
          setShowExistingAccounts(true);
        } else if (data.status === 'existing_user' || data.status === 'new_user') {
          // Store user details in localStorage
          const user: User = data.user;
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('sessionToken', user.sessionToken);
          
          setVerificationStatus('Registration successful!');
          router.push(Routes.HOME);
        }
      } else {
        setVerificationStatus(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setVerificationStatus('An error occurred. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAccountSelect = async (accountId: number) => {
    try {
      setIsVerifying(true);
      setVerificationStatus('Logging in...');

      const response = await fetch('/api/auth/login-existing-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountId }),
      });

      const data = await response.json();

      if (data.success) {
        const user: User = data.user;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('sessionToken', user.sessionToken);
        
        setVerificationStatus('Login successful!');
        router.push(Routes.HOME);
      } else {
        setVerificationStatus(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setVerificationStatus('An error occurred. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const renderBackground = () => {
    return <components.Background version={1} />;
  };

  const renderHeader = () => {
    return <components.Header title='Sign up' showGoBack={true} />;
  };

  const renderExistingAccountsModal = () => {
    if (!showExistingAccounts) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 8,
          maxWidth: 400,
          width: '90%'
        }}>
          <text.H2 style={{marginBottom: 20}}>Existing Accounts Found</text.H2>
          <text.T16 style={{marginBottom: 20}}>
            We found existing accounts with your email or phone number. Please select an account to continue.
          </text.T16>
          {existingAccounts.map(account => (
            <div
              key={account.id}
              style={{
                padding: 10,
                border: '1px solid #ddd',
                borderRadius: 4,
                marginBottom: 10,
                cursor: 'pointer',
                backgroundColor: '#f8f8f8'
              }}
              onClick={() => handleAccountSelect(account.id)}
            >
              <text.T16>Name: {account.name || 'N/A'}</text.T16>
              <text.T16>Email: {account.email || 'N/A'}</text.T16>
              <text.T16>Phone: {account.mobile || 'N/A'}</text.T16>
            </div>
          ))}
          <div style={{marginTop: 20, textAlign: 'center'}}>
            <Link href={Routes.SIGN_IN}>
              <text.T16 style={{color: theme.colors.mainColor, cursor: 'pointer'}}>
                Cancel and go to Sign In
              </text.T16>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <main
        className='scrollable container'
        style={{paddingTop: '8%', paddingBottom: '8%'}}
      >
        {/* LOGO */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 20,
          }}
        >
          <svg.SmallLogoSvg />
        </div>

        {/* HEADER */}
        <section>
          <text.H1
            style={{
              marginBottom: 30,
              textAlign: 'center',
              textTransform: 'capitalize',
            }}
          >
            Sign up
          </text.H1>
        </section>

        {/* INPUT FIELDS */}
        <section style={{marginBottom: 20}}>
          <components.InputField
            label='Full Name *'
            inputType='text'
            placeholder='Enter your full name'
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            containerStyle={{marginBottom: '10px'}}
          />
          <components.InputField
            label='Designation *'
            inputType='text'
            placeholder='Enter your designation'
            value={formData.designation}
            onChange={(e) => handleInputChange('designation', e.target.value)}
            containerStyle={{marginBottom: '10px'}}
          />
          <components.InputField
            label='Institute Name / School Name *'
            inputType='text'
            placeholder='Enter your institute or school name'
            value={formData.instituteName}
            onChange={(e) => handleInputChange('instituteName', e.target.value)}
            containerStyle={{marginBottom: '10px'}}
          />
          <components.InputField
            label='City *'
            inputType='text'
            placeholder='Enter your city'
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            containerStyle={{marginBottom: '10px'}}
          />
          <components.InputField
            label='Email *'
            inputType='email'
            placeholder='Enter your email'
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            containerStyle={{marginBottom: '10px'}}
          />
          <components.InputField
            label='Phone Number *'
            inputType='tel'
            placeholder='Enter your phone number (without country code or zero)'
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            containerStyle={{marginBottom: '10px'}}
          />
        </section>

        {/* SIGN UP BUTTON */}
        <section style={{marginBottom: 14}}>
          <components.Button
            label='Sign up'
            onClick={handleSubmit}
            style={{ opacity: isVerifying ? 0.7 : 1 }}
          />
        </section>

        {verificationStatus && (
          <text.T16 
            style={{
              marginBottom: 14,
              textAlign: 'center',
              color: verificationStatus.includes('successful') ? 'green' : 'red',
              opacity: isVerifying ? 0.7 : 1
            }}
          >
            {verificationStatus}
          </text.T16>
        )}

        {/* SIGN IN LINK */}
        <section style={{marginBottom: '10%'}}>
          <text.T16>
            Already have an account?{' '}
            <Link
              href={Routes.SIGN_IN}
              style={{color: theme.colors.mainColor, fontWeight: 700}}
            >
              Sign in.
            </Link>
          </text.T16>
        </section>



        {renderExistingAccountsModal()}
      </main>
    );
  };

  return (
    <components.Screen>
      {renderBackground()}
      {renderHeader()}
      {renderContent()}
    </components.Screen>
  );
};
