import React from 'react';

// Search Icon SVG Component
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15.75 15.75L12.4875 12.4875" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface TopProduct {
  id: string;
  name: string;
  itemCode: string;
  price: string;
  image?: string;
}

interface FigmaTopProductsProps {
  products?: TopProduct[];
}

const FigmaTopProducts: React.FC<FigmaTopProductsProps> = ({
  products = [
    {
      id: '1',
      name: 'Apple iPhone 13',
      itemCode: '#FXZ-4567',
      price: '$999.00'
    },
    {
      id: '2',
      name: 'Nike Air Jordan',
      itemCode: '#FXZ-4567',
      price: '$72.40'
    },
    {
      id: '3',
      name: 'T-shirt',
      itemCode: '#FXZ-4567',
      price: '$35.40'
    },
    {
      id: '4',
      name: 'Assorted Cross Bag',
      itemCode: '#FXZ-4567',
      price: '$80.00'
    }
  ]
}) => {
  return (
    <div 
      className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 h-full"
      style={{ 
        boxShadow: '0px 2px 9.6px rgba(0, 0, 0, 0.08)',
        fontFamily: 'Poppins, sans-serif'
      }}
    >
      {/* Header */}
      <div className="mb-3 sm:mb-4 md:mb-5">
        <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
          <h3 className="text-sm sm:text-base font-semibold text-zinc-800">Top Products</h3>
          <span className="text-xs sm:text-sm text-sky-400 cursor-pointer hover:text-sky-500 transition-colors">
            All product
          </span>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <div className="flex items-center bg-zinc-100 rounded-md sm:rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 md:py-2.5">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent flex-1 text-xs sm:text-sm text-zinc-700 placeholder-zinc-400 focus:outline-none ml-1.5 sm:ml-2"
              style={{ fontFamily: 'Lato, sans-serif' }}
            />
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="space-y-2 sm:space-y-3">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 hover:bg-zinc-50 rounded-md sm:rounded-lg transition-colors cursor-pointer"
          >
            {/* Product Image */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-zinc-100 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs sm:text-sm text-zinc-400 font-medium">{product.name.charAt(0)}</span>
              )}
            </div>
            
            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h4 
                className="text-xs sm:text-sm font-medium text-zinc-700 truncate"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                {product.name}
              </h4>
              <p 
                className="text-[10px] sm:text-xs text-zinc-500 mt-0.5"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                Item: {product.itemCode}
              </p>
            </div>
            
            {/* Price */}
            <div 
              className="text-xs sm:text-sm font-semibold text-zinc-800 shrink-0"
              style={{ fontFamily: 'Lato, sans-serif' }}
            >
              {product.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FigmaTopProducts;
