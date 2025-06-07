'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';

import {utils} from '../../utils';
import {theme} from '../../constants';
import {components} from '../../components';
import {course as elements} from '../../course';
import {Routes} from '../../routes';
import {LoadingSkeleton} from '../../components/LoadingSkeleton';

interface User {
  id: number;
  name: string | null;
  email: string | null;
  mobile: string;
  profile: string;
  designation: string | null;
  institute_name: string | null;
  city: string | null;
  user_type: string;
  membership: number;
  school_id: number | null;
  sessionToken: string;
}

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
  type: number;
  order_id?: string;
  link?: string;
  meeting_id?: string;
  passcode?: string;
  trainer: {
    name: string;
    designation: string;
    image: string;
    description: string;
  };
}

export const MyCourses: React.FC = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('ongoing');
  const [user, setUser] = useState<User | null>(null);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.white;

    // Load user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push(Routes.SIGN_IN);
      return;
    }

    const userData: User = JSON.parse(storedUser);
    setUser(userData);
    fetchUserWorkshops(userData.id);
  }, [router]);

  const fetchUserWorkshops = async (userId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/workshops?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        // Transform the data to include trainer object
        const transformedWorkshops = data.workshops.map((workshop: any) => ({
          ...workshop,
          trainer: {
            name: workshop.trainer_name,
            designation: workshop.trainer_designation,
            image: workshop.trainer_image,
            description: workshop.trainer_description
          }
        }));
        setWorkshops(transformedWorkshops);
      } else {
        throw new Error(data.message || 'Failed to fetch workshops');
      }
    } catch (error) {
      console.error('Error fetching workshops:', error);
    } finally {
      // Add a small delay to ensure loading skeleton is visible
      setTimeout(() => {
        setLoading(false);
      }, 500); // 500ms delay
    }
  };

  const renderImageBackground = () => {
    return <components.Background version={1} />;
  };

  const renderHeader = () => {
    return <components.Header title='My Workshops' />;
  };

  const renderTabs = () => {
    return (
      <div style={{marginTop: 8, ...utils.rowCenter(), marginBottom: 20}}>
        {['ongoing', 'completed'].map((tab) => {
          return (
            <button
              key={tab}
              style={{
                width: '50%',
                padding: '8px 20px',
                textTransform: 'capitalize',
                lineHeight: 1.7,
                textAlign: 'center',
                ...theme.fonts.Lato,
                fontWeight: tab === selectedTab ? 700 : 400,
                fontSize: 14,
                color:
                  tab === selectedTab
                    ? theme.colors.mainColor
                    : theme.colors.secondaryTextColor,
                borderBottom:
                  tab === selectedTab
                    ? '1px solid #111111'
                    : '1px solid #E7E6E7',
              }}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          );
        })}
      </div>
    );
  };

  const renderCourses = () => {
    if (loading) {
      return <LoadingSkeleton />;
    }

    const filteredWorkshops = workshops.filter(workshop => 
      selectedTab === 'ongoing' ? workshop.type === 0 : workshop.type === 1
    ).sort((a, b) => {
      const dateA = new Date(a.start_date).getTime();
      const dateB = new Date(b.start_date).getTime();

      if (selectedTab === 'ongoing') {
        return dateA - dateB; // Ascending for ongoing (earliest first)
      } else {
        return dateB - dateA; // Descending for completed (most recent first)
      }
    });

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '5px',
          marginBottom: 20,
        }}
      >
        {filteredWorkshops.map((workshop) => (
          <div key={`${workshop.id}-${workshop.order_id}`} style={{width: '100%'}}>
            <elements.CourseCard
              course={workshop}
              section='my courses'
              status={selectedTab as 'ongoing' | 'completed'}
              orderId={selectedTab === 'completed' ? workshop.order_id : undefined}
              workshopId={workshop.id}
              startDate={workshop.start_date}
              meetingId={workshop.meeting_id}
              passcode={workshop.passcode}
              userId={user?.id}
              userName={user?.name ?? undefined}
              userEmail={user?.email ?? undefined}
            />
          </div>
        ))}
      </div>
    );
  };

  const renderBottomTabBar = () => {
    return <components.BottomTabBar />;
  };

  const renderContent = () => {
    return (
      <main
        className='container scrollable'
        style={{
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        {renderTabs()}
        {renderCourses()}
      </main>
    );
  };

  return (
    <components.Screen>
      {renderImageBackground()}
      {renderHeader()}
      {renderContent()}
      {renderBottomTabBar()}
    </components.Screen>
  );
};
