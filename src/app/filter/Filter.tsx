'use client';

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';

import {svg} from '../../svg';
import {text} from '../../text';
import {utils} from '../../utils';
import {theme} from '../../constants';
import {components} from '../../components';

const price = [
  {
    id: 1,
    name: 'Paid (142)',
  },
  {
    id: 2,
    name: 'Free (18)',
  },
];

const level = [
  {
    id: 1,
    name: 'All Levels (1,167)',
  },
  {
    id: 2,
    name: 'Beginner (956)',
  },
  {
    id: 3,
    name: 'Intermediate (187)',
  },
  {
    id: 4,
    name: 'Expert (20)',
  },
];

const features = [
  {
    id: 1,
    name: 'Subtitles (1,460)',
  },
  {
    id: 2,
    name: 'Practice Tests (72)',
  },
];

const ratings = [
  {
    id: 1,
    name: '4.5 & up (698)',
  },
  {
    id: 2,
    name: '4.0 & up (1,537)',
  },
  {
    id: 3,
    name: '3.5 & up (1,906)',
  },
  {
    id: 4,
    name: '3.0 & up (2,012)',
  },
];

const videoDuration = [
  {
    id: 1,
    name: '0-1 Hour (428)',
  },
  {
    id: 2,
    name: '1-3 Hours (1,046)',
  },
  {
    id: 3,
    name: '3-6 Hours (512)',
  },
  {
    id: 4,
    name: '6-17 Hours (260)',
  },
  {
    id: 5,
    name: '17+ Hours (82)',
  },
];

export const Filter: React.FC = () => {
  const router = useRouter();

  const [selectedPrice, setSelectedPrice] = useState<number | null>(
    price[0].id
  );
  const [selectedLevel, setSelectedLevel] = useState<number | null>(
    level[0].id
  );
  const [selectedFeatures, setSelectedFeatures] = useState<number | null>(
    features[0].id
  );
  const [selectedRatings, setSelectedRatings] = useState<number | null>(
    ratings[0].id
  );
  const [selectedVideoDuration, setSelectedVideoDuration] = useState<
    number | null
  >(videoDuration[0].id);

  const renderImageBackground = () => {
    return <components.Background version={1} />;
  };

  const renderHeader = () => {
    return (
      <components.Header
        title='Filter'
        showGoBack={true}
        showClearText={true}
        clearTextOnClick={() => {
          setSelectedPrice(price[0].id);
          setSelectedLevel(level[0].id);
          setSelectedFeatures(features[0].id);
          setSelectedRatings(ratings[0].id);
          setSelectedVideoDuration(videoDuration[0].id);
        }}
      />
    );
  };

  const renderSortBy = () => {
    return (
      <div style={{paddingTop: 20, marginBottom: 30}}>
        <text.H3 style={{marginBottom: 6}}>Price</text.H3>
        {price.map((item, index, array) => {
          const isLast = index === array.length - 1;
          return (
            <div
              key={item.id}
              style={{
                cursor: 'pointer',
                userSelect: 'none',
                ...utils.rowCenter(),
                marginBottom: isLast ? 0 : 10,
              }}
              onClick={() => setSelectedPrice(item.id)}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  marginRight: 10,
                  border: `1px solid ${theme.colors.secondaryTextColor}`,
                  ...utils.flexCenter(),
                }}
              >
                {selectedPrice === item.id && <svg.InputCheckSvg />}
              </div>
              <text.T14>{item.name}</text.T14>
            </div>
          );
        })}
      </div>
    );
  };

  const renderLevel = () => {
    return (
      <div style={{marginBottom: 30}}>
        <text.H3 style={{marginBottom: 6}}>Price</text.H3>
        {level.map((item, index, array) => {
          const isLast = index === array.length - 1;
          return (
            <div
              key={item.id}
              style={{
                cursor: 'pointer',
                userSelect: 'none',
                ...utils.rowCenter(),
                marginBottom: isLast ? 0 : 10,
              }}
              onClick={() => setSelectedLevel(item.id)}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  marginRight: 10,
                  border: `1px solid ${theme.colors.secondaryTextColor}`,
                  ...utils.flexCenter(),
                }}
              >
                {selectedLevel === item.id && <svg.InputCheckSvg />}
              </div>
              <text.T14>{item.name}</text.T14>
            </div>
          );
        })}
      </div>
    );
  };

  const renderFeatures = () => {
    return (
      <div style={{marginBottom: 30}}>
        <text.H3 style={{marginBottom: 6, textTransform: 'capitalize'}}>
          features
        </text.H3>
        {features.map((item, index, array) => {
          const isLast = index === array.length - 1;
          return (
            <div
              key={item.id}
              style={{
                cursor: 'pointer',
                userSelect: 'none',
                ...utils.rowCenter(),
                marginBottom: isLast ? 0 : 10,
              }}
              onClick={() => setSelectedFeatures(item.id)}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  marginRight: 10,
                  border: `1px solid ${theme.colors.secondaryTextColor}`,
                  ...utils.flexCenter(),
                }}
              >
                {selectedFeatures === item.id && <svg.InputCheckSvg />}
              </div>
              <text.T14>{item.name}</text.T14>
            </div>
          );
        })}
      </div>
    );
  };

  const renderRatings = () => {
    return (
      <div style={{marginBottom: 30}}>
        <text.H3 style={{marginBottom: 6, textTransform: 'capitalize'}}>
          Ratings
        </text.H3>
        {ratings.map((item, index, array) => {
          const isLast = index === array.length - 1;
          return (
            <div
              key={item.id}
              style={{
                cursor: 'pointer',
                userSelect: 'none',
                ...utils.rowCenter(),
                marginBottom: isLast ? 0 : 10,
              }}
              onClick={() => setSelectedRatings(item.id)}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  marginRight: 10,
                  border: `1px solid ${theme.colors.secondaryTextColor}`,
                  ...utils.flexCenter(),
                }}
              >
                {selectedRatings === item.id && <svg.InputCheckSvg />}
              </div>
              <text.T14>{item.name}</text.T14>
            </div>
          );
        })}
      </div>
    );
  };

  const renderVideoDuration = () => {
    return (
      <div style={{marginBottom: 30}}>
        <text.H3 style={{marginBottom: 6, textTransform: 'capitalize'}}>
          Video duration
        </text.H3>
        {videoDuration.map((item, index, array) => {
          const isLast = index === array.length - 1;
          return (
            <div
              key={item.id}
              style={{
                cursor: 'pointer',
                userSelect: 'none',
                ...utils.rowCenter(),
                marginBottom: isLast ? 0 : 10,
              }}
              onClick={() => setSelectedVideoDuration(item.id)}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  marginRight: 10,
                  border: `1px solid ${theme.colors.secondaryTextColor}`,
                  ...utils.flexCenter(),
                }}
              >
                {selectedVideoDuration === item.id && <svg.InputCheckSvg />}
              </div>
              <text.T14>{item.name}</text.T14>
            </div>
          );
        })}
      </div>
    );
  };

  const renderButton = () => {
    return (
      <components.Button
        label='Apply'
        style={{marginBottom: 20}}
        onClick={() => router.back()}
      />
    );
  };

  const renderContent = () => {
    return (
      <main style={{paddingBottom: 0}} className='container scrollable'>
        {renderSortBy()}
        {renderLevel()}
        {renderFeatures()}
        {renderRatings()}
        {renderVideoDuration()}
        {renderButton()}
      </main>
    );
  };

  return (
    <components.Screen>
      {renderImageBackground()}
      {renderHeader()}
      {renderContent()}
    </components.Screen>
  );
};
