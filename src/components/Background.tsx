import React from 'react';
import Image from 'next/image';

type Props = {version: 1 | 2};

export const Background: React.FC<Props> = ({version}) => {
  if (version === 1) {
    return (
      <Image
        src={'/assets/other/01.png'}
        alt='Sign In'
        width={0}
        height={0}
        priority={true}
        sizes='100vw'
        style={{
          width: '100%',
          height: '100%',
          zIndex: -1,
          position: 'absolute',
          objectFit: 'fill',
        }}
      />
    );
  }

  if (version === 2) {
    return (
      <Image
        src={'/assets/other/03.png'}
        alt='Sign In'
        width={0}
        height={0}
        sizes='100vw'
        priority={true}
        style={{
          width: '100%',
          height: '100%',
          zIndex: -1,
          position: 'absolute',
          objectFit: 'fill',
        }}
      />
    );
  }

  return null;
};
