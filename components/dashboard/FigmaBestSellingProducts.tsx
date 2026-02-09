import React, { useState } from 'react';

interface Product {
  id: string;
  name: string;
  image?: string;
  totalOrder: string;
  status: 'In Stock' | 'Stock out' | 'Low Stock';
  price: string;
}

interface FigmaBestSellingProductsProps {
  products?: Product[];
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'In Stock':
      return { bg: 'bg-emerald-50', text: 'text-emerald-500' };
    case 'Stock out':
      return { bg: 'bg-red-50', text: 'text-red-500' };
    case 'Low Stock':
      return { bg: 'bg-amber-50', text: 'text-amber-500' };
    default:
      return { bg: 'bg-gray-50', text: 'text-gray-500' };
  }
};

const FigmaBestSellingProducts: React.FC<FigmaBestSellingProductsProps> = ({
  products = [
    {
      id: '1',
      name: 'Apple iPhone 13',
      totalOrder: '104',
      status: 'In Stock',
      price: '$999.00'
    },
    {
      id: '2',
      name: 'Nike Air Jordan',
      totalOrder: '56',
      status: 'Stock out',
      price: '$999.00'
    },
    {
      id: '3',
      name: 'T-shirt',
      totalOrder: '266',
      status: 'In Stock',
      price: '$999.00'
    },
    {
      id: '4',
      name: 'Cross Bag',
      totalOrder: '506',
      status: 'In Stock',
      price: '$999.00'
    }
  ]
}) => {
  const [activeFilter, setActiveFilter] = useState('All Time');
  const filters = ['Day', 'Month', 'Year', 'All Time'];

  return (
    <div 
      className="bg-white rounded-xl p-6"
      style={{ 
        boxShadow: '0px 2px 9.6px rgba(0, 0, 0, 0.08)',
        fontFamily: 'Poppins, sans-serif'
      }}
    >
      {/* Header with filters */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-zinc-800">Best Selling Product</h3>
        
        {/* Time filters */}
        <div className="flex items-center gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeFilter === filter
                  ? 'text-white'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
              style={activeFilter === filter ? {
                background: 'linear-gradient(180deg, #F97316 0%, #F59E0B 100%)'
              } : {}}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200">
              <th 
                className="text-left py-3 text-sm font-medium text-zinc-500"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                Product
              </th>
              <th 
                className="text-left py-3 text-sm font-medium text-zinc-500"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                Total Order
              </th>
              <th 
                className="text-left py-3 text-sm font-medium text-zinc-500"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                Status
              </th>
              <th 
                className="text-left py-3 text-sm font-medium text-zinc-500"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => {
              const statusStyles = getStatusStyles(product.status);
              return (
                <tr 
                  key={product.id} 
                  className={index !== products.length - 1 ? 'border-b border-zinc-100' : ''}
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-sm text-zinc-400 font-medium">{product.name.charAt(0)}</span>
                        )}
                      </div>
                      <span 
                        className="text-sm font-medium text-zinc-700"
                        style={{ fontFamily: 'Lato, sans-serif' }}
                      >
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span 
                      className="text-sm text-zinc-600"
                      style={{ fontFamily: 'Lato, sans-serif' }}
                    >
                      {product.totalOrder}
                    </span>
                  </td>
                  <td className="py-4">
                    <span 
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusStyles.bg} ${statusStyles.text}`}
                      style={{ fontFamily: 'Lato, sans-serif' }}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <span 
                      className="text-sm text-zinc-600"
                      style={{ fontFamily: 'Lato, sans-serif' }}
                    >
                      {product.price}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Details button */}
      <div className="mt-5 flex justify-end">
        <button 
          className="px-6 py-2 rounded-lg border border-sky-400 text-sky-400 hover:bg-sky-50 transition-colors"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          <span className="text-sm font-medium">Details</span>
        </button>
      </div>
    </div>
  );
};

export default FigmaBestSellingProducts;
