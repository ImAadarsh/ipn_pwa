'use client';

import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';

import {text} from '../../text';
import {Routes} from '../../routes';
import {theme} from '../../constants';
import {components} from '../../components';

import type {CategoryType} from '../../types';

interface Category {
  id: number;
  name?: string;
  workshop_count?: number;
}

const categoryGradients = [
  `linear-gradient(45deg, ${theme.colors.mainColor}, ${theme.colors.accentColor})`,
  `linear-gradient(45deg, ${theme.colors.persianRose}, ${theme.colors.mainOrange})`,
  `linear-gradient(45deg, ${theme.colors.coralRed}, ${theme.colors.mainColor})`,
  `linear-gradient(45deg, ${theme.colors.mainOrange}, ${theme.colors.persianRose})`,
  `linear-gradient(45deg, ${theme.colors.accentColor}, ${theme.colors.coralRed})`,
];

export const CategoryGrid: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories/list');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.categories);
      } else {
        console.error('Failed to fetch categories:', data.message);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBackground = () => {
    return <components.Background version={1} />;
  };

  const renderHeader = () => {
    return <components.Header title='Categories' showGoBack={true} />;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{padding: 20, textAlign: 'center'}}>
          <text.T14>Loading categories...</text.T14>
        </div>
      );
    }

    if (!categories.length) {
      return (
        <div style={{padding: 20, textAlign: 'center'}}>
          <text.T14>No categories found</text.T14>
        </div>
      );
    }

    const blockStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: 260,
      cursor: 'pointer',
      userSelect: 'none',
      padding: '30px 10px',
      position: 'relative',
      borderRadius: 10,
      overflow: 'hidden',
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
            {categories.slice(0, 3).map((category, index, array) => {
              const isLast = index === array.length - 1;
              const gradientIndex = index % categoryGradients.length;
              return (
                <Link
                  key={category.id}
                  href={Routes.CATEGORY_LIST.replace(':id', String(category.id))}
                  style={{
                    ...blockStyle,
                    marginBottom: isLast ? 0 : 15,
                    backgroundImage: categoryGradients[gradientIndex],
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: 'url("https://ipnacademy.in/new_assets/img/ipn/ipn.png")',
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      opacity: 0.05,
                      zIndex: 0,
                    }}
                  />
                  <text.H2
                    style={{
                      color: theme.colors.white,
                      textTransform: 'capitalize',
                      zIndex: 1,
                    }}
                  >
                    {category.name || 'Unnamed Category'}
                  </text.H2>
                  <text.T14
                    style={{
                      color: theme.colors.white,
                      ...theme.fonts.Lato_700Bold,
                      zIndex: 1,
                    }}
                  >
                    {category.workshop_count || 0} Workshops
                  </text.T14>
                </Link>
              );
            })}
          </div>
          <div style={{width: 'calc(50% - 7.5px)'}}>
            {categories
              .slice(3, 6)
              .map((category, index, array) => {
                const isLast = index === array.length - 1;
                const gradientIndex = (index + 3) % categoryGradients.length;
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
                      backgroundImage: categoryGradients[gradientIndex],
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: 'url("https://ipnacademy.in/new_assets/img/ipn/ipn.png")',
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        opacity: 0.05,
                        zIndex: 0,
                      }}
                    />
                    <text.H2
                      style={{
                        color: theme.colors.white,
                        textTransform: 'capitalize',
                        zIndex: 1,
                      }}
                    >
                      {category.name || 'Unnamed Category'}
                    </text.H2>
                    <text.T14
                      style={{
                        color: theme.colors.white,
                        ...theme.fonts.Lato_700Bold,
                        zIndex: 1,
                      }}
                    >
                      {category.workshop_count || 0} Workshops
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
