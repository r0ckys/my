import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Globe, FileText, Tag, TrendingDown, Package, Star, Search, Bell, Calendar,
  ChevronDown, Monitor, Tablet, Smartphone, MoreVertical, ArrowUpRight, ArrowDownRight,
  ShoppingCart, Truck, CheckCircle, Clock, XCircle, RotateCcw, ChevronRight, BarChart3
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

interface StatCard {
  id: string;
  label: string;
  value: number | string;
  icon: React.ReactNode;
  iconBg: string;
}

interface OrderStatus {
  id: string;
  label: string;
  count: number;
  color: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  sold: number;
  image: string;
}

interface AdminDashboardProps {
  orders?: any[];
  products?: any[];
  tenantId?: string;
  user?: any;
}

const visitorData = [
  { date: 'Jan 25', mobile: 850, tablet: 450, desktop: 650 },
  { date: 'Jan 26', mobile: 920, tablet: 480, desktop: 720 },
  { date: 'Jan 27', mobile: 780, tablet: 520, desktop: 680 },
  { date: 'Jan 28', mobile: 1100, tablet: 600, desktop: 850 },
  { date: 'Jan 29', mobile: 950, tablet: 550, desktop: 780 },
  { date: 'Jan 30', mobile: 880, tablet: 490, desktop: 710 },
  { date: 'Jan 31', mobile: 1020, tablet: 580, desktop: 820 },
];

const salesData = [
  { month: 'Jan', sales: 2400 },
  { month: 'Feb', sales: 4200 },
  { month: 'Mar', sales: 3100 },
  { month: 'Apr', sales: 5800 },
  { month: 'May', sales: 4200 },
  { month: 'Jun', sales: 6100 },
  { month: 'Jul', sales: 5200 },
];

const categoryData = [
  { name: 'Electronics', value: 35, color: '#6366f1' },
  { name: 'Clothing', value: 25, color: '#22c55e' },
  { name: 'Accessories', value: 20, color: '#eab308' },
  { name: 'Home & Garden', value: 12, color: '#ec4899' },
  { name: 'Others', value: 8, color: '#94a3b8' },
];

const bestSellingProducts: Product[] = [
  { id: '1', name: 'iPhone 15 Pro', sku: 'IPH15P-001', price: 999, sold: 245, image: '' },
  { id: '2', name: 'Samsung Galaxy S24', sku: 'SGS24-002', price: 899, sold: 189, image: '' },
  { id: '3', name: 'MacBook Air M3', sku: 'MBA-M3-003', price: 1299, sold: 156, image: '' },
  { id: '4', name: 'AirPods Pro 2', sku: 'APP2-004', price: 249, sold: 312, image: '' },
  { id: '5', name: 'iPad Pro 12.9', sku: 'IPDP-005', price: 1099, sold: 98, image: '' },
];

const topProducts = [
  { id: '1', name: 'Wireless Earbuds', price: 79.99, rating: 4.8 },
  { id: '2', name: 'Smart Watch Pro', price: 199.99, rating: 4.7 },
  { id: '3', name: 'USB-C Hub', price: 49.99, rating: 4.6 },
  { id: '4', name: 'Phone Case Premium', price: 29.99, rating: 4.9 },
  { id: '5', name: 'Charging Cable 3-Pack', price: 19.99, rating: 4.5 },
];

const OrderAnalyticsCard: React.FC<StatCard> = ({ label, value, icon, iconBg }) => (
  <div className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
        {icon}
      </div>
    </div>
    <div className="mt-3">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  </div>
);

const VisitorStatCard: React.FC<{ label: string; value: string; change: string; isPositive: boolean }> = ({
  label, value, change, isPositive
}) => (
  <div className="bg-white rounded-xl p-4 border border-gray-100">
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">{label}</p>
      <span className={`flex items-center text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {change}
      </span>
    </div>
    <p className="text-xl font-bold text-gray-900 mt-2">{value}</p>
  </div>
);

const OrderStatusPill: React.FC<OrderStatus> = ({ label, count, color }) => (
  <div className={`px-4 py-3 rounded-xl text-center ${color}`}>
    <p className="text-lg font-bold">{count}</p>
    <p className="text-xs mt-1">{label}</p>
  </div>
);

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders = [], products = [], tenantId, user }) => {
  const [timePeriod, setTimePeriod] = useState<'day' | 'month' | 'year' | 'all'>('month');
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [currentDate] = useState(new Date());
  
  const totalProducts = products?.length || 4;
  const totalOrders = orders?.length || 65;
  const lowStockCount = products?.filter((p: any) => (p.stock || 0) < 10)?.length || 45;
  const pendingReviews = orders?.filter((o: any) => o.status === 'pending')?.length || 452;
  
  const analyticsCards: StatCard[] = [
    { id: '1', label: 'Products on Hands', value: totalProducts, icon: <Globe className="w-5 h-5 text-blue-600" />, iconBg: 'bg-blue-100' },
    { id: '2', label: 'Total Orders', value: totalOrders, icon: <FileText className="w-5 h-5 text-purple-600" />, iconBg: 'bg-purple-100' },
    { id: '3', label: 'Reserved Price', value: 35, icon: <Tag className="w-5 h-5 text-green-600" />, iconBg: 'bg-green-100' },
    { id: '4', label: 'Low Stock', value: lowStockCount, icon: <TrendingDown className="w-5 h-5 text-orange-600" />, iconBg: 'bg-orange-100' },
    { id: '5', label: 'To be Reviewed', value: pendingReviews, icon: <Package className="w-5 h-5 text-pink-600" />, iconBg: 'bg-pink-100' },
  ];

  const orderStatuses: OrderStatus[] = [
    { id: 'today', label: 'Today', count: orders?.filter((o: any) => new Date(o.createdAt).toDateString() === new Date().toDateString())?.length || 35, color: 'bg-blue-50 text-blue-700' },
    { id: 'courier', label: 'Courier', count: orders?.filter((o: any) => o.status === 'courier')?.length || 35, color: 'bg-indigo-50 text-indigo-700' },
    { id: 'confirmed', label: 'Confirmed', count: orders?.filter((o: any) => o.status === 'confirmed')?.length || 35, color: 'bg-green-50 text-green-700' },
    { id: 'pending', label: 'Pending', count: orders?.filter((o: any) => o.status === 'pending')?.length || 35, color: 'bg-yellow-50 text-yellow-700' },
    { id: 'cancelled', label: 'Cancelled', count: orders?.filter((o: any) => o.status === 'cancelled')?.length || 35, color: 'bg-red-50 text-red-700' },
    { id: 'returns', label: 'Returns', count: orders?.filter((o: any) => o.status === 'returned')?.length || 35, color: 'bg-gray-100 text-gray-700' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Order Analytics</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${language === 'en' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
              >Eng</button>
              <button
                onClick={() => setLanguage('bn')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${language === 'bn' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
              >বাংলা</button>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{currentDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })}</span>
              <span className="text-gray-400">|</span>
              <span>{currentDate.toLocaleDateString('en-US', { weekday: 'short' })}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {analyticsCards.map((card) => (
            <OrderAnalyticsCard key={card.id} {...card} />
          ))}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-4 text-white col-span-1">
            <div className="flex items-center justify-between mb-2">
              <Bell className="w-5 h-5" />
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">New</span>
            </div>
            <p className="text-sm font-medium">Important</p>
            <p className="text-xs opacity-80 mt-1">Notification</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mb-6">
        <div className="col-span-12 md:col-span-3 space-y-4">
          <VisitorStatCard label="Online Now" value="127" change="+12%" isPositive={true} />
          <VisitorStatCard label="Today visitors" value="1,842" change="+8%" isPositive={true} />
          <VisitorStatCard label="Total visitors" value="45,231" change="+15%" isPositive={true} />
        </div>
        
        <div className="col-span-12 md:col-span-9 bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Units of Measure</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-gray-600">Mobile View</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-gray-600">Tab View</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full" />
                <span className="text-gray-600">Desktop View</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={visitorData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="mobile" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="tablet" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="desktop" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Order</h3>
        <div className="grid grid-cols-6 gap-4">
          {orderStatuses.map((status) => (
            <OrderStatusPill key={status.id} {...status} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mb-6">
        <div className="col-span-12 lg:col-span-8 bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Sale Performance</h3>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {['Day', 'Month', 'Year', 'All Time'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimePeriod(period.toLowerCase().replace(' ', '') as any)}
                  className={`px-3 py-1.5 text-xs rounded-md transition-colors ${timePeriod === period.toLowerCase().replace(' ', '') ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                >{period}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="col-span-12 lg:col-span-4 bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Sale By Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-gray-600">{cat.name}</span>
                </div>
                <span className="font-medium text-gray-900">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Best Selling Product</h3>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {['Day', 'Month', 'Year', 'All Time'].map((period) => (
                <button key={period} className="px-3 py-1.5 text-xs rounded-md text-gray-600 hover:text-gray-900 transition-colors">{period}</button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">SKU</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Price</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Sold</th>
                </tr>
              </thead>
              <tbody>
                {(products?.slice(0, 5) || bestSellingProducts).map((product: any) => (
                  <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-400" />
                        </div>
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{product.sku || `SKU-${product.id}`}</td>
                    <td className="py-3 px-4 text-right font-medium text-gray-900">৳{product.price || product.selling_price || 0}</td>
                    <td className="py-3 px-4 text-right text-gray-600">{product.sold || product.totalSold || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="col-span-12 lg:col-span-4 bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Top Products</h3>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-32" />
            </div>
          </div>
          <div className="space-y-3">
            {(products?.slice(0, 5) || topProducts).map((product: any, index: number) => (
              <div key={product.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                    <p className="text-xs text-gray-500">৳{product.price || product.selling_price || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium text-gray-700">{product.rating || 4.5}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
