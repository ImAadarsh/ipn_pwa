import React, {useState, useEffect} from 'react';
import {theme} from '../constants';

const shimmerAnimation = `
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

const shimmerStyle = {
  background: 'linear-gradient(90deg, #E0E0E0 25%, #F5F5F5 50%, #E0E0E0 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
};

export const WorkshopListSkeleton: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <main className='scrollable'>
      <style>{shimmerAnimation}</style>
      {/* Header Skeleton */}
      <section className='container' style={{marginTop: 10, marginBottom: 20}}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: 20,
            borderRadius: 10,
            border: `1px solid ${theme.colors.white}50`,
            backgroundColor: `${theme.colors.white}50`,
            boxShadow: '0px 4px 10px rgba(37, 73, 150, 0.05)',
          }}
        >
          <div style={{width: 200, height: 24, borderRadius: 4, marginBottom: 12, ...shimmerStyle}} />
          <div style={{width: '100%', height: 42, borderRadius: 5, ...shimmerStyle}} />
        </div>
      </section>

      {/* Workshop List Skeleton */}
      <section style={{paddingBottom: 30}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              style={{
                display: 'flex',
                padding: '0 20px',
                marginBottom: 10,
                paddingBottom: 10,
                borderBottom: '1px solid rgba(59, 89, 153, 0.1)',
              }}
            >
              <div style={{width: 295, height: 96, borderRadius: 10, marginRight: 12, ...shimmerStyle}} />
              <div style={{flex: 1}}>
                <div style={{width: '80%', height: 20, borderRadius: 4, marginBottom: 10, ...shimmerStyle}} />
                <div style={{width: '60%', height: 16, borderRadius: 4, marginBottom: 8, ...shimmerStyle}} />
                <div style={{width: '40%', height: 16, borderRadius: 4, ...shimmerStyle}} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}; 