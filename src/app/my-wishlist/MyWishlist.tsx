'use client';

import React from 'react';

import {text} from '../../text';
import {items} from '../../items';
import {stores} from '../../stores';
import {components} from '../../components';

export const MyWishlist: React.FC = () => {
  const {list: wishlist} = stores.useWishlistStore();

  const renderBackground = () => {
    return <components.Background version={1} />;
  };

  const renderHeader = () => {
    return <components.Header title='My Wishlist' showGoBack={true} />;
  };

  const renderContent = () => {
    if (!wishlist.length) {
      return (
        <main style={{paddingBottom: 0}}>
          <text.T18 style={{textAlign: 'center', marginTop: '60%'}}>
            Your wishlist is empty
          </text.T18>
        </main>
      );
    }

    return (
      <main style={{paddingBottom: 0}}>
        <div style={{marginTop: 10}}>
          {wishlist.map((course, index) => {
            return <items.WishlistItem key={index} course={course} />;
          })}
        </div>
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
