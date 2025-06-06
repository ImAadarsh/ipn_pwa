'use client';

import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import {useRouter} from 'next/navigation';

import {text} from '../../../text';
import {Routes} from '../../../routes';
import {theme} from '../../../constants';
import {URLS} from '../../../config';
import {components} from '../../../components';
import {course as elements} from '../../../course';
import {utils} from '../../../utils';
import {svg} from '../../../svg';

interface Feedback {
  id: number;
  rating: number;
  comment: string;
  user_name: string;
  user_image: string;
  created_at: string;
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
  total_subscribers: number;
  average_rating: number;
  total_reviews: number;
}

interface Props {
  id: string;
}

export const CourseDetails: React.FC<Props> = ({id}) => {
  const router = useRouter();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkshopDetails();
  }, [id]);

  const fetchWorkshopDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/workshops/${id}`);
      const data = await response.json();
      
      if (response.ok) {
        setWorkshop(data.workshop);
        setFeedback(data.feedback);
      } else {
        setError(data.error || 'Failed to fetch workshop details');
        setWorkshop(null);
        setFeedback([]);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again later.');
      setWorkshop(null);
      setFeedback([]);
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

    if (!workshop) {
      return (
        <main className='scrollable container' style={{paddingTop: 20, paddingBottom: 20}}>
          <div className="text-center p-4 text-gray-500">
            Workshop not found
          </div>
        </main>
      );
    }

    return (
      <main className='scrollable'>
        <section style={{paddingBottom: 30}}>
          {/* Workshop Image */}
          <div style={{position: 'relative', width: '100%', height: 250}}>
            <Image
              width={0}
              height={0}
              sizes='100vw'
              priority={true}
              src={`${URLS.IMAGE_URL}${workshop.image}`}
              alt={workshop.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* Workshop Info */}
          <div className='container' style={{paddingTop: 20}}>
            <text.H1 style={{marginBottom: 10}}>{workshop.name}</text.H1>
            
            <div style={{...utils.rowCenterSpcBtw(), marginBottom: 20}}>
              <div style={{...utils.rowCenter()}}>
                <svg.ClockSvg />
                <text.T14 style={{marginLeft: 6}}>{workshop.duration}</text.T14>
              </div>
              <div style={{...utils.rowCenter()}}>
                <svg.UserSvg />
                <text.T14 style={{marginLeft: 6}}>{workshop.total_subscribers} Subscribers</text.T14>
              </div>
            </div>

            {/* Price Section */}
            <div style={{...utils.rowCenterSpcBtw(), marginBottom: 20}}>
              <div>
                <text.T16 style={{...theme.fonts.Lato_700Bold}}>
                  ₹{workshop.price.toFixed(2)}
                </text.T16>
                {workshop.cut_price && (
                  <text.T14 style={{color: theme.colors.secondaryTextColor, textDecoration: 'line-through', marginLeft: 8}}>
                    ₹{workshop.cut_price.toFixed(2)}
                  </text.T14>
                )}
              </div>
              <button
                onClick={() => router.push(Routes.CHECKOUT.replace(':id', String(workshop.id)))}
                style={{
                  padding: '12px 24px',
                  borderRadius: 10,
                  backgroundColor: theme.colors.mainColor,
                  color: theme.colors.white,
                  ...theme.fonts.Lato_700Bold,
                  fontSize: 14,
                }}
              >
                Enroll Now
              </button>
            </div>

            {/* Description */}
            <div style={{marginBottom: 30}}>
              <text.T16 style={{...theme.fonts.Lato_700Bold, marginBottom: 10}}>
                About Workshop
              </text.T16>
              <text.T14 style={{color: theme.colors.secondaryTextColor, lineHeight: 1.5}}>
                {workshop.description}
              </text.T14>
            </div>

            {/* Trainer Info */}
            <div style={{marginBottom: 30}}>
              <text.T16 style={{...theme.fonts.Lato_700Bold, marginBottom: 10}}>
                About Trainer
              </text.T16>
              <div style={{...utils.rowCenter(), marginBottom: 10}}>
                <div style={{marginRight: 12}}>
                  <Image
                    width={60}
                    height={60}
                    src={`${URLS.IMAGE_URL}${workshop.trainer_image}`}
                    alt={workshop.trainer_name}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <div>
                  <text.T16 style={{...theme.fonts.Lato_700Bold}}>
                    {workshop.trainer_name}
                  </text.T16>
                  <text.T14 style={{color: theme.colors.secondaryTextColor}}>
                    {workshop.trainer_designation}
                  </text.T14>
                </div>
              </div>
              <text.T14 style={{color: theme.colors.secondaryTextColor, lineHeight: 1.5}}>
                {workshop.trainer_description}
              </text.T14>
            </div>

            {/* Reviews Section */}
            <div>
              <div style={{...utils.rowCenterSpcBtw(), marginBottom: 20}}>
                <text.T16 style={{...theme.fonts.Lato_700Bold}}>
                  Reviews ({workshop.total_reviews})
                </text.T16>
                <div style={{...utils.rowCenter()}}>
                  <svg.StarSvg />
                  <text.T16 style={{marginLeft: 6}}>
                    {Number(workshop.average_rating || 0).toFixed(1)}
                  </text.T16>
                </div>
              </div>

              {feedback.map((review) => (
                <div key={review.id} style={{marginBottom: 20}}>
                  <div style={{...utils.rowCenter(), marginBottom: 8}}>
                    <div style={{marginRight: 12}}>
                      <Image
                        width={40}
                        height={40}
                        src={`${URLS.IMAGE_URL}${review.user_image}`}
                        alt={review.user_name}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                    <div>
                      <text.T14 style={{...theme.fonts.Lato_700Bold}}>
                        {review.user_name}
                      </text.T14>
                      <div style={{...utils.rowCenter()}}>
                        {[...Array(5)].map((_, index) => (
                          <svg.StarSvg
                            key={index}
                            color={index < review.rating ? theme.colors.mainColor : theme.colors.secondaryTextColor}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <text.T14 style={{color: theme.colors.secondaryTextColor, lineHeight: 1.5}}>
                    {review.comment}
                  </text.T14>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  };

  return (
    <components.Screen>
      <components.Header title="Workshop Details" showGoBack={true} />
      {renderContent()}
      <components.BottomTabBar />
    </components.Screen>
  );
};
