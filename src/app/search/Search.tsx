'use client';

import Link from 'next/link';
import React, {useEffect, useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';


import {text} from '../../text';
import {items} from '../../items';
import {Routes} from '../../routes';
import {theme} from '../../constants';
import {URLS} from '../../config';
import {components} from '../../components';
import {course as elements} from '../../course';
import {LoadingSkeleton} from '../../components/LoadingSkeleton';

import type {CourseType} from '../../types';

const SearchSvg: React.FC = () => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={14} height={14} fill='none'>
      <path
        fill='#666'
        fillRule='evenodd'
        d='M6.417 2.188a4.23 4.23 0 1 0 0 8.458 4.23 4.23 0 0 0 0-8.459ZM1.313 6.417a5.104 5.104 0 1 1 10.208 0 5.104 5.104 0 0 1-10.209 0Z'
        clipRule='evenodd'
      />
      <path
        fill='#666'
        fillRule='evenodd'
        d='M9.3 9.3a.583.583 0 0 1 .825 0l2.537 2.537a.583.583 0 0 1-.825.825L9.3 10.125a.583.583 0 0 1 0-.825Z'
        clipRule='evenodd'
      />
    </svg>
  );
};

const months = [
  {value: '', label: 'All Months'},
  {value: '1', label: 'January'},
  {value: '2', label: 'February'},
  {value: '3', label: 'March'},
  {value: '4', label: 'April'},
  {value: '5', label: 'May'},
  {value: '6', label: 'June'},
  {value: '7', label: 'July'},
  {value: '8', label: 'August'},
  {value: '9', label: 'September'},
  {value: '10', label: 'October'},
  {value: '11', label: 'November'},
  {value: '12', label: 'December'},
];

export const Search: React.FC = () => {
  const [popularCourses, setPopularCourses] = useState<CourseType[]>([]);
  const [liveCourses, setLiveCourses] = useState<CourseType[]>([]);
  const [upcomingWorkshops, setUpcomingWorkshops] = useState<{name: string, id: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [searchResults, setSearchResults] = useState<CourseType[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.white;
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [popularRes, liveRes, upcomingRes] = await Promise.all([
        fetch('/api/workshops/popular?type=1'),
        fetch('/api/workshops/popular?type=0'),
        fetch('/api/workshops/upcoming')
      ]);

      const [popularData, liveData, upcomingData] = await Promise.all([
        popularRes.json(),
        liveRes.json(),
        upcomingRes.json()
      ]);

      if (popularData.success) {
        setPopularCourses(popularData.workshops.map((w: any) => ({
          ...w,
          image: `${URLS.IMAGE_URL}${w.image}`
        })));
      }

      if (liveData.success) {
        setLiveCourses(liveData.workshops.map((w: any) => ({
          ...w,
          image: `${w.image}`,
          trainer: {
            name: w.trainer_name,
            designation: w.trainer_designation,
            image: w.trainer_image,
            description: w.trainer_description,
          }
        })));
      }

      if (upcomingData.success) {
        setUpcomingWorkshops(upcomingData.workshops);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery && !selectedMonth) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (selectedMonth) params.append('month', selectedMonth);

      const response = await fetch(`/api/workshops/search?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        console.log('Search API response workshops:', data.workshops);
        setSearchResults(data.workshops.map((w: any) => ({
          ...w,
          image: `${w.image}`,
          trainer: {
            name: w.trainer_name,
            designation: w.trainer_designation,
            image: w.trainer_image,
            description: w.trainer_description,
          }
        })));
      } else {
        console.error('Failed to search workshops:', data.message);
      }
    } catch (error) {
      console.error('Error searching workshops:', error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedMonth]);

  const renderSearch = () => {
    return (
      <section className='container' style={{marginTop: 10, marginBottom: 30}}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            padding: 20,
            borderRadius: 10,
            border: `1px solid ${theme.colors.white}50`,
            backgroundColor: `${theme.colors.white}50`,
            boxShadow: '0px 4px 10px rgba(37, 73, 150, 0.05)',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexDirection: 'row',
              alignItems: 'center',
              padding: '0 16px',
              height: 42,
              borderRadius: 5,
              background: `linear-gradient(90deg, rgba(246, 189, 229, 0.5) 0%, rgba(174, 183, 248, 0.5) 100%)`,
            }}
          >
            <SearchSvg />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search workshops, trainers, or descriptions..."
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                ...theme.fonts.Lato,
                fontSize: 14,
                color: theme.colors.bodyTextColor,
              }}
            />
          </div>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{
              height: 42,
              borderRadius: 5,
              padding: '0 16px',
              border: `1px solid ${theme.colors.secondaryTextColor}`,
              background: theme.colors.white,
              ...theme.fonts.Lato,
              fontSize: 14,
              color: theme.colors.bodyTextColor,
            }}
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
      </section>
    );
  };

  const renderSearchResults = () => {
    if (!isSearching && !searchResults.length) return null;

    if (isSearching) {
      return <LoadingSkeleton />;
    }

    return (
      <section style={{marginBottom: 30}}>
        <div className='container'>
          <components.BlockHeading
            title='Search Results'
            containerStyle={{marginBottom: 7}}
          />
        </div>
        <ul style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          {searchResults.map((course, index, array) => {
            const isLast = index === array.length - 1;
            return (
              <elements.CourseCard
                key={course.id}
                course={course}
                isLast={isLast}
                section='top rated'
              />
            );
          })}
        </ul>
      </section>
    );
  };

  const renderBackground = () => {
    return <components.Background version={1} />;
  };

  const renderPopularCourses = () => {
    if (loading) return <LoadingSkeleton />;
    if (isSearching || searchResults.length > 0) return null;
    
    return (
      <section style={{marginBottom: 30}}>
        <div className='container'>
          <components.BlockHeading
            title='Recent Popular Workshops'
            containerStyle={{marginBottom: 7}}
          />
        </div>
        <Swiper
          spaceBetween={16}
          slidesPerView={'auto'}
          onSlideChange={() => {}}
          onSwiper={(swiper) => {}}
          style={{padding: '0 20px'}}
        >
          {popularCourses.map((course, index) => {
            return (
              <SwiperSlide key={index} style={{width: 'auto'}}>
                <items.NewCourseItem index={index} course={course} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </section>
    );
  };

  const renderLiveWorkshops = () => {
    if (loading) return <LoadingSkeleton />;
    if (!liveCourses.length || isSearching || searchResults.length > 0) return null;
    
    return (
      <section style={{paddingBottom: 30}}>
        <div className='container'>
          <components.BlockHeading
            title='Upcoming Most Subscribed Live Workshops'
            containerStyle={{marginBottom: 7}}
          />
        </div>

        <ul style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          {liveCourses.map((course, index, array) => {
            const isLast = index === array.length - 1;
            return (
              <elements.CourseCard
                key={course.id}
                course={course}
                isLast={isLast}
                section='top rated'
              />
            );
          })}
        </ul>
      </section>
    );
  };

  const renderOftenSearched = () => {
    if (loading || isSearching || searchResults.length > 0) return null;
    
    return (
      <section style={{marginBottom: 30}}>
        <div className='container'>
          <components.BlockHeading
            title='Often searched'
            containerStyle={{marginBottom: 7}}
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            padding: '0 20px',
          }}
        >
          {upcomingWorkshops.map((workshop, index) => (
            <Link
              key={workshop.id}
              href={Routes.COURSE_DETAILS.replace(':id', String(workshop.id))}
              style={{
                padding: '8px 16px',
                borderRadius: 5,
                backgroundColor: theme.colors.white,
                border: `1px solid ${theme.colors.secondaryTextColor}`,
              }}
            >
              <text.T12 style={{color: theme.colors.secondaryTextColor}}>
                {workshop.name}
              </text.T12>
            </Link>
          ))}
        </div>
      </section>
    );
  };

  const renderContent = () => {
    return (
      <main className='scrollable'>
        {renderSearch()}
        {renderSearchResults()}
        {renderPopularCourses()}
        {renderLiveWorkshops()}
        {renderOftenSearched()}
      </main>
    );
  };

  const renderBottomTabBar = () => {
    return <components.BottomTabBar />;
  };

  return (
    <components.Screen>
      {renderBackground()}
      {renderContent()}
      {renderBottomTabBar()}
    </components.Screen>
  );
};
