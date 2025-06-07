'use client';

import React from 'react';

import {text} from '../../text';
import {components} from '../../components';
import {theme} from '@/constants';

const privacyPolicy = [
  {
    id: 1,
    title: 'Introduction',
    content:
      'IPN Academy is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. Please read this policy carefully to understand our practices regarding your personal data.',
  },
  {
    id: 2,
    title: '1. Information We Collect',
    content:
      'We may collect and process the following types of information:\n\n1.1 Personal Information: Information that can be used to identify you as an individual, such as your name, email address, phone number, billing address, and payment information.\n\n1.2 Usage Data: Information about how you interact with our website and services, including your IP address, browser type, pages visited, and the date and time of your visit.\n\n1.3 Cookies and Tracking Technologies: We use cookies and similar tracking technologies to collect information about your browsing activities. This helps us improve our website and provide a better user experience.',
  },
  {
    id: 3,
    title: '2. How We Use Your Information',
    content:
      'We use the information we collect for various purposes, including:\n\n2.1 To Provide and Improve Our Services: We use your information to process your enrollment, provide customer support, and enhance the quality of our workshops.\n\n2.2 To Communicate with You: We may use your contact information to send you updates, promotional materials, and other information related to our services. You can opt out of these communications at any time.\n\n2.3 To Personalize Your Experience: We use cookies and usage data to personalize your experience on our website and tailor our content to your interests.\n\n2.4 To Comply with Legal Obligations: We may use your information to comply with legal and regulatory requirements.',
  },
  {
    id: 4,
    title: '3. How We Share Your Information',
    content:
      'We do not sell, trade, or otherwise transfer your personal information to third parties, except in the following circumstances:\n\n3.1 Service Providers: We may share your information with third-party service providers who assist us in operating our website and providing our services, such as payment processors and email service providers. These service providers are obligated to keep your information confidential and use it only for the purposes for which it was disclosed.\n\n3.2 Legal Requirements: We may disclose your information if required to do so by law or in response to valid requests by public authorities.\n\n3.3 Business Transfers: In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred to the new owner.',
  },
  {
    id: 5,
    title: '4. Data Security',
    content:
      'We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the internet or method of electronic storage is completely secure, and we cannot guarantee absolute security.',
  },
  {
    id: 6,
    title: '5. Data Retention',
    content:
      'We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.',
  },
  {
    id: 7,
    title: '6. Your Rights',
    content:
      'You have the following rights regarding your personal information:\n\n6.1 Access: You have the right to request access to the personal information we hold about you.\n\n6.2 Correction: You have the right to request that we correct any inaccuracies in your personal information.\n\n6.3 Deletion: You have the right to request that we delete your personal information, subject to certain exceptions.\n\n6.4 Objection: You have the right to object to the processing of your personal information for certain purposes, such as direct marketing.\n\n6.5 Data Portability: You have the right to request a copy of your personal information in a structured, commonly used, and machine-readable format. To exercise any of these rights, please contact us using the contact information provided below.',
  },
  {
    id: 8,
    title: '7. Third-Party Links',
    content:
      'Our website may contain links to third-party websites. We are not responsible for the privacy practices or the content of these websites. We encourage you to read the privacy policies of any third-party websites you visit.',
  },
  {
    id: 9,
    title: '8. Changes to This Privacy Policy',
    content:
      'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. Your continued use of our website and services after any changes indicates your acceptance of the revised policy.',
  },
  {
    id: 10,
    title: '9. Contact Us',
    content:
      'If you have any questions or concerns about this Privacy Policy, please contact us at:\n\nEmail: ipnacademy@ipnindia.in\nPhone: (+91) 8400700199\n\nEffective Date: 1st May, 2024',
  },
  {
    id: 11,
    title: '10. Workshop Certificate Policy',
    content:
      'To be eligible for a workshop certificate, participants must attend at least 75% of the workshop sessions. This attendance requirement ensures that participants have gained sufficient knowledge and experience from the workshop to receive certification.',
  },
];

export const PrivacyPolicy: React.FC = () => {
  const renderBackground = () => {
    return <components.Background version={1} />;
  };

  const renderHeader = () => {
    return <components.Header title='Privacy Policy' showGoBack={true} />;
  };

  const renderContent = () => {
    return (
      <main
        className='container scrollable'
        style={{paddingBottom: 20, paddingTop: 20}}
      >
        {privacyPolicy.map((item) => {
          return (
            <div style={{marginBottom: '10%'}} key={item.id}>
              <text.H5 style={{marginBottom: 10}}>{item.title}</text.H5>
              <p
                style={{
                  ...theme.fonts.Lato,
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: theme.colors.bodyTextColor,
                  whiteSpace: 'pre-line'
                }}
              >
                {item.content}
              </p>
            </div>
          );
        })}
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
