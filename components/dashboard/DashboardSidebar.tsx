import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  Palette,
  FileText,
  Bell,
  CreditCard,
  Truck,
  Image,
  Target
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  badge?: string | number;
  children?: SidebarItem[];
}

interface DashboardSidebarProps {
  activeItem?: string;
  onNavigate?: (item: string) => void;
  className?: string;
}

const menuItems: SidebarItem[] = [
  // Main Menu
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'orders', label: 'Orders', icon: <ShoppingCart className="w-5 h-5" />, badge: '12' },
  { id: 'products', label: 'Products', icon: <Package className="w-5 h-5" /> },
  { id: 'customers_reviews', label: 'Customers', icon: <Users className="w-5 h-5" /> },
  { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-5 h-5" /> },
  
  // Configuration
  { id: 'customization', label: 'Customization', icon: <Palette className="w-5 h-5" /> },
  { id: 'landing_pages', label: 'Landing Pages', icon: <FileText className="w-5 h-5" /> },
  { id: 'popups', label: 'Popups', icon: <Bell className="w-5 h-5" /> },
  { id: 'gallery', label: 'Gallery', icon: <Image className="w-5 h-5" /> },
  
  // System
  { id: 'delivery', label: 'Delivery', icon: <Truck className="w-5 h-5" /> },
  { id: 'payment', label: 'Payment', icon: <CreditCard className="w-5 h-5" /> },
  { id: 'daily_target', label: 'Daily Target', icon: <Target className="w-5 h-5" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
];

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeItem = 'dashboard',
  onNavigate,
  className = ''
}) => {
  const handleItemClick = (itemId: string) => {
    onNavigate?.(itemId);
  };

  const renderMenuItem = (item: SidebarItem) => {
    const isActive = activeItem === item.id;
    
    return (
      <button
        key={item.id}
        onClick={() => handleItemClick(item.id)}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
          isActive 
            ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-md' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        <span className={isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}>
          {item.icon}
        </span>
        <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
        {item.badge && (
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
            isActive ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-600'
          }`}>
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <nav className={`space-y-1 ${className}`}>
      {/* Main Menu Section */}
      <div className="mb-6">
        <p className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Main Menu
        </p>
        <div className="space-y-1">
          {menuItems.slice(0, 5).map(renderMenuItem)}
        </div>
      </div>

      {/* Configuration Section */}
      <div className="mb-6">
        <p className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Configuration
        </p>
        <div className="space-y-1">
          {menuItems.slice(5, 9).map(renderMenuItem)}
        </div>
      </div>

      {/* System Section */}
      <div className="mb-6">
        <p className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
          System
        </p>
        <div className="space-y-1">
          {menuItems.slice(9).map(renderMenuItem)}
        </div>
      </div>

      {/* Help & Logout */}
      <div className="pt-4 border-t border-gray-100">
        <button
          onClick={() => handleItemClick('help')}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          <HelpCircle className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium">Help & Support</span>
        </button>
        <button
          onClick={() => handleItemClick('logout')}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default DashboardSidebar;
