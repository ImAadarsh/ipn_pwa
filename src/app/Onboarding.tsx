'use client';

import Image from 'next/image';
import React, {useEffect, useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';

import {text} from '../text';
import {URLS} from '../config';
import {Routes} from '../routes';
import {theme} from '../constants';
import {components} from '../components';

const onboarding = [
  {
    id: 1,
    title: 'Welcome to IPN Academy',
    image: `${URLS.MAIN_URL}/assets/onboarding/01_02.png`,
    description:
      'IPN Academy is your gateway to excellence. \n Discover cutting-edge resources and \n elevate your professional skills.',
  },
  {
    id: 2,
    title: 'Transform Your Career',
    image: `${URLS.MAIN_URL}/assets/onboarding/02_02.png`,
    description:
      'With IPN Academy, unlock new career opportunities. \n Master in-demand skills and \n accelerate your professional growth.',
  },
  {
    id: 3,
    title: 'Advance with Confidence',
    image: `${URLS.MAIN_URL}/assets/onboarding/03_02.png`,
    description:
      'IPN Academy provides a dynamic learning environment. \n Equip yourself with the tools and knowledge \n to move forward with confidence.',
  },
];

export const Onboarding: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.white;
    
    // Check if the app is already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    
    // Detect device type
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);
    
    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);

    // Handle the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isInstalled) {
        setShowInstallPrompt(true);
      }
    };

    // Show install prompt if not installed and on a supported device
    if (!isInstalled && (isIOSDevice || isAndroidDevice)) {
      if (isIOSDevice) {
        // For iOS, we can show the prompt immediately
        setShowInstallPrompt(true);
      } else {
        // For Android, we'll wait for the beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      setDeferredPrompt(null);
    }
    setShowInstallPrompt(false);
  };

  const handleClosePrompt = () => {
    setShowInstallPrompt(false);
  };

  const renderInstallPrompt = () => {
    if (!showInstallPrompt) return null;

    return (
      <div style={{
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
      }}>
        <div style={{
          backgroundColor: theme.colors.white,
          padding: '20px',
          borderRadius: '10px',
          maxWidth: '400px',
          width: '90%',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <text.H4 style={{marginBottom: '15px', color: theme.colors.mainColor, textAlign: 'center'}}>
            Install IPN Academy
          </text.H4>
          
          {isIOS ? (
            <div style={{marginBottom: '20px'}}>
              <text.T14 style={{color: theme.colors.secondaryTextColor, marginBottom: '10px'}}>
                To install on iOS:
              </text.T14>
              <ol style={{paddingLeft: '20px', color: theme.colors.secondaryTextColor}}>
                <li>Tap the Share button <span style={{fontWeight: 'bold'}}>⎋</span> in your browser</li>
                <li>Scroll down and tap "Add to Home Screen"</li>
                <li>Tap "Add" to install</li>
              </ol>
            </div>
          ) : isAndroid ? (
            <div style={{marginBottom: '20px'}}>
              <text.T14 style={{color: theme.colors.secondaryTextColor, marginBottom: '10px'}}>
                To install on Android:
              </text.T14>
              <ol style={{paddingLeft: '20px', color: theme.colors.secondaryTextColor}}>
                <li>Tap the menu button (three dots) in your browser</li>
                <li>Select "Install app" or "Add to Home screen"</li>
                <li>Tap "Install" to confirm</li>
              </ol>
            </div>
          ) : null}

          <div style={{display: 'flex', justifyContent: 'center', gap: '10px'}}>
            {isAndroid && deferredPrompt && (
              <button
                onClick={handleInstallClick}
                style={{
                  padding: '10px 20px',
                  backgroundColor: theme.colors.mainColor,
                  color: theme.colors.white,
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  ...theme.fonts.Lato
                }}
              >
                Install Now
              </button>
            )}
            <button
              onClick={handleClosePrompt}
              style={{
                padding: '10px 20px',
                backgroundColor: theme.colors.secondaryTextColor,
                color: theme.colors.white,
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                ...theme.fonts.Lato
              }}
            >
              {isAndroid ? 'Install Later' : 'Got it'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderBackground = () => {
    return <components.Background version={2} />;
  };

  const renderHeader = () => {
    return <components.Header />;
  };

  const renderCarousel = () => {
    return (
      <section
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Swiper
          onSlideChange={(swiper) => setCurrentSlideIndex(swiper.activeIndex)}
        >
          {onboarding.map((item) => (
            <SwiperSlide key={item.id} style={{width: '100%', height: 'auto'}}>
              <Image
                src={item.image}
                alt='Onboarding'
                width={0}
                height={0}
                sizes='100vw'
                priority={true}
                style={{
                  width: '80%',
                  height: 'auto',
                  margin: '0 auto',
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    );
  };

  const renderDescription = () => {
    const currentItem = onboarding[currentSlideIndex];
    return (
      <section className='container' style={{marginBottom: '8%'}}>
        <text.H2 style={{textAlign: 'center', textTransform: 'capitalize'}}>
          {currentItem.title}
        </text.H2>
        <div style={{maxWidth: 327, margin: '0 auto'}}>
          <p
            className='t16'
            style={{
              marginTop: '14px',
              textAlign: 'center',
              ...theme.fonts.Lato,
              fontSize: 16,
              lineHeight: 1.7,
              color: theme.colors.bodyTextColor,
            }}
          >
            {currentItem.description}
          </p>
        </div>
      </section>
    );
  };

  const renderDots = () => {
    return (
      <section
        className='container'
        style={{
          gap: 10,
          marginBottom: '8%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {onboarding.map((item, index: number) => (
          <div
            key={item.id}
            style={{
              width: currentSlideIndex === index ? 25 : 10,
              height: 2,
              borderRadius: '4px',
              backgroundColor:
                currentSlideIndex === index
                  ? theme.colors.mainColor
                  : theme.colors.secondaryTextColor,
            }}
          />
        ))}
      </section>
    );
  };

  const renderButton = () => {
    return (
      <section style={{padding: 20}}>
        <components.Button label='Get Started' href={Routes.SIGN_IN} />
      </section>
    );
  };

  return (
    <components.Screen>
      {renderBackground()}
      {renderHeader()}
      {renderCarousel()}
      {renderDescription()}
      {renderDots()}
      {renderButton()}
      {renderInstallPrompt()}
    </components.Screen>
  );
};
