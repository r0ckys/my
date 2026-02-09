import React from 'react';

// SVG Icons matching Figma design
const TodayIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 6.5V10L14 12" stroke="#BE185D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 10C5.5 6 8.5 3 12 3C15.5 3 18.5 6 19 10" stroke="#BE185D" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const CourierIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 8L12 13L21 8L12 3L3 8Z" fill="#D97706"/>
  </svg>
);

const ConfirmedIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 12L11.5 14.5L16 9" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="9" stroke="#16A34A" strokeWidth="1.5"/>
  </svg>
);

const PendingIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#EAB308" strokeWidth="1.5"/>
    <path d="M15 9.5L12.8 12L15 14.5" stroke="#EAB308" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CanceledIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#DC2626" strokeWidth="1.2"/>
    <path d="M15 9L9 15M9 9L15 15" stroke="#DC2626" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const ReturnsIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#1D4ED8" strokeWidth="1.2"/>
    <path d="M8 12L11 9M11 15L8 12" stroke="#1D4ED8" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M16 12H8" stroke="#1D4ED8" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

interface OrderStatusItemProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  iconBg: string;
}

const OrderStatusItem: React.FC<OrderStatusItemProps> = ({ 
  icon, 
  label, 
  count, 
  iconBg 
}) => {
  return (
    <div 
      className="w-44 h-12 relative bg-white rounded-lg overflow-hidden"
      style={{ 
        boxShadow: '0px 2px 9.6px rgba(0, 0, 0, 0.08)',
        fontFamily: 'Poppins, sans-serif'
      }}
    >
      <div className={`absolute left-2 top-2 w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center`}>
        {icon}
      </div>
      <div className="absolute left-[46px] top-[15px] text-black text-xs font-medium">
        {label}
      </div>
      <div className="absolute left-[140px] top-[6px] text-black text-2xl font-medium">
        {count}
      </div>
    </div>
  );
};

interface FigmaOrderStatusProps {
  orderStats?: {
    today?: number;
    pending?: number;
    confirmed?: number;
    courier?: number;
    canceled?: number;
    returns?: number;
  };
}

const FigmaOrderStatus: React.FC<FigmaOrderStatusProps> = ({
  orderStats = {
    today: 35,
    pending: 35,
    confirmed: 35,
    courier: 35,
    canceled: 35,
    returns: 35
  }
}) => {
  return (
    <div className="px-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <h2 className="text-black text-base font-semibold mb-4">Order</h2>
      
      <div className="flex flex-wrap gap-4">
        <OrderStatusItem
          icon={<TodayIcon />}
          label="Today"
          count={orderStats.today || 35}
          iconBg="bg-pink-100"
        />
        
        <OrderStatusItem
          icon={<CourierIcon />}
          label="Courier"
          count={orderStats.courier || 35}
          iconBg="bg-orange-100"
        />
        
        <OrderStatusItem
          icon={<ConfirmedIcon />}
          label="Confirmed"
          count={orderStats.confirmed || 35}
          iconBg="bg-green-100"
        />
        
        <OrderStatusItem
          icon={<PendingIcon />}
          label="Pending"
          count={orderStats.pending || 35}
          iconBg="bg-amber-100"
        />
        
        <OrderStatusItem
          icon={<CanceledIcon />}
          label="Canceled"
          count={orderStats.canceled || 35}
          iconBg="bg-red-100"
        />
        
        <OrderStatusItem
          icon={<ReturnsIcon />}
          label="Returns"
          count={orderStats.returns || 35}
          iconBg="bg-blue-100"
        />
      </div>
    </div>
  );
};

export default FigmaOrderStatus;
