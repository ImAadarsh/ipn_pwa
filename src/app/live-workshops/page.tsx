'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';

import {text} from '../../text';
import {Routes} from '../../routes';
import {theme} from '../../constants';
import {components} from '../../components';
import {course as elements} from '../../course';

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
}

export default function LiveWorkshops() {
  const router = useRouter();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/sign-in');
      return;
    }
    fetchWorkshops();
  }, [router]);

  const fetchWorkshops = async () => {
    try {
      const response = await fetch('/api/workshops/live');
      const data = await response.json();
      
      if (data.success) {
        setWorkshops(data.workshops);
      } else {
        console.error('Failed to fetch live workshops:', data.message);
      }
    } catch (error) {
      console.error('Error fetching live workshops:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <main className='scrollable container' style={{paddingTop: 20, paddingBottom: 20}}>
          <div className="flex justify-center items-center min-h-[200px]">
            Loading...
          </div>
        </main>
      );
    }

    if (!workshops.length) {
      return (
        <main className='scrollable container' style={{paddingTop: 20, paddingBottom: 20}}>
          <div className="text-center p-4 text-gray-500">
            No live workshops available
          </div>
        </main>
      );
    }

    return (
      <main className='scrollable'>
        <section style={{paddingBottom: 30}}>
          <div className='container'>
            <components.BlockHeading
              title='Live Workshops'
              containerStyle={{marginBottom: 7}}
            />
          </div>

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
      <components.Header title="Live Workshops" showGoBack={true} />
      {renderContent()}
      <components.BottomTabBar />
    </components.Screen>
  );
} 