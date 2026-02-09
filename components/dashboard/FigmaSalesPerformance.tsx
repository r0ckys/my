import React, { useState } from 'react';

interface ChartData {
  day: number;
  placedOrder: number;
  delivered: number;
  canceled: number;
}

interface FigmaSalesPerformanceProps {
  data?: ChartData[];
  onTimeFilterChange?: (filter: string) => void;
}

const FigmaSalesPerformance: React.FC<FigmaSalesPerformanceProps> = ({
  data = Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    placedOrder: Math.floor(Math.random() * 50) + 30,
    delivered: Math.floor(Math.random() * 40) + 20,
    canceled: Math.floor(Math.random() * 15) + 5
  })),
  onTimeFilterChange = () => {}
}) => {
  const [activeFilter, setActiveFilter] = useState('Month');
  const maxValue = 100;
  
  const createSmoothPath = (values: number[], chartWidth: number, chartHeight: number) => {
    const points = values.map((value, index) => ({
      x: (index / (values.length - 1)) * chartWidth,
      y: chartHeight - (value / maxValue) * chartHeight
    }));
    if (points.length < 2) return '';
    let path = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlPointX = (current.x + next.x) / 2;
      path += ` C ${controlPointX},${current.y} ${controlPointX},${next.y} ${next.x},${next.y}`;
    }
    return path;
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    onTimeFilterChange(filter);
  };

  return (
    <div 
      className="bg-white rounded-[10px] p-2.5 flex flex-col gap-2.5"
      style={{ 
        outline: '0.5px solid rgba(0, 0, 0, 0.1)',
        fontFamily: 'Lato, sans-serif'
      }}
    >
      {/* Header with filters */}
      <div className="flex justify-between items-center">
        <div className="text-zinc-800 text-lg font-bold" style={{ fontFamily: 'Lato, sans-serif' }}>
          Sale Performance
        </div>
        <div className="flex items-center gap-2">
          {['Day', 'Month', 'Year', 'All Time'].map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`w-16 px-2 py-1 rounded-lg flex justify-center items-center text-sm font-medium ${
                activeFilter === filter
                  ? 'bg-gradient-to-b from-orange-500 to-amber-500 text-white'
                  : 'bg-stone-50 text-neutral-400'
              }`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {filter}
            </button>
          ))}
          <div className="px-3 py-1.5 bg-gradient-to-r from-sky-400 to-blue-500 rounded-lg flex items-center gap-2">
            <span className="text-white text-sm font-normal" style={{ fontFamily: 'Lato, sans-serif' }}>
              December 2025
            </span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2 5L10 10L2 15" fill="white" transform="rotate(90 10 10)"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4">
        <span className="text-sky-400 text-sm font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>Placed Order</span>
        <span className="text-orange-500 text-sm font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>Order Delivered</span>
        <span className="text-red-700 text-sm font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>Order Cancel</span>
      </div>

      {/* Chart */}
      <div className="relative h-48">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between">
          {[100, 75, 50, 25, 0].map((val) => (
            <span 
              key={val} 
              className="w-6 h-9 opacity-50 text-right text-neutral-900 text-[10px] font-medium"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {val}
            </span>
          ))}
        </div>
        
        {/* Chart area */}
        <div className="ml-8 h-full relative">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="absolute w-full border-t border-zinc-300" 
              style={{ top: `${i * 25}%` }} 
            />
          ))}
          
          {/* Line chart */}
          <svg className="w-full h-full" viewBox="0 0 700 180" preserveAspectRatio="none">
            {/* Placed Order (sky-400) */}
            <path
              d={createSmoothPath(data.map(d => d.placedOrder), 700, 180)}
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1.5"
            />
            {/* Order Delivered (orange-500) */}
            <path
              d={createSmoothPath(data.map(d => d.delivered), 700, 180)}
              fill="none"
              stroke="#F97316"
              strokeWidth="1.5"
            />
            {/* Order Cancel (red-700) */}
            <path
              d={createSmoothPath(data.map(d => d.canceled), 700, 180)}
              fill="none"
              stroke="#B91C1C"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="ml-8 flex justify-between">
        {Array.from({ length: 31 }, (_, i) => (
          <span 
            key={i}
            className="opacity-50 text-neutral-900 text-[10px] font-medium"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {i + 1}
          </span>
        ))}
      </div>
    </div>
  );
};

export default FigmaSalesPerformance;
