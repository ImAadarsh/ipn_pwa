'use client';

import Image from 'next/image';
import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';

import {svg} from '../../svg';
import {URLS} from '../../config';
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

export const ProfileEdit: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    city: '',
    designation: '',
    institute_name: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.white;

    // Load user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData: User = JSON.parse(storedUser);
      setUser(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        mobile: userData.mobile || '',
        city: userData.city || '',
        designation: userData.designation || '',
        institute_name: userData.institute_name || ''
      });
    }
    setLoading(false);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      const sessionToken = localStorage.getItem('sessionToken');
      
      if (!sessionToken) {
        throw new Error('No session token found');
      }

      const response = await fetch('/api/user/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        // Update localStorage with new user data
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        router.push(Routes.PROFILE);
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push(Routes.SIGN_IN);
    return null;
  }

  const renderBackground = () => {
    return <components.Background version={1} />;
  };

  const renderHeader = () => {
    return <components.Header showGoBack={true} title='Profile Edit' />;
  };

  const renderContent = () => {
    return (
      <main
        className='scrollable container'
        style={{paddingTop: 20, paddingBottom: 20}}
      >
        <div
          style={{
            position: 'relative',
            maxWidth: 120,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: 30,
          }}
          className='center'
        >
          <Image
            src={user.profile ? `${URLS.IMAGE_URL}${user.profile}` : `${URLS.IMAGE_URL}public/img/workshop/oqDdQPGw3UZnIlmNZojNfTvHHVA9KHjO1OqDHJE6.png`}
            alt='User'
            width={120}
            height={120}
            style={{
              width: '100%',
              height: 'auto',
              margin: '0 auto',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
        </div>

        <components.InputField
          label='Name'
          type='text'
          inputType='text'
          placeholder='Enter your name'
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          containerStyle={{marginBottom: 10}}
        />

        <components.InputField
          label='Email'
          type='email'
          inputType='email'
          placeholder='Enter your email'
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          containerStyle={{marginBottom: 10}}
        />

        <components.InputField
          label='Phone number'
          type='tel'
          inputType='phone'
          placeholder='Enter your phone number'
          value={formData.mobile}
          onChange={(e) => handleInputChange('mobile', e.target.value)}
          containerStyle={{marginBottom: 10}}
        />

        <components.InputField
          label='Designation'
          type='text'
          inputType='text'
          placeholder='Enter your designation'
          value={formData.designation}
          onChange={(e) => handleInputChange('designation', e.target.value)}
          containerStyle={{marginBottom: 10}}
        />

        <components.InputField
          label='Institute Name'
          type='text'
          inputType='text'
          placeholder='Enter your institute name'
          value={formData.institute_name}
          onChange={(e) => handleInputChange('institute_name', e.target.value)}
          containerStyle={{marginBottom: 10}}
        />

        <components.InputField
          label='Location'
          type='text'
          inputType='text'
          placeholder='Enter your city'
          value={formData.city}
          onChange={(e) => handleInputChange('city', e.target.value)}
          containerStyle={{marginBottom: 20}}
        />

        <components.Button 
          label={isSaving ? 'Saving...' : 'Save Changes'} 
          onClick={handleSaveChanges}
        />
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
