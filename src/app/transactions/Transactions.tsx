'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';

import {text} from '../../text';
import {Routes} from '../../routes';
import {theme} from '../../constants';
import {components} from '../../components';

interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  profile: string;
  token: string;
}

interface Transaction {
  id: number;
  workshopName: string;
  amount: number;
  status: string;
  date: string;
  payment_id: string;
  order_id: string;
}

export const Transactions: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    console.log('User data from localStorage:', userData);
    
    if (!userData) {
      console.log('No user data found, redirecting to sign in');
      router.push(Routes.SIGN_IN);
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    console.log('Parsed user data:', parsedUser);
    setUser(parsedUser);
    document.body.style.backgroundColor = theme.colors.white;
  }, [router]);

  useEffect(() => {
    if (user) {
      console.log('User state updated, fetching transactions for:', user.id);
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      if (!user) {
        console.log('No user data available for fetching transactions');
        return;
      }

      console.log('Fetching transactions for user:', user.id);
      const response = await fetch('/api/transactions', {
        headers: {
          'user-id': user.id.toString()
        }
      });
      
      console.log('API Response status:', response.status);
      const data = await response.json();
      console.log('API Response data:', data);

      if (data.success) {
        console.log('Setting transactions:', data.transactions);
        setTransactions(data.transactions);
      } else {
        console.error('API error:', data.message);
        setError(data.message || 'Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('An error occurred while fetching transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const renderBackground = () => {
    return <components.Background version={1} />;
  };

  const renderHeader = () => {
    return <components.Header showGoBack={true} title='Transactions' />;
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div style={{textAlign: 'center', padding: '20px'}}>
          Loading transactions...
        </div>
      );
    }

    if (error) {
      return (
        <div style={{textAlign: 'center', padding: '20px', color: 'red'}}>
          {error}
        </div>
      );
    }

    if (transactions.length === 0) {
      return (
        <div style={{textAlign: 'center', padding: '20px'}}>
          No transactions found
        </div>
      );
    }

    return (
      <main className='scrollable' style={{paddingTop: '8%', paddingBottom: '8%'}}>
        <div className='container'>
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              style={{
                backgroundColor: theme.colors.white,
                borderRadius: 10,
                padding: 15,
                marginBottom: 15,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 10}}>
                <text.H3 style={{margin: 0}}>{transaction.workshopName}</text.H3>
                <span style={{
                  color: transaction.status === 'Completed' ? theme.colors.mainColor : theme.colors.coralRed,
                  fontWeight: 'bold'
                }}>
                  {transaction.status}
                </span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 5}}>
                <span style={{color: theme.colors.bodyTextColor}}>
                  ₹{transaction.amount}
                </span>
                <span style={{color: theme.colors.bodyTextColor}}>
                  {new Date(transaction.date).toLocaleDateString()}
                </span>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: 2}}>
                <span style={{color: theme.colors.bodyTextColor, fontSize: 12}}>
                  Payment ID: {transaction.payment_id || 'N/A'}
                </span>
                <span style={{color: theme.colors.bodyTextColor, fontSize: 12}}>
                  Order ID: {transaction.order_id || 'N/A'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  };

  return (
    <div className='screen'>
      {renderBackground()}
      {renderHeader()}
      {renderContent()}
    </div>
  );
}; 