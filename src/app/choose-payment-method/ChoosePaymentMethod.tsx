'use client';

import React, {useState} from 'react';

import {text} from '../../text';
import {utils} from '../../utils';
import {Routes} from '../../routes';
import {theme} from '../../constants';
import {components} from '../../components';

const cards = [
  {
    id: 1,
    number: '4141 •••• •••• 3827',
  },
  {
    id: 2,
    number: '7741 •••• •••• 6644',
  },
];

export const ChoosePaymentMethod: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(cards[0].id);
  const [selectedApplePay, setSelectedApplePay] = useState<boolean>(false);
  const [selectedPayPal, setSelectedPayPal] = useState<boolean>(false);

  const renderImageBackground = () => {
    return <components.Background version={1} />;
  };

  const renderHeader = () => {
    return (
      <components.Header title='Choose payment method' showGoBack={true} />
    );
  };

  const renderContent = () => {
    return (
      <main className='container' style={{paddingBottom: 0}}>
        {/* Cards */}
        <div
          className='custom-block'
          style={{padding: 20, marginTop: 20, marginBottom: 10}}
        >
          <text.T16 style={{marginBottom: 8}}>Cards</text.T16>
          {cards.map((card, index, array) => {
            const isLast = index === array.length - 1;
            return (
              <button
                style={{
                  width: '100%',
                  ...utils.rowCenterSpcBtw(),
                  marginBottom: isLast ? 0 : 10,
                }}
                key={card.id}
                onClick={() => setSelectedCard(card.id)}
              >
                <text.T14>{card.number}</text.T14>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    border: `1px solid ${theme.colors.mainColor}`,
                    ...utils.flexCenter(),
                  }}
                >
                  {selectedCard === card.id && (
                    <div
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: 2,
                        backgroundColor: theme.colors.mainColor,
                      }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
        {/* Apple Pay */}
        <button
          className='custom-block'
          style={{
            padding: 20,
            ...utils.rowCenterSpcBtw(),
            marginBottom: 10,
            width: '100%',
          }}
          onClick={() => setSelectedApplePay(!selectedApplePay)}
        >
          <text.T16>Apple Pay</text.T16>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              border: `1px solid ${theme.colors.mainColor}`,
              ...utils.flexCenter(),
            }}
          >
            {selectedApplePay === true && (
              <div
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 2,
                  backgroundColor: theme.colors.mainColor,
                }}
              />
            )}
          </div>
        </button>
        {/* Pay Pall */}
        <button
          className='custom-block'
          style={{
            padding: 20,
            ...utils.rowCenterSpcBtw(),
            marginBottom: 30,
            width: '100%',
          }}
          onClick={() => setSelectedPayPal(!selectedPayPal)}
        >
          <text.T16>Pay Pal</text.T16>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              border: `1px solid ${theme.colors.mainColor}`,
              ...utils.flexCenter(),
            }}
          >
            {selectedPayPal === true && (
              <div
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 2,
                  backgroundColor: theme.colors.mainColor,
                }}
              />
            )}
          </div>
        </button>
        {/* Button */}
        <components.Button label='Save' href={Routes.PAYMENT_SUCCESS} />
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
