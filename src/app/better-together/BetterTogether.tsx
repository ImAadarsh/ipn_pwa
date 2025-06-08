'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { components } from '../../components';
import { theme } from '../../constants';
import { text } from '../../text';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { FaChalkboardTeacher, FaGlobeAmericas, FaUsers, FaClock, FaTrophy, FaCertificate } from 'react-icons/fa';

interface Stats {
  total_users_count: number;
  workshops_count: number;
  countries_count: number;
  educators_count: number;
  cities_count: number;
  certifications_count: number;
  learning_hours_count: number;
}

export const BetterTogether: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();

        if (data.success) {
          setStats(data.data);
        } else {
          setError(data.message || 'Failed to load statistics');
        }
      } catch (err) {
        setError('An error occurred while fetching statistics.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const renderBackground = () => {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        overflow: 'hidden'
      }}>
        <components.Background version={1} />
      </div>
    );
  };

  if (loading) {
    return (
      <components.Screen>
        <components.Header title="Better Together" showGoBack={true} />
        <main className="scrollable container" style={{ paddingTop: 20, paddingBottom: 20 }}>
          <LoadingSkeleton />
        </main>
        <components.BottomTabBar />
      </components.Screen>
    );
  }

  if (error) {
    return (
      <components.Screen>
        <components.Header title="Better Together" showGoBack={true} />
        <main className="scrollable container" style={{ paddingTop: 20, paddingBottom: 20 }}>
          <div className="text-center p-4 text-red-500">
            {error}
          </div>
        </main>
        <components.BottomTabBar />
      </components.Screen>
    );
  }

  return (
    <components.Screen>
      <Head>
        <title>Better Together</title>
      </Head>
      {renderBackground()}
      <components.Header title="Better Together" showGoBack={true} />
      <main className="scrollable impact-section" style={{
        fontFamily: 'Inter, sans-serif',
        background: 'transparent',
        color: 'white',
        position: 'relative',
        flex: 1,
        overflowY: 'auto',
        paddingBottom: '80px'
      }}>
        <style jsx>{`
          .impact-section {
            position: relative;
            padding: 80px 20px;
            text-align: center;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            overflow: hidden;
          }
          .animated-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
              radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
            animation: gradient-anim 15s ease infinite alternate;
            z-index: 1;
          }
          .animated-bg::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
            opacity: 0.5;
            animation: patternMove 20s linear infinite;
          }
          @keyframes patternMove {
            0% { background-position: 0 0; }
            100% { background-position: 100px 100px; }
          }
          .section-header {
            position: relative;
            z-index: 10;
            margin-bottom: 40px;
            padding: 50px 30px;
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(20px);
            border-radius: 30px;
            box-shadow: 
              0 8px 32px rgba(31, 41, 55, 0.1),
              0 2px 8px rgba(31, 41, 55, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.8);
            animation: headerFadeIn 1s ease-out;
            overflow: hidden;
            transform-style: preserve-3d;
            perspective: 1000px;
          }
          .section-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6);
            background-size: 200% 100%;
            animation: gradientMove 3s linear infinite;
          }
          .section-header::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(45deg, 
              rgba(255, 255, 255, 0.1) 0%,
              rgba(255, 255, 255, 0.2) 50%,
              rgba(255, 255, 255, 0.1) 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          .section-header:hover::after {
            opacity: 1;
          }
          .academy-badge {
            background: linear-gradient(45deg, #4f46e5, #7c3aed);
            border-radius: 30px;
            padding: 12px 30px;
            display: inline-block;
            margin-bottom: 30px;
            backdrop-filter: blur(5px);
            box-shadow: 
              0 4px 15px rgba(79, 70, 229, 0.3),
              0 2px 4px rgba(79, 70, 229, 0.2);
            animation: badgePulse 2s infinite;
            border: 1px solid rgba(255, 255, 255, 0.3);
            position: relative;
            overflow: hidden;
            transform: translateZ(0);
            transition: transform 0.3s ease;
          }
          .academy-badge:hover {
            transform: translateY(-2px) scale(1.02);
          }
          .floating-shapes {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            overflow: hidden;
            z-index: 1;
          }
          .shape {
            position: absolute;
            background: linear-gradient(45deg, rgba(79, 70, 229, 0.1), rgba(124, 58, 237, 0.1));
            border-radius: 50%;
            animation: float 15s infinite linear;
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
          }
          .shape::before {
            content: '';
            position: absolute;
            inset: -2px;
            background: linear-gradient(45deg, 
              rgba(255, 255, 255, 0.1),
              rgba(255, 255, 255, 0.2),
              rgba(255, 255, 255, 0.1));
            border-radius: inherit;
            animation: shapeGlow 3s infinite;
          }
          @keyframes shapeGlow {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
          .hero-title {
            font-size: clamp(2.5rem, 8vw, 4rem);
            font-weight: 800;
            line-height: 1.2;
            margin: 0 0 1.5rem;
            background: linear-gradient(45deg, #1e40af, #3b82f6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: titleGlow 3s infinite alternate;
            position: relative;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .hero-title::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 4px;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
            border-radius: 2px;
            animation: lineWidth 3s infinite alternate;
          }
          @keyframes lineWidth {
            0% { width: 50px; }
            100% { width: 150px; }
          }
          .impact-highlight {
            display: inline-block;
            padding: 0.8rem 2rem;
            background: linear-gradient(45deg, #4f46e5, #7c3aed);
            border-radius: 50px;
            color: white;
            font-weight: 700;
            font-size: 1.3rem;
            margin-top: 1.5rem;
            box-shadow: 
              0 4px 15px rgba(79, 70, 229, 0.3),
              0 2px 4px rgba(79, 70, 229, 0.2);
            animation: highlightPulse 2s infinite;
            position: relative;
            overflow: hidden;
            transition: transform 0.3s ease;
          }
          .impact-highlight:hover {
            transform: translateY(-2px) scale(1.02);
          }
          #live-ticker {
            background: linear-gradient(45deg, rgba(79, 70, 229, 0.1), rgba(124, 58, 237, 0.1));
            border-radius: 20px;
            padding: 20px;
            margin: 40px auto;
            max-width: 800px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 
              0 8px 32px rgba(31, 41, 55, 0.1),
              0 2px 8px rgba(31, 41, 55, 0.05);
            position: relative;
            overflow: hidden;
          }
          #live-ticker::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.2),
              transparent
            );
            animation: tickerShine 3s infinite;
          }
          @keyframes tickerShine {
            0% { left: -100%; }
            100% { left: 100%; }
          }
          .ticker-content {
            background: rgba(255, 255, 255, 0.95);
            padding: 15px 25px;
            border-radius: 15px;
            display: inline-flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            animation: tickerPulse 2s infinite;
            position: relative;
            overflow: hidden;
            transition: transform 0.3s ease;
          }
          .ticker-content:hover {
            transform: translateY(-2px);
          }
          .ticker-icon {
            color: #4f46e5;
            font-size: 1.4rem;
            animation: iconPulse 1.5s infinite;
            filter: drop-shadow(0 2px 4px rgba(79, 70, 229, 0.3));
          }
          .stats-grid {
            position: relative;
            z-index: 10;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 25px;
            max-width: 1200px;
            margin: 0 auto;
            perspective: 1000px;
          }
          .stats-card {
            background: rgba(255, 255, 255, 0.45);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 25px;
            text-align: left;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transform-style: preserve-3d;
            transform: translateZ(0);
          }
          .stats-card:hover {
            transform: translateY(-10px) rotateX(5deg);
            box-shadow: 
              0 15px 30px rgba(0, 0, 0, 0.3),
              0 5px 15px rgba(0, 0, 0, 0.2);
          }
          .card-content {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            position: relative;
          }
          .card-icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            flex-shrink: 0;
            position: relative;
            overflow: hidden;
          }
          .card-icon::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(45deg, 
              rgba(255, 255, 255, 0.1),
              rgba(255, 255, 255, 0.2),
              rgba(255, 255, 255, 0.1));
            animation: iconGlow 3s infinite;
          }
          @keyframes iconGlow {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
          .stat-number {
            font-size: clamp(2rem, 5vw, 2.8rem);
            font-weight: 800;
            color: black;
            margin: 0;
            display: inline-block;
            line-height: 1;
            background: linear-gradient(45deg, #1e40af, #3b82f6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: numberGlow 3s infinite alternate;
          }
          @keyframes numberGlow {
            from { text-shadow: 0 0 10px rgba(59, 130, 246, 0.3); }
            to { text-shadow: 0 0 20px rgba(59, 130, 246, 0.6); }
          }
          .stat-description {
            font-size: 0.95rem;
            color: rgba(47, 47, 47, 0.7);
            margin-top: 10px;
          }
          @media (max-width: 768px) {
            .impact-section {
              padding: 60px 15px;
            }
            .stats-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>

        <div className="animated-bg"></div>
        <div className="floating-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>
        <div className="diagonal-slant"></div>
        <div className="gradient-border"></div>
        <div className="corner-deco top-left"></div>
        <div className="corner-deco top-right"></div>

        <div className="section-header">
          <div className="academy-badge">
            <text.T16 style={{
              color: theme.colors.white,
              fontSize: '1.2rem',
              fontWeight: 700,
              letterSpacing: '1px',
              textAlign: 'center'
            }}>
              South Asia's Leading Teacher Training Platform
            </text.T16>
          </div>
          <h1 className="hero-title">
            IPN Academy
          </h1>
          <div style={{
            position: 'relative',
            display: 'inline-block',
            marginBottom: '2rem'
          }}>
          <h2 style={{
              fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
              fontWeight: 700,
              color: '#1e40af',
            margin: '0 0 1rem',
              lineHeight: 1.3,
            }}>
              Empowering Educators,
              <br />
              Transforming Education
            </h2>
            <div className="impact-highlight">
              {formatNumber(stats?.total_users_count || 0)}+ Teachers Globally
            </div>
          </div>
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            fontSize: '1.2rem',
            color: '#4b5563',
            opacity: 0.9,
            lineHeight: 1.6
          }}>
            Join our global community of educators and be part of the educational revolution
          </div>
        </div>

        <div id="live-ticker">
          <div className="ticker-content">
            <i className="fa fa-bolt ticker-icon"></i>
            <span style={{
              color: '#1e40af',
              fontWeight: 600,
              fontSize: '1.2rem'
            }}>
              Join {formatNumber(stats?.total_users_count || 0)}+ Teachers Community Globally!
            </span>
        </div>
        </div>

        <div className="stats-grid">
          {/* Workshop Stats */}
          <div className="stats-card">
            <div className="card-content">
              <div className="card-icon" style={{ background: 'linear-gradient(45deg, #f59e0b 0%, #fcd34d 100%)' }}>
                <FaChalkboardTeacher size={32} color={theme.colors.white} />
              </div>
              <div>
                <h3 className="stat-number" id="workshops-count">{formatNumber(stats?.workshops_count || 0)}</h3>
                <text.T16 style={{ color: 'rgba(5, 5, 5, 0.9)', margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
                  Global Workshops
                </text.T16>
              </div>
            </div>
            <text.T14 style={{ fontSize: '0.95rem', color: 'rgba(44, 25, 4, 0.7)', marginTop: '10px' }}>Transforming educational practices through immersive learning experiences</text.T14>
          </div>

          {/* Global Reach */}
          <div className="stats-card">
            <div className="card-content">
              <div className="card-icon" style={{ background: 'linear-gradient(45deg, #3b82f6 0%, #60a5fa 100%)' }}>
                <FaGlobeAmericas size={32} color={theme.colors.imageBackground} />
              </div>
              <div>
                <h3 className="stat-number" id="countries-count">{formatNumber(stats?.countries_count || 0)}</h3>
                <text.T16 style={{ color: 'rgba(5, 5, 5, 0.9)', margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
                  Countries Engaged
                </text.T16>
              </div>
            </div>
            <text.T14 style={{ fontSize: '0.95rem', color: 'rgba(44, 25, 4, 0.7)', marginTop: '10px' }}>Building worldwide community of educators</text.T14>
          </div>

          {/* Educators Trained */}
          <div className="stats-card">
            <div className="card-content">
              <div className="card-icon" style={{ background: 'linear-gradient(45deg, #10b981 0%, #34d399 100%)' }}>
                <FaUsers size={32} color={theme.colors.white} />
              </div>
              <div>
                <h3 className="stat-number" id="educators-count">{formatNumber(stats?.educators_count || 0)}</h3>
                <text.T16 style={{ color: 'rgba(5, 5, 5, 0.9)', margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
                  Educators Trained
                </text.T16>
              </div>
            </div>
            <text.T14 style={{ fontSize: '0.95rem', color: 'rgba(44, 25, 4, 0.7)', marginTop: '10px' }}>Participated in transformative workshops</text.T14>
          </div>

          {/* Learning Hours */}
          <div className="stats-card">
            <div className="card-content">
              <div className="card-icon" style={{ background: 'linear-gradient(45deg, #8b5cf6 0%, #c4b5fd 100%)' }}>
                <FaClock size={32} color={theme.colors.white} />
              </div>
              <div>
                <h3 className="stat-number" id="learning-hours-count">{formatNumber(stats?.learning_hours_count || 0)}</h3>
                <text.T16 style={{ color: 'rgba(5, 5, 5, 0.9)', margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
                  Learning Hours
                </text.T16>
              </div>
            </div>
            <text.T14 style={{ fontSize: '0.95rem', color: 'rgba(44, 25, 4, 0.7)', marginTop: '10px' }}>Premium educational content delivered globally</text.T14>
          </div>

          {/* Cities Reached */}
          <div className="stats-card">
            <div className="card-content">
              <div className="card-icon" style={{ background: 'linear-gradient(45deg, #ef4444 0%, #fca5a5 100%)' }}>
                <FaTrophy size={32} color={theme.colors.white} />
              </div>
              <div>
                <h3 className="stat-number" id="cities-count">{formatNumber(stats?.cities_count || 0)}</h3>
                <text.T16 style={{ color: 'rgba(5, 5, 5, 0.9)', margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
                  Cities Reached
                </text.T16>
              </div>
            </div>
            <text.T14 style={{ fontSize: '0.95rem', color: 'rgba(44, 25, 4, 0.7)', marginTop: '10px' }}>Creating interconnected learning networks</text.T14>
          </div>

          {/* Certifications */}
          <div className="stats-card">
            <div className="card-content">
              <div className="card-icon" style={{ background: 'linear-gradient(45deg, #14b8a6 0%, #2dd4bf 100%)' }}>
                <FaCertificate size={32} color={theme.colors.white} />
              </div>
              <div>
                <h3 className="stat-number" id="certifications-count">{formatNumber(stats?.certifications_count || 0)}</h3>
                <text.T16 style={{ color: 'rgba(5, 5, 5, 0.9)', margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
                  Certifications
                </text.T16>
              </div>
            </div>
            <text.T14 style={{ fontSize: '0.95rem', color: 'rgba(44, 25, 4, 0.7)', marginTop: '10px' }}>Awarded for professional development</text.T14>
          </div>
        </div>
      </main>
      <components.BottomTabBar />
    </components.Screen>
  );
}; 