import React, { useState } from 'react';
import { Ticket, ChevronRight, Filter, Search, X, Clock } from 'lucide-react';
import { useGameState, Coupon } from '../state/gameState';
import PageHeader from './PageHeader';

type FilterStatus = 'active' | 'used' | 'expired' | 'all';

type BrandInfo = {
  name: string;
  image: string;
};

type BrandDictionary = {
  [key: string]: BrandInfo;
};

// Mock coupon data with brand information for the UI demonstration
const brandInfo: BrandDictionary = {
  "MCDONALDS": {
    name: "McDonald's",
    image: "https://www.mcdonalds.com.sg/sites/default/files/2023-03/McD_S_DeliveryWebsite_550x550px_BigMac.png"
  },
  "PIZZAHUT": {
    name: "Pizza Hut",
    image: "https://s7d1.scene7.com/is/image/mcdonalds/t-mcdonalds-Pizza-Hut-Classic:1-3-product-tile-desktop"
  },
  "BURGERKING": {
    name: "Burger King",
    image: "https://s7d1.scene7.com/is/image/mcdonalds/t-mcdonalds-Burger-King-Whopper:1-3-product-tile-desktop"
  },
  "KFC": {
    name: "KFC",
    image: "https://www.kfc.com.my/images/kfc-bucket-meals.png"
  }
};

// Helper function to get days left (mock implementation)
const getDaysLeft = (coupon: Coupon) => {
  // This would normally calculate from the expiry date
  // Return a mock value between 1-10 for this demo
  const id = parseInt(coupon.id.replace('coupon', ''));
  return Math.max(1, id % 10);
};

// Helper to get status color based on days left
const getStatusColor = (daysLeft: number) => {
  if (daysLeft > 5) return 'text-green-600';
  if (daysLeft > 2) return 'text-orange-500';
  return 'text-red-500';
};

// Helper to get brand info
const getBrand = (code: string) => {
  const brandCode = code.split('-')[0];
  return brandInfo[brandCode] || { 
    name: "Store", 
    image: "https://placehold.co/100x100?text=Store" 
  };
};

const CouponPage = () => {
  const { coupons } = useGameState();
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('active');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter coupons based on current filters
  const filteredCoupons = coupons.filter(coupon => {
    // Status filter
    if (statusFilter === 'active' && coupon.isUsed) return false;
    if (statusFilter === 'used' && !coupon.isUsed) return false;
    
    // Search filter
    const brand = getBrand(coupon.code);
    if (searchQuery && 
        !coupon.discount.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !brand.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Handle coupon selection
  const handleCouponClick = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  // Close coupon detail view
  const handleCloseDetail = () => {
    setSelectedCoupon(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-300">
      {/* Resource bar at the top */}
      <PageHeader />
      
      {/* Title and Icon Row */}
      <div className="px-4 pb-2 flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-100 rounded-2xl shadow-md flex items-center justify-center">
          <Ticket className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white drop-shadow-sm">My Coupons</h1>
          <p className="text-white/80 text-sm">Use them before they expire!</p>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="px-4 pb-4 flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search coupons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <button 
          className="h-12 w-16 rounded-xl flex items-center justify-center shadow-lg transition-colors bg-white/90 text-gray-700"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-5 h-5" />
          <span className="ml-1 font-medium">Filter</span>
        </button>
      </div>
      
      {showFilters && (
        <div className="mt-0 px-4 mb-4">
          <div className="bg-white/90 rounded-xl p-4 shadow-lg">
            <h3 className="font-bold text-gray-800 mb-3">Filter by Status</h3>
            <div className="flex flex-wrap gap-2">
              <button 
                className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md ${
                  statusFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => setStatusFilter('all')}
              >
                All Coupons
              </button>
              <button 
                className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md ${
                  statusFilter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => setStatusFilter('active')}
              >
                Active
              </button>
              <button 
                className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md ${
                  statusFilter === 'used' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => setStatusFilter('used')}
              >
                Used
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Coupon list */}
      {selectedCoupon ? (
        // Coupon detail view
        <div className="mt-2 px-4 pb-24">
          <button 
            className="mb-5 text-blue-700 font-semibold flex items-center text-lg"
            onClick={handleCloseDetail}
          >
            ← Back to coupons
          </button>
          
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="bg-blue-600 p-7 text-white text-center">
              <h2 className="text-2xl font-bold mb-2 drop-shadow-sm">{selectedCoupon.discount}</h2>
              <p className="text-base font-medium text-blue-100">
                {selectedCoupon.isUsed ? 'Used' : 'Active'}
              </p>
            </div>
            
            <div className="p-7">
              <div className="text-center mb-7">
                <div className="bg-gray-100 p-5 rounded-lg mx-auto w-56 h-56 flex items-center justify-center mb-4 border-2 border-gray-200 shadow-inner">
                  <span className="text-xl font-bold text-gray-800">{selectedCoupon.code}</span>
                </div>
                <p className="text-gray-700 text-base font-medium">Show this code to the cashier</p>
              </div>
              
              <div className="border-t-2 border-gray-200 pt-5">
                <p className="text-base text-gray-800 font-medium mb-2">
                  {selectedCoupon.expiry ? `Expires: ${selectedCoupon.expiry}` : 'No expiration date'}
                </p>
                <p className="text-base text-gray-800 font-medium">
                  Code: <span className="font-bold">{selectedCoupon.code}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Coupon list view - matching the image design
        <div className="px-4 pb-24">
          {filteredCoupons.length === 0 ? (
            <div className="text-center py-12 text-gray-700 bg-white rounded-xl shadow-md p-8">
              <Ticket size={56} className="mx-auto mb-5 text-gray-400" />
              <p className="text-xl font-semibold">No coupons found</p>
              <p className="mt-2 text-gray-600">Try adjusting your filters to see more coupons</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredCoupons.map(coupon => {
                const daysLeft = getDaysLeft(coupon);
                const statusColor = getStatusColor(daysLeft);
                const brand = getBrand(coupon.code);
                
                return (
                  <div 
                    key={coupon.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <div className="p-4 flex justify-between items-center">
                      <div className="flex">
                        <div className="w-16 h-16 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                          <img 
                            src={brand.image} 
                            alt={brand.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{brand.name}</h3>
                          <p className="font-medium text-blue-600">
                            {coupon.discount}
                          </p>
                          <div className={`flex items-center mt-1 ${statusColor}`}>
                            <Clock className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">{daysLeft} days left</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        className="bg-blue-500 text-white font-medium py-2 px-4 rounded-lg flex items-center"
                        onClick={() => handleCouponClick(coupon)}
                      >
                        Use <ChevronRight size={18} className="ml-1" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CouponPage;