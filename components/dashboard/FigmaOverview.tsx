import React from 'react';

// Icon URLs
const ICON_URLS = {
  totalProduct: 'https://hdnfltv.com/image/nitimages/streamline-flex_production-belt-time__2_.webp',
  totalOrder: 'https://hdnfltv.com/image/nitimages/lets-icons_order-light__2_.webp',
  lowStock: 'https://hdnfltv.com/image/nitimages/hugeicons_hot-price__5_.webp',
  totalAmount: 'https://hdnfltv.com/image/nitimages/solar_tag-price-linear__2_.webp',
  toReview: 'https://hdnfltv.com/image/nitimages/mage_preview__1_.webp'
};

interface StatCardProps {
  title: string;
  value: string | number;
  iconUrl: string;
  iconBg: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, iconUrl, iconBg }) => {
  return (
    <div className="bg-[#F5F5F5] rounded-xl p-3 sm:p-4 flex-1 min-w-[120px]">
      <div className="flex items-center justify-between h-full gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-lg sm:text-xl font-semibold text-gray-900 truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>{value}</div>
          <div className="text-xs text-gray-500 truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>{title}</div>
        </div>
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
          <img src={iconUrl} alt={title} className="w-5 h-5 object-contain" />
        </div>
      </div>
    </div>
  );
};

interface LanguageSelectorProps {
  currentLang: string;
  onLangChange: (lang: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLang, onLangChange }) => {
  return (
    <div className="bg-[#F5F5F5] rounded-xl p-3 sm:p-4 flex-1 min-w-[120px] flex flex-col justify-center">
      <div className="text-xs text-gray-500 mb-1.5" style={{ fontFamily: 'Poppins, sans-serif' }}>Language</div>
      <div className="flex items-center gap-1 bg-white rounded-full p-0.5 w-fit">
        <button 
          onClick={() => onLangChange('en')}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            currentLang === 'en' 
              ? 'bg-gray-100 text-gray-900 font-medium' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Eng
        </button>
        <button 
          onClick={() => onLangChange('bn')}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            currentLang === 'bn' 
              ? 'bg-gray-100 text-gray-900 font-medium' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          বাংলা
        </button>
      </div>
    </div>
  );
};

interface DateDisplayProps {
  date: string;
  dayName: string;
}

const DateDisplay: React.FC<DateDisplayProps> = ({ date, dayName }) => {
  return (
    <div className="bg-[#F5F5F5] rounded-xl p-3 sm:p-4 flex-1 min-w-[100px] flex flex-col relative overflow-hidden">
      <div className="absolute -top-8 -right-6 w-24 h-24 rounded-full bg-gradient-to-br from-sky-400 to-blue-500" />
      <div className="text-xs text-gray-600 mb-1 relative z-10" style={{ fontFamily: 'Poppins, sans-serif' }}>{date}</div>
      <div className="flex items-center justify-center mt-auto relative z-10">
        <div className="px-4 py-1.5 bg-gradient-to-r from-sky-400 to-blue-500 rounded-lg">
          <span className="text-base sm:text-lg font-semibold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>{dayName}</span>
        </div>
      </div>
    </div>
  );
};

interface NotificationCardProps {
  title: string;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ title }) => {
  return (
    <div className="bg-[#F5F5F5] rounded-xl p-3 sm:p-4 flex-[1.5] min-w-[150px] flex flex-col">
      <div className="text-xs text-gray-500 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{title}</div>
      <div className="bg-white rounded-lg h-10 flex items-center justify-center overflow-hidden flex-1">
        <span className="text-gray-400 text-xs">Notification Banner</span>
      </div>
    </div>
  );
};

interface FigmaOverviewProps {
  stats?: {
    totalProducts?: number;
    totalOrders?: number;
    totalAmount?: string;
    lowStock?: number;
    toReview?: number;
  };
  currentLang?: string;
  onLangChange?: (lang: string) => void;
}

const FigmaOverview: React.FC<FigmaOverviewProps> = ({
  stats = {
    totalProducts: 45,
    totalOrders: 6550,
    totalAmount: '৳8,35,500',
    lowStock: 5,
    toReview: 452
  },
  currentLang = 'en',
  onLangChange = () => {}
}) => {
  const now = new Date();
  const currentDate = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <div className="bg-white rounded-xl mx-3 sm:mx-4 lg:mx-6 p-4 sm:p-5 shadow-sm">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Order Analytics</h2>
      
      {/* Row 1 - Responsive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-3">
        <StatCard
          title="Products on Hands"
          value={stats.totalProducts || 45}
          iconUrl={ICON_URLS.totalProduct}
          iconBg="bg-white"
        />
        
        <StatCard
          title="Total Orders"
          value={(stats.totalOrders || 6550).toLocaleString()}
          iconUrl={ICON_URLS.totalOrder}
          iconBg="bg-white"
        />
        
        <LanguageSelector currentLang={currentLang} onLangChange={onLangChange} />
        
        <DateDisplay date={currentDate} dayName={currentDay} />
        
        <div className="col-span-2 sm:col-span-1">
          <NotificationCard title="Important Notification" />
        </div>
      </div>

      {/* Row 2 - Responsive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard
          title="Reserved Price"
          value={stats.totalAmount || '৳8,35,500'}
          iconUrl={ICON_URLS.totalAmount}
          iconBg="bg-white"
        />
        
        <StatCard
          title="Low Stock"
          value={stats.lowStock || 5}
          iconUrl={ICON_URLS.lowStock}
          iconBg="bg-blue-500"
        />
        
        <StatCard
          title="To be Reviewed"
          value={stats.toReview || 452}
          iconUrl={ICON_URLS.toReview}
          iconBg="bg-white"
        />
      </div>
    </div>
  );
};

export default FigmaOverview;
