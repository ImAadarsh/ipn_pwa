'use client';

import React from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

import {svg} from '../svg';
import {text} from '../text';
import {Routes} from '../routes';
import {theme} from '../constants';
import type {CourseType} from '../types';
import {course as elements} from '../course';

type Props = {
  title?: string;
  search?: boolean;
  course?: CourseType;
  document?: boolean;
  showSkip?: boolean;
  showFilter?: boolean;
  creditCard?: boolean;
  showGoBack?: boolean;
  showClearText?: boolean;
  showAddToWishlist?: boolean;
  clearTextOnClick?: () => void;
  containerStyle?: React.CSSProperties;
};

export const Header: React.FC<Props> = ({
  showGoBack,
  title,
  search,
  course,
  showSkip,
  showFilter,
  showClearText,
  containerStyle,
  clearTextOnClick,
  showAddToWishlist,
}) => {
  const router = useRouter();

  const renderGoBack = () => {
    if (!showGoBack) return null;
    return (
      <button
        onClick={() => router.back()}
        style={{left: '0px', padding: '8px 20px', position: 'absolute'}}
      >
        <svg.GoBackSvg />
      </button>
    );
  };

  const renderTitle = () => {
    return (
      <div
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <text.H3 style={{textTransform: 'capitalize'}}>{title}</text.H3>
      </div>
    );
  };

  const renderSearch = () => {
    if (!search) return null;
    return (
      <button
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <svg.SearchSvg />
      </button>
    );
  };

  const renderSkip = () => {
    if (!showSkip) return null;

    return (
      <Link
        style={{
          height: '100%',
          width: 'auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          position: 'absolute',
          right: 0,
        }}
        href={Routes.SIGN_IN}
      >
        <span
          style={{
            ...theme.fonts.Lato,
            fontSize: 14,
            color: theme.colors.mainColor,
          }}
        >
          Skip
        </span>
      </Link>
    );
  };

  const renderClearText = () => {
    if (!showClearText) return null;
    return (
      <button
        style={{
          height: '100%',
          width: 'auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          position: 'absolute',
          right: 0,
        }}
        onClick={clearTextOnClick}
      >
        <span
          style={{
            ...theme.fonts.Lato,
            fontSize: 14,
            color: theme.colors.mainColor,
          }}
        >
          Clear
        </span>
      </button>
    );
  };

  const renderFilter = () => {
    if (!showFilter) return null;
    return (
      <Link
        style={{
          height: '100%',
          width: 'auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          position: 'absolute',
          right: 0,
        }}
        href={Routes.FILTER}
      >
        <svg.FilterSvg />
      </Link>
    );
  };

  const renderHeart = () => {
    if (!showAddToWishlist || !course) {
      return null;
    }
    return (
      <elements.CourseInWishlist
        course={course}
        size={20}
        style={{
          height: '100%',
          width: 'auto',
          padding: '0 0 0 20px',
          display: 'flex',
          alignItems: 'center',
          position: 'absolute',
          right: 0,
        }}
      />
    );
  };

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'relative',
        height: 'var(--header-height)',
        ...containerStyle,
      }}
    >
      {renderGoBack()}
      {renderTitle()}
      {renderSearch()}
      {renderSkip()}
      {renderFilter()}
      {renderClearText()}
      {renderHeart()}
    </header>
  );
};
