'use client';

import Image from 'next/image';
import React, {useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';

import {svg} from '../../svg';
import {text} from '../../text';
import {URLS} from '../../config';
import {theme} from '../../constants';
import {components} from '../../components';

export const CourseCompleted: React.FC = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const workshopId = searchParams.get('workshopId');

  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.white;
  }, []);

  const handleCertificateDownload = () => {
    if (orderId) {
      window.open(`https://ipnacademy.in/user/certificate.php?id=${orderId}`, '_blank');
    }
  };

  const handleSubmitFeedback = async () => {
    if (rating === 0 || !comment.trim()) {
      alert('Please provide a rating and a comment.');
      return;
    }

    const sessionToken = localStorage.getItem('sessionToken');
    const storedUser = localStorage.getItem('user');

    if (!sessionToken || !storedUser) {
        alert('You must be logged in to submit feedback. Please sign in.');
        return;
    }

    let parsedUser;
    try {
        parsedUser = JSON.parse(storedUser);
    } catch (e) {
        alert('Invalid user data found. Please log in again.');
        return;
    }

    if (!parsedUser || !parsedUser.id || typeof parsedUser.id !== 'number') {
        alert('Invalid user ID found. Please log in again.');
        return;
    }

    const userId = parsedUser.id; // Use the validated userId

    if (!workshopId) {
        alert('Workshop ID is missing. Cannot submit feedback.');
        return;
    }

    console.log('Submitting feedback with:', {
      userId,
      workshopId,
      rating,
      comment,
      sessionToken: sessionToken ? '[TOKEN_PRESENT]' : '[TOKEN_MISSING]', // Log presence, not actual token
    });

    try {
      setIsSubmittingFeedback(true);
      
      const response = await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        },
        body: JSON.stringify({
          userId: userId,
          workshopId: workshopId,
          rating: rating,
          comment: comment,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Feedback submitted successfully!');
        setFeedbackSubmitted(true);
        setShowFeedbackForm(false); // Hide form after submission
      } else {
        throw new Error(data.message || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const renderHeader = () => {
    return <components.Header showGoBack={true} />;
  };

  const renderBackground = () => {
    return <components.Background version={2} />;
  };

  const renderContent = () => {
    return (
      <main
        className='scrollable container'
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{marginBottom: 10, display: 'flex', justifyContent: 'center'}}
        >
          <svg.BigLogoSvg />
        </div>
        <span
          className='t12'
          style={{
            textAlign: 'center',
            display: 'block',
            fontWeight: 500,
            color: theme.colors.mainColor,
            ...theme.fonts.League_Spartan,
          }}
        >
          IPN Academy
        </span>
        <Image
          src={`${URLS.MAIN_URL}/assets/images/07.png`}
          alt='Account created'
          width={0}
          height={0}
          sizes='100vw'
          priority={true}
          className='status-image'
        />
        <text.H2 style={{marginBottom: 10}}>Congratulations!</text.H2>
        <p
          style={{
            marginBottom: 24,
            textAlign: 'center',
            fontSize: 16,
            lineHeight: 1.7,
            color: theme.colors.bodyTextColor,
            ...theme.fonts.Lato,
          }}
        >
          You have received a workshop completion <br /> certificate.
        </p>

        {orderId && (
          <components.Button
            label='Download certificate'
            onClick={handleCertificateDownload}
            containerStyle={{width: '100%', marginBottom: 6}}
          />
        )}

        {!feedbackSubmitted && (
          <components.Button
            label='Leave feedback'
            onClick={() => setShowFeedbackForm(true)}
            containerStyle={{width: '100%'}}
            style={{
              backgroundColor: theme.colors.transparent,
              color: theme.colors.mainColor,
            }}
          />
        )}

        {showFeedbackForm && (            
          <div style={{width: '100%', marginTop: 20}}>
            <text.T16 style={{marginBottom: 10, textAlign: 'center'}}>How was your experience?</text.T16>
            <components.RatingStars rating={rating} setRating={setRating} containerStyle={{marginBottom: 20}} />
            <components.InputField
              label='Your feedback'
              type='text'
              inputType='text'
              placeholder='Enter your comments'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              containerStyle={{marginBottom: 20, height: 100}}
            />
            <components.Button
              label={isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
              onClick={handleSubmitFeedback}
              containerStyle={{width: '100%'}}
            />
          </div>
        )}
      </main>
    );
  };

  return (
    <components.Screen>
      {renderHeader()}
      {renderBackground()}
      {renderContent()}
    </components.Screen>
  );
};
