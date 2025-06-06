'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import {text} from '../../text';
import {Routes} from '../../routes';
import {theme} from '../../constants';
import {components} from '../../components';

import type {CategoryType} from '../../types';

type Props = {
  categories: CategoryType[];
};

export const CategoryGrid: React.FC<Props> = ({categories}) => {
  const renderBackground = () => {
    return <components.Background version={1} />;
  };

  const renderHeader = () => {
    return <components.Header title='Categories' showGoBack={true} />;
  };

  const renderContent = () => {
    const blockStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: 260,
      cursor: 'pointer',
      userSelect: 'none',
      padding: '30px 10px',
      position: 'relative',
    };

    return (
      <main style={{paddingBottom: 0}} className='scrollable'>
        <div
          className='container'
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 15,
            marginTop: 10,
            marginBottom: 20,
          }}
        >
          <div style={{width: 'calc(50% - 7.5px)'}}>
            {categories.slice(0, 3).map((category: any, index, array) => {
              const isLast = index === array.length - 1;
              return (
                <Link
                  key={category.id}
                  href={Routes.CATEGORY_LIST.replace(':id', category.id)}
                  style={{...blockStyle, marginBottom: isLast ? 0 : 15}}
                >
                  <Image
                    width={0}
                    height={0}
                    sizes='100vw'
                    priority={true}
                    src={category.image}
                    alt={category.name}
                    style={{
                      height: '100%',
                      width: '100%',
                      objectFit: 'cover',
                      borderRadius: 10,
                      position: 'absolute',
                      inset: 0,
                      zIndex: -1,
                    }}
                  />
                  <text.H2
                    style={{
                      color: theme.colors.white,
                      textTransform: 'capitalize',
                    }}
                  >
                    {category.name}
                  </text.H2>
                  <text.T14
                    style={{
                      color: theme.colors.white,
                      ...theme.fonts.Lato_700Bold,
                    }}
                  >
                    {category.quantity} Courses
                  </text.T14>
                </Link>
              );
            })}
          </div>
          <div style={{width: 'calc(50% - 7.5px)'}}>
            {categories
              .slice(3, 6)
              .map((category: CategoryType, index, array) => {
                const isLast = index === array.length - 1;
                return (
                  <Link
                    href={Routes.CATEGORY_LIST.replace(
                      ':id',
                      String(category.id)
                    )}
                    key={category.id}
                    style={{
                      ...blockStyle,
                      height: 210,
                      marginBottom: isLast ? 0 : 15,
                    }}
                  >
                    <Image
                      width={0}
                      height={0}
                      priority={true}
                      src={category.image}
                      alt={'Category'}
                      style={{
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover',
                        borderRadius: 10,
                        position: 'absolute',
                        inset: 0,
                        zIndex: -1,
                      }}
                    />
                    <text.H2
                      style={{
                        color: theme.colors.white,
                        textTransform: 'capitalize',
                      }}
                    >
                      {category.name}
                    </text.H2>
                    <text.T14
                      style={{
                        color: theme.colors.white,
                        ...theme.fonts.Lato_700Bold,
                      }}
                    >
                      {category.quantity} Courses
                    </text.T14>
                  </Link>
                );
              })}
          </div>
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
