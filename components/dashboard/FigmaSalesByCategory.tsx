import React from 'react';

interface CategoryData {
  name: string;
  percentage: number;
  color: string;
  bgColor: string;
}

interface FigmaSalesByCategoryProps {
  categories?: CategoryData[];
}

const FigmaSalesByCategory: React.FC<FigmaSalesByCategoryProps> = ({
  categories = [
    { name: 'Hair care', percentage: 15, color: '#4F46E5', bgColor: 'bg-indigo-600' },
    { name: 'Serum', percentage: 15, color: '#FB923C', bgColor: 'bg-orange-400' },
    { name: 'Cream', percentage: 15, color: '#FCA5A5', bgColor: 'bg-red-300' },
    { name: 'Home & kitchen', percentage: 15, color: '#EF4444', bgColor: 'bg-red-500' },
    { name: 'Lip care', percentage: 15, color: '#A3E635', bgColor: 'bg-lime-400' },
    { name: 'Air Conditioner', percentage: 15, color: '#38BDF8', bgColor: 'bg-sky-400' },
    { name: 'Skin care', percentage: 10, color: '#A21CAF', bgColor: 'bg-fuchsia-700' }
  ]
}) => {
  // Calculate angles for pie chart
  let currentAngle = 0;
  const segments = categories.map((category) => {
    const angle = (category.percentage / 100) * 360;
    const segment = {
      ...category,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      angle
    };
    currentAngle += angle;
    return segment;
  });

  // Function to create SVG path for pie segment
  const createPath = (startAngle: number, endAngle: number, outerRadius: number, innerRadius: number = 0) => {
    const start = polarToCartesian(100, 100, outerRadius, endAngle);
    const end = polarToCartesian(100, 100, outerRadius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    if (innerRadius > 0) {
      const innerStart = polarToCartesian(100, 100, innerRadius, endAngle);
      const innerEnd = polarToCartesian(100, 100, innerRadius, startAngle);
      return [
        "M", start.x, start.y,
        "A", outerRadius, outerRadius, 0, largeArcFlag, 0, end.x, end.y,
        "L", innerEnd.x, innerEnd.y,
        "A", innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
        "Z"
      ].join(" ");
    } else {
      return [
        "M", start.x, start.y,
        "A", outerRadius, outerRadius, 0, largeArcFlag, 0, end.x, end.y,
        "L", 100, 100,
        "Z"
      ].join(" ");
    }
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <div 
      className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 h-full flex flex-col"
      style={{ 
        boxShadow: '0px 2px 9.6px rgba(0, 0, 0, 0.08)',
        fontFamily: 'Poppins, sans-serif'
      }}
    >
      <h3 className="text-sm sm:text-base font-semibold text-zinc-800 mb-2 sm:mb-3 md:mb-4">Sale By Category</h3>
      
      <div className="flex flex-col items-center flex-1">
        {/* Pie Chart - Donut style */}
        <div className="w-28 sm:w-36 md:w-40 lg:w-44 h-28 sm:h-36 md:h-40 lg:h-44 relative mb-3 sm:mb-4 md:mb-6">
          <svg width="100%" height="100%" viewBox="0 0 200 200" className="transform -rotate-90">
            {segments.map((segment, index) => (
              <path
                key={index}
                d={createPath(segment.startAngle, segment.endAngle, 90, 50)}
                fill={segment.color}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
          </svg>
          {/* Center circle for donut effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 sm:w-16 md:w-18 lg:w-20 h-12 sm:h-16 md:h-18 lg:h-20 rounded-full bg-white shadow-inner"></div>
          </div>
        </div>
        
        {/* Legend - Two columns */}
        <div className="grid grid-cols-2 gap-x-3 sm:gap-x-4 md:gap-x-6 gap-y-1 sm:gap-y-1.5 md:gap-y-2 w-full">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
              <div 
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0 ${category.bgColor}`}
              ></div>
              <span 
                className="text-[10px] sm:text-xs text-zinc-500 truncate"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                {category.name}({category.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FigmaSalesByCategory;
