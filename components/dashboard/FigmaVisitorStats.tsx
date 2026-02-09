import React from 'react';

// Online Now Icon (Wifi/Signal style)
const OnlineNowIcon: React.FC = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 28C20.1046 28 21 27.1046 21 26C21 24.8954 20.1046 24 19 24C17.8954 24 17 24.8954 17 26C17 27.1046 17.8954 28 19 28Z" fill="#008DFF"/>
    <path d="M11 20C13.2091 17.7909 16.0909 16.6364 19 16.6364C21.9091 16.6364 24.7909 17.7909 27 20" stroke="#008DFF" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M6 15C9.5 11.5 14.0909 9.63636 19 9.63636C23.9091 9.63636 28.5 11.5 32 15" stroke="#008DFF" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

// Today Visitors Icon (Users style)
const TodayVisitorsIcon: React.FC = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M26.5 28V26C26.5 24.4087 25.8679 22.8826 24.7426 21.7574C23.6174 20.6321 22.0913 20 20.5 20H11.5C9.90871 20 8.38258 20.6321 7.25736 21.7574C6.13214 22.8826 5.5 24.4087 5.5 26V28" stroke="#FF5500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 16C19.3137 16 22 13.3137 22 10C22 6.68629 19.3137 4 16 4C12.6863 4 10 6.68629 10 10C10 13.3137 12.6863 16 16 16Z" stroke="#FF5500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M32.5 28V26C32.4987 24.6706 32.0478 23.3822 31.2217 22.3462C30.3957 21.3102 29.2446 20.5882 27.9583 20.3" stroke="#FF5500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24.9583 4.3C26.2477 4.58649 27.4022 5.30895 28.2302 6.34696C29.0582 7.38497 29.5094 8.67688 29.5094 10.01C29.5094 11.3431 29.0582 12.635 28.2302 13.673C27.4022 14.711 26.2477 15.4335 24.9583 15.72" stroke="#FF5500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Total Visitors Icon (Globe/Grid style)
const TotalVisitorsIcon: React.FC = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="30" height="30" rx="2" stroke="#3F34BE" strokeWidth="1.5"/>
    <line x1="19" y1="4" x2="19" y2="34" stroke="#3F34BE" strokeWidth="1.5"/>
    <line x1="4" y1="19" x2="34" y2="19" stroke="#3F34BE" strokeWidth="1.5"/>
  </svg>
);

interface VisitorCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: number;
  theme: 'blue' | 'orange' | 'purple';
}

const VisitorCard: React.FC<VisitorCardProps> = ({
  icon,
  title,
  subtitle,
  value,
  theme
}) => {
  const themes = {
    blue: {
      bgColor: 'rgba(255, 255, 255, 0.95)',
      circleColor: 'rgba(0, 141, 255, 0.2)',
      titleColor: '#0EA5E9'
    },
    orange: {
      bgColor: 'rgba(255, 255, 255, 0.95)',
      circleColor: 'rgba(255, 85, 0, 0.25)',
      titleColor: '#EA580C'
    },
    purple: {
      bgColor: 'rgba(255, 255, 255, 0.95)',
      circleColor: 'rgba(63, 52, 190, 0.2)',
      titleColor: '#4338CA'
    }
  };

  const config = themes[theme];

  return (
    <div
      className="relative rounded-lg overflow-hidden flex-1"
      style={{
        background: config.bgColor,
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
        minHeight: '80px'
      }}
    >
      {/* Background decorative circle */}
      <div
        className="absolute rounded-full"
        style={{
          width: '198px',
          height: '198px',
          left: '237px',
          top: '-83px',
          background: theme === 'purple' 
            ? 'linear-gradient(180deg, rgba(63, 52, 190, 0.2) 0%, rgba(63, 52, 190, 0.2) 100%)'
            : config.circleColor,
          borderRadius: '9999px'
        }}
      />
      
      {/* Icon container - exact position from Figma */}
      <div 
        className="absolute overflow-hidden"
        style={{ 
          width: '38px', 
          height: '38px', 
          left: '16px', 
          top: '22px' 
        }}
      >
        {icon}
      </div>
      
      {/* Text content - exact position from Figma */}
      <div 
        className="absolute flex flex-col"
        style={{ 
          width: '128px', 
          left: '70px', 
          top: '20.5px' 
        }}
      >
        <span
          style={{
            color: config.titleColor,
            fontSize: '16px',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 500
          }}
        >
          {title}
        </span>
        <span
          style={{
            color: 'black',
            fontSize: '12px',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 400
          }}
        >
          {subtitle}
        </span>
      </div>
      
      {/* Value - exact position from Figma */}
      <div
        className="absolute"
        style={{
          left: '310px',
          top: '23px',
          color: 'black',
          fontSize: '24px',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 500
        }}
      >
        {value}
      </div>
    </div>
  );
};

interface FigmaVisitorStatsProps {
  visitorStats?: {
    onlineNow?: number;
    todayVisitors?: number;
    totalVisitors?: number;
  };
}

const FigmaVisitorStats: React.FC<FigmaVisitorStatsProps> = ({
  visitorStats = {
    onlineNow: 35,
    todayVisitors: 35,
    totalVisitors: 35
  }
}) => {
  return (
    <div className="h-72 flex flex-col justify-center items-start gap-3.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <VisitorCard
        icon={<OnlineNowIcon />}
        title="Online Now"
        subtitle="Active visitors on site"
        value={visitorStats.onlineNow || 35}
        theme="blue"
      />
      
      <VisitorCard
        icon={<TodayVisitorsIcon />}
        title="Today visitors"
        subtitle="Last 7 days: 4"
        value={visitorStats.todayVisitors || 35}
        theme="orange"
      />
      
      <VisitorCard
        icon={<TotalVisitorsIcon />}
        title="Total visitors"
        subtitle="15 page view"
        value={visitorStats.totalVisitors || 35}
        theme="purple"
      />
    </div>
  );
};

export default FigmaVisitorStats;
