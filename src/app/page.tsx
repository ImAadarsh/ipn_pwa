import React from 'react';
import type {Metadata, Viewport} from 'next';

import {theme} from '../constants';
import {Onboarding} from './Onboarding';
import {URLS} from '../config';
import {GoogleAnalytics} from '../components/GoogleAnalytics';

export const metadata: Metadata = {
  title: 'IPN Academy - Your Gateway to Professional Excellence',
  description: 'Discover IPN Academy - Transform your career with cutting-edge resources, expert-led courses, and professional development opportunities. Start your journey to excellence today.',
  keywords: 'IPN Academy, professional development, career growth, online courses, skill development, professional training, career advancement',
  authors: [{ name: 'Endeavour Digital' }],
  openGraph: {
    title: 'IPN Academy - Your Gateway to Professional Excellence',
    description: 'Transform your career with IPN Academy. Access cutting-edge resources and expert-led courses for professional growth.',
    url: 'https://app.ipnacademy.in',
    siteName: 'IPN Academy',
    images: [
      {
        url: `${URLS.MAIN_URL}/assets/other/04.png`,
        width: 1200,
        height: 630,
        alt: 'IPN Academy - Professional Development Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IPN Academy - Your Gateway to Professional Excellence',
    description: 'Transform your career with IPN Academy. Access cutting-edge resources and expert-led courses for professional growth.',
    images: [`${URLS.MAIN_URL}/assets/other/04.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google88242d7f75bf33b6', // Add your Google verification code
  },
};

export const viewport: Viewport = {
  themeColor: theme.colors.white,
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function StartPage() {
  return (
    <>
      <GoogleAnalytics />
      <Onboarding />
    </>
  );
}
