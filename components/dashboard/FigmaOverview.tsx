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
}

const StatCard: React.FC<StatCardProps> = ({ title, value, iconUrl }) => {
  return (
    <div 
      className="bg-stone-50 rounded-lg p-4 h-16 relative overflow-hidden"
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      <div className="absolute left-4 top-1.5 text-black text-2xl font-medium">{value}</div>
      <div className="absolute left-4 top-[42px] text-black text-xs font-medium">{title}</div>
      <div className="absolute right-3 top-3 w-11 h-11 bg-white rounded-lg flex items-center justify-center">
        <img src={iconUrl} alt={title} className="w-8 h-8 object-contain" />
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
    <div 
      className="bg-stone-50 rounded-lg h-16 p-4"
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      <div className="text-black text-xs font-normal mb-2">Language</div>
      <div className="w-24 h-6 bg-white/0 rounded-3xl border border-white flex items-center overflow-hidden">
        <button 
          onClick={() => onLangChange('en')}
          className={`w-11 h-4 mx-1 rounded-[20px] text-xs flex items-center justify-center ${
            currentLang === 'en' ? 'bg-white' : ''
          }`}
        >
          Eng
        </button>
        <span 
          onClick={() => onLangChange('bn')}
          className="text-black text-xs cursor-pointer"
        >
          বাংলা
        </span>
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
    <div 
      className="bg-stone-50 rounded-lg h-16 relative overflow-hidden"
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      <div className="absolute w-40 h-40 left-[26.5px] top-[22px] bg-gradient-to-r from-sky-400 to-blue-500 rounded-full" />
      <div className="absolute left-[10.5px] top-[10px] text-black text-base font-medium">{date}</div>
      <div className="absolute left-[67.5px] top-[34px] text-white text-2xl font-medium z-10">{dayName}</div>
    </div>
  );
};

interface NotificationCardProps {
  title: string;
  content?: React.ReactNode;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ title }) => {
  return (
    <div 
      className="bg-stone-50 rounded-lg h-36 p-4 relative"
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      <div className="text-black text-xs font-normal">{title}</div>
      <div className="w-56 h-24 bg-white rounded-lg mt-2 flex items-center justify-center overflow-hidden">
        <img 
          src="https://placehold.co/232x54" 
          alt="Notification"
          className="w-56 h-14 object-cover"
        />
      </div>
      <div className="absolute left-[99px] top-[135px] flex items-center gap-1">
        <div className="w-2 h-2 bg-white rounded-full" />
        <div className="w-4 h-2 bg-gradient-to-r from-sky-400 to-blue-500 rounded-[32px]" />
        <div className="w-2 h-2 bg-white rounded-full" />
        <div className="w-2 h-2 bg-white rounded-full" />
        <div className="w-2 h-2 bg-white rounded-full" />
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
    totalProducts: 4,
    totalOrders: 65,
    totalAmount: '35',
    lowStock: 45,
    toReview: 452
  },
  currentLang = 'en',
  onLangChange = () => {}
}) => {
  const now = new Date();
  const currentDate = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <div className="bg-white rounded-lg mx-6 p-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <h2 className="text-black text-base font-semibold mb-6">Order Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Row 1 */}
        <StatCard
          title="Products on Hands"
          value={stats.totalProducts || 4}
          iconUrl={ICON_URLS.totalProduct}
        />
        
        <StatCard
          title="Total Orders"
          value={stats.totalOrders || 65}
          iconUrl={ICON_URLS.totalOrder}
        />
        
        <LanguageSelector currentLang={currentLang} onLangChange={onLangChange} />
        
        <DateDisplay date={currentDate} dayName={currentDay} />
        
        <div className="lg:col-span-2">
          <NotificationCard title="Important Notification" />
        </div>

        {/* Row 2 */}
        <StatCard
          title="Reserved Price"
          value={stats.totalAmount || '35'}
          iconUrl={ICON_URLS.totalAmount}
        />
        
        <StatCard
          title="Low Stock"
          value={stats.lowStock || 45}
          iconUrl={ICON_URLS.lowStock}
        />
        
        <div className="lg:col-span-2">
          <StatCard
            title="To be Reviewed"
            value={stats.toReview || 452}
            iconUrl={ICON_URLS.toReview}
          />
        </div>
      </div>
    </div>
  );
};

export default FigmaOverview;
