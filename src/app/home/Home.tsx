'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, {useEffect, useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {useRouter} from 'next/navigation';
import {Autoplay, Pagination} from 'swiper/modules';
import 'swiper/css';
// import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { FaChalkboardTeacher, FaBook, FaGraduationCap, FaUsers, FaLaptop, FaLightbulb, FaBrain, FaChartLine, FaHandshake, FaGlobe } from 'react-icons/fa';

import {svg} from '../../svg';
import {text} from '../../text';
import {URLS} from '../../config';
import {items} from '../../items';
import {Routes} from '../../routes';
import {theme} from '../../constants';
import {components} from '../../components';
import {LoadingSkeleton} from '../../components/LoadingSkeleton';

import type {CourseType} from '../../types';
import type {CategoryType} from '../../types';
import {course as elements} from '../../course';

type Props = {
  courses: CourseType[];
  categories: CategoryType[];
};

interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  profile: string;
  token: string;
}

interface Slider {
  id: number;
  image: string;
  link: string;
  button_text: string;
}

interface Category {
  id: number;
  name?: string;
  image?: string;
  quantity?: string;
  audience?: string[];
  workshop_count?: number;
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
}


const categoryGradients = [
  `linear-gradient(45deg, ${theme.colors.mainColor}, ${theme.colors.accentColor})`,
  `linear-gradient(45deg, ${theme.colors.persianRose}, ${theme.colors.mainOrange})`,
  `linear-gradient(45deg, ${theme.colors.coralRed}, ${theme.colors.mainColor})`,
  `linear-gradient(45deg, ${theme.colors.mainOrange}, ${theme.colors.persianRose})`,
  `linear-gradient(45deg, ${theme.colors.accentColor}, ${theme.colors.coralRed})`,
];

export const Home: React.FC<Props> = ({courses, categories: initialCategories}) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [categories, setCategories] = useState<Category[]>(initialCategories || []);
  const [liveWorkshops, setLiveWorkshops] = useState<Workshop[]>([]);
  const [popularWorkshops, setPopularWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/sign-in');
      return;
    }
    setUser(JSON.parse(userData));
    document.body.style.backgroundColor = theme.colors.white;
    fetchSliders();
    fetchCategories();
    fetchLiveWorkshops();
    fetchPopularWorkshops();
  }, [router]);

  const fetchSliders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/sliders/list');
      const data = await response.json();
      if (data.success) {
        setSliders(data.sliders);
      }
    } catch (error) {
      console.error('Error fetching sliders:', error);
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories/list');
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchLiveWorkshops = async () => {
    try {
      const response = await fetch('/api/workshops/live?limit=6');
      const data = await response.json();
      
      if (data.success) {
        setLiveWorkshops(data.workshops);
      } else {
        console.error('Failed to fetch live workshops:', data.message);
      }
    } catch (error) {
      console.error('Error fetching live workshops:', error);
    }
  };

  const fetchPopularWorkshops = async () => {
    try {
      const response = await fetch('/api/workshops/popular?limit=6');
      const data = await response.json();
      
      if (data.success) {
        setPopularWorkshops(data.workshops);
      } else {
        console.error('Failed to fetch popular workshops:', data.message);
      }
    } catch (error) {
      console.error('Error fetching popular workshops:', error);
    }
  };

  const handleSliderClick = (link: string) => {
    const workshopId = link.split('id=')[1];
    if (workshopId) {
      router.push(`/workshop-detail/${workshopId}`);
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    router.push(`/category-list/${categoryId}`);
  };

  const [activeSlide, setActiveSlide] = useState(0);

  const handleSlideChange = (swiper: any) => {
    setActiveSlide(swiper.activeIndex);
  };

  const renderSearchBar = () => {
    if (!user) return null;
    
    return (
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 4,
            }}
          >
            <Image
              alt='User'
              width={24}
              height={24}
              sizes='100vw'
              priority={true}
              style={{borderRadius: '50px'}}
              src={user.profile ? `${URLS.IMAGE_URL}${user.profile}` : `${URLS.IMAGE_URL}/public/img/workshop/oqDdQPGw3UZnIlmNZojNfTvHHVA9KHjO1OqDHJE6.png`}
            />
            <text.H2 style={{lineHeight: 1.2, marginTop: 4}}>
              Hello, {user.name}
            </text.H2>
          </div>
          <span
            style={{
              ...theme.fonts.Lato,
              fontSize: 14,
              fontWeight: 400,
              marginBottom: 12,
              color: theme.colors.bodyTextColor,
            }}
          >
            Find a workshop you want to enroll.
          </span>
          <Link
            href={Routes.SEARCH}
            style={{
              width: '100%',
              height: 42,
              borderRadius: 5,
              display: 'flex',
              gap: 8,
              flexDirection: 'row',
              alignItems: 'center',
              padding: '0 16px',
              backgroundColor: theme.colors.white,
              border: `1px solid ${theme.colors.white}50`,
              boxShadow: '0px 4px 10px rgba(37, 73, 150, 0.05)',
              textDecoration: 'none',
            }}
          >
            <svg.SearchSvg />
            <text.T14 style={{color: theme.colors.secondaryTextColor}}>
              Search workshops
            </text.T14>
          </Link>
        </div>
      </section>
    );
  };

  const renderBackground = () => {
    return <components.Background version={1} />;
  };

  const renderCarousel = () => {
    if (loading) return null;
    
    return (
      <section style={{marginBottom: 10}}>
        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={'auto'}
          pagination={{clickable: true}}
          mousewheel={false}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
          style={{marginBottom: 2}}
          onSlideChange={handleSlideChange}
        >
          {sliders.map((slider, index) => {
            return (
              <SwiperSlide key={slider.id} style={{padding: '0 20px'}}>
                <div 
                  onClick={() => handleSliderClick(slider.link)}
                  className='clickable'
                >
                  <Image
                    src={`${URLS.IMAGE_URL}${slider.image}`}
                    alt={slider.button_text}
                    width={0}
                    height={0}
                    sizes='100vw'
                    priority={true}
                    style={{width: '100%', height: 'auto', borderRadius: 7}}
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
          }}
        >
          {sliders.map((_, index) => {
            return (
              <div
                key={_.id}
                style={{
                  width: activeSlide === index ? 25 : 10,
                  height: 2,
                  borderRadius: 10,
                  backgroundColor:
                    activeSlide === index
                      ? theme.colors.mainColor
                      : theme.colors.secondaryTextColor,
                }}
              />
            );
          })}
        </div>
      </section>
    );
  };

  const renderCategories = () => {
    if (!categories.length) return null;
    
    // Map of category names to icons
    const categoryIcons: { [key: string]: React.ReactNode } = {
      'Early Childhood Education': <FaGraduationCap size={24} color="rgba(255, 255, 255, 1)" />,
      'Primary Education': <FaBook size={24} color="rgba(255, 255, 255, 0.9)" />,
      'Secondary Education': <FaChalkboardTeacher size={24} color="rgba(255, 255, 255, 0.9)" />,
      'Higher Education': <FaUsers size={24} color="rgba(255, 255, 255, 0.9)" />,
      'How to use AI in Classrooms': <FaLightbulb size={24} color="rgba(255, 255, 255, 0.9)" />,
      'Training': <FaChalkboardTeacher size={24} color="rgba(255, 255, 255, 0.9)" />,
      'Cybersecurity': <FaLaptop size={24} color="rgba(255, 255, 255, 0.9)" />,
      'NEP 2020': <FaBook size={24} color="rgba(255, 255, 255, 0.9)" />,
      'National Curriculum Framework 2022': <FaChartLine size={24} color="rgba(255, 255, 255, 0.9)" />,
      'Student Support': <FaUsers size={24} color="rgba(255, 255, 255, 0.9)" />,
      'Assessment & Evaluation': <FaBrain size={24} color="rgba(255, 255, 255, 0.9)" />,
      'Educational Research': <FaGraduationCap size={24} color="rgba(255, 255, 255, 0.9)" />,
      'Inclusive Education': <FaHandshake size={24} color="rgba(255, 255, 255, 0.9)" />,
      'Global Education': <FaGlobe size={24} color="rgba(255, 255, 255, 0.9)" />,
    };
    
    return (
      <section style={{marginBottom: 30}}>
        <div className='container'>
          <components.BlockHeading
            title='Workshop Categories'
            containerStyle={{marginBottom: 7}}
          />
        </div>
        <Swiper
          spaceBetween={10}
          slidesPerView={'auto'}
          onSlideChange={() => {}}
          onSwiper={(swiper) => {}}
          style={{padding: '0 20px'}}
        >
          {categories.map((category, index) => {
            const gradientIndex = index % categoryGradients.length;
            const categoryName = category.name || 'Unnamed Category';
            const Icon = categoryIcons[categoryName] || <FaChalkboardTeacher size={24} color="#ffccab" />;
            
            return (
              <SwiperSlide key={category.id} style={{width: 'auto'}}>
                <div
                  onClick={() => handleCategoryClick(category.id)}
                  style={{
                    height: 89,
                    display: 'flex',
                    padding: '8px 20px',
                    borderRadius: 10,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundImage: categoryGradients[gradientIndex],
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  className='clickable'
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
                  <div style={{zIndex: 1, display: 'flex', flexDirection: 'column', gap: 8}}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {Icon}
                      <span
                        style={{
                          fontSize: 14,
                          ...theme.fonts.Lato,
                          fontWeight: 700,
                          lineHeight: 1.5,
                          color: theme.colors.white,
                          display: 'block',
                        }}
                      >
                        {categoryName}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        ...theme.fonts.Lato,
                        color: theme.colors.white,
                        opacity: 0.8,
                      }}
                    >
                      {category.workshop_count || 0} Workshops
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div style={{padding: '0 20px', marginTop: 15}}>
          <Link
            href={Routes.CATEGORY_GRID}
            style={{
              display: 'block',
              width: '100%',
              padding: '12px 0',
              textAlign: 'center',
              borderRadius: 10,
              backgroundColor: theme.colors.mainColor,
              color: theme.colors.white,
              ...theme.fonts.Lato_700Bold,
              fontSize: 14,
            }}
          >
            View All Categories
          </Link>
        </div>
      </section>
    );
  };

  const renderTopRated = () => {
    if (!liveWorkshops.length) return null;
    return (
      <section style={{paddingBottom: 30}}>
        <div className='container'>
          <components.BlockHeading
            title={
              <span style={{display: 'flex', alignItems: 'center'}}>
                Live Workshops
                <span
                  style={{
                    marginLeft: 5,
                    width: 8,
                    height: 8,
                    backgroundColor: 'red',
                    borderRadius: '50%',
                    animation: 'blink 1s infinite',
                  }}
                />
              </span>
            }
            containerStyle={{marginBottom: 7}}
          />
        </div>

        <ul style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          {liveWorkshops.map((workshop, index, array) => {
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
        <div style={{padding: '0 20px', marginTop: 15}}>
          <Link
            href="/live-workshops"
            style={{
              display: 'block',
              width: '100%',
              padding: '12px 0',
              textAlign: 'center',
              borderRadius: 10,
              backgroundColor: theme.colors.mainColor,
              color: theme.colors.white,
              ...theme.fonts.Lato_700Bold,
              fontSize: 14,
            }}
          >
            View All Workshops
          </Link>
        </div>
      </section>
    );
  };

  const renderPopular = () => {
    if (!popularWorkshops.length) return null;
    
    return (
      <section style={{paddingBottom: 30}}>
        <div className='container'>
          <components.BlockHeading
            title='Popular Workshops'
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
          {popularWorkshops.map((workshop, index) => {
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
              <SwiperSlide key={workshop.id} style={{width: 'auto'}}>
                <items.PopularItem course={courseData} />
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div style={{padding: '0 20px', marginTop: 15}}>
          <Link
            href="/popular-workshops"
            style={{
              display: 'block',
              width: '100%',
              padding: '12px 0',
              textAlign: 'center',
              borderRadius: 10,
              backgroundColor: theme.colors.mainColor,
              color: theme.colors.white,
              ...theme.fonts.Lato_700Bold,
              fontSize: 14,
            }}
          >
            View All Popular Workshops
          </Link>
        </div>
      </section>
    );
  };

  const renderBetterTogether = () => {
    return (
      <section style={{paddingBottom: 30}}>
        <div className='container'>
          <components.BlockHeading
            title='Better Together'
            containerStyle={{marginBottom: 7}}
          />
        </div>
        <div style={{padding: '0 20px'}}>
          <Link
            href="/better-together"
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '20px',
              borderRadius: 10,
              background: 'linear-gradient(45deg, #3b82f6 0%, #60a5fa 100%)',
              color: theme.colors.white,
              textDecoration: 'none',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'url("/assets/images/07.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: 0.2,
                zIndex: 0,
              }}
            />
            <div style={{zIndex: 1}}>
              <text.H2 style={{color: theme.colors.white, marginBottom: 8}}>
                Your Global Community
              </text.H2>
              <text.T14 style={{color: theme.colors.white, opacity: 0.9, marginBottom: 16}}>
                Discover how we're transforming education together
              </text.T14>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                ...theme.fonts.Lato_700Bold,
                fontSize: 14,
              }}>
                Learn More
                <svg.RightArrowSvg />
              </div>
            </div>
          </Link>
        </div>
      </section>
    );
  };

  const renderBottomTabBar = () => {
    return <components.BottomTabBar />;
  };

  const renderContent = () => {
    return (
      <main className='scrollable'>
        {renderSearchBar()}
        {renderCarousel()}
        {renderCategories()}
        {renderTopRated()}
        {renderBetterTogether()}
        {renderPopular()}
      </main>
    );
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <components.Screen>
      {renderBackground()}
      {renderContent()}
      {renderBottomTabBar()}
    </components.Screen>
  );
};
