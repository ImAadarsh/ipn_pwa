'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';

import {text} from '../../text';
import {Routes} from '../../routes';
import {theme} from '../../constants';
import {components} from '../../components';
import {course as elements} from '../../course';
import {WorkshopListSkeleton} from '../../components/WorkshopListSkeleton';

interface Workshop {
  id: number;
  name: string;
  image: string;
  start_date: string;
  duration: string;
  price: number;
  price_2: number;
  cut_price: number | null;
  description: string;
  trainer_name: string;
  trainer_designation: string;
  trainer_image: string;
  trainer_description: string;
  subscription_count: number;
}

export default function PopularWorkshops() {
  const router = useRouter();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/sign-in');
      return;
    }
    fetchWorkshops();
  }, [router]);

  const fetchWorkshops = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/workshops/popular');
      const data = await response.json();
      
      if (data.success) {
        setWorkshops(data.workshops);
      } else {
        console.error('Failed to fetch popular workshops:', data.message);
      }
    } catch (error) {
      console.error('Error fetching popular workshops:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return null;
  }

  const renderContent = () => {
    if (isLoading) {
      return <WorkshopListSkeleton />;
    }

    if (!workshops.length) {
      return (
        <main className='scrollable container' style={{paddingTop: 20, paddingBottom: 20}}>
          <div className="text-center p-4 text-gray-500">
            No popular workshops available
          </div>
        </main>
      );
    }

    return (
      <main className='scrollable'>
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
            <text.H2 style={{marginBottom: 12}}>Popular Workshops</text.H2>
            <div
              style={{
                width: '100%',
                height: 42,
                borderRadius: 5,
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                background: `linear-gradient(90deg, rgba(246, 189, 229, 0.5) 0%, rgba(174, 183, 248, 0.5) 100%)`,
              }}
            >
              <text.T14 style={{color: theme.colors.bodyTextColor}}>
                {workshops.length} workshops available
              </text.T14>
            </div>
          </div>
        </section>

        <section style={{paddingBottom: 30}}>
          <ul style={{display: 'flex', flexDirection: 'column', gap: 10}}>
            {workshops.map((workshop, index, array) => {
              const isLast = index === array.length - 1;
              const courseData = {
                id: workshop.id,
                name: workshop.name,
                image: workshop.image,
                start_date: workshop.start_date,
                duration: workshop.duration,
                price: workshop.price,
                price_2: workshop.price_2,
                cut_price: workshop.cut_price,
                description: workshop.description,
                trainer: {
                  name: workshop.trainer_name,
                  designation: workshop.trainer_designation,
                  image: workshop.trainer_image,
                  description: workshop.trainer_description
                }
              };
              return (
                <elements.CourseCard
                  key={workshop.id}
                  course={courseData}
                  isLast={isLast}
                  section='top rated'
                />
              );
            })}
          </ul>
        </section>
      </main>
    );
  };

  return (
    <components.Screen>
      <components.Header title="Popular Workshops" showGoBack={true} />
      {renderContent()}
      <components.BottomTabBar />
    </components.Screen>
  );
} 