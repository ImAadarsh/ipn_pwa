import React, { useEffect } from 'react';

interface PhoneEmailButtonProps {
  onVerificationSuccess: (userJsonUrl: string) => void;
}

export const PhoneEmailButton: React.FC<PhoneEmailButtonProps> = ({ onVerificationSuccess }) => {
  useEffect(() => {
    // Load the external script
    const script = document.createElement('script');
    script.src = "https://www.phone.email/sign_in_button_v1.js";
    script.async = true;
    document.querySelector('.pe_signin_button')?.appendChild(script);

    // Define the listener function
    window.phoneEmailListener = function(userObj: { user_json_url: string }) {
      onVerificationSuccess(userObj.user_json_url);
    };

    return () => {
      // Cleanup the listener function when the component unmounts
      window.phoneEmailListener = null;
    };
  }, [onVerificationSuccess]);

  return (
    <div 
      className="pe_signin_button" 
      data-client-id="15695407177920574360"
      style={{ width: '100%', marginBottom: '20px' }}
    />
  );
};

// Add TypeScript declaration for the global window object
declare global {
  interface Window {
    phoneEmailListener: ((userObj: { user_json_url: string }) => void) | null;
  }
} 