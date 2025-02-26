"use client";
import React from 'react';
import QRCode from 'react-qr-code';
import { Ticket, ChevronRight, User, Coins, Timer, AlertTriangle, Gem, ChevronDown, QrCode, Filter, X, Check, Search } from 'lucide-react';

interface Coupon {
  id: string;
  brand: string;
  logo: string;
  discount: string;
  expiresIn: number;
  isUsed?: boolean;
  qrCode?: string;
}

interface StoreCurrency {
  name: string;
  gems: number;
  color: string;
}

type FilterStatus = 'active' | 'used' | 'expired' | 'all';
type DaysFilter = 'all' | '3days' | '7days' | '30days';

export function CouponPage() {
  const [selectedCoupon, setSelectedCoupon] = React.useState<Coupon | null>(null);
  const [showFilters, setShowFilters] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState<FilterStatus>('active');
  const [daysFilter, setDaysFilter] = React.useState<DaysFilter>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const [coupons] = React.useState<Coupon[]>([
    {
      id: '1',
      brand: "McDonald's",
      logo: "https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&w=200&q=80",
      discount: "50% Discount",
      expiresIn: 7,
      qrCode: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: '2',
      brand: "Starbucks",
      logo: "https://images.unsplash.com/photo-1589476993333-f55b84301219?auto=format&fit=crop&w=200&q=80",
      discount: "Buy 1 Get 1 Free",
      expiresIn: 0,
      isUsed: true,
      qrCode: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: '3',
      brand: "Pizza Hut",
      logo: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80",
      discount: "30% Off on Large Pizzas",
      expiresIn: 5,
      qrCode: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: '4',
      brand: "Subway",
      logo: "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=200&q=80",
      discount: "Free Cookie with Any Sub",
      expiresIn: 0,
      qrCode: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: '5',
      brand: "Burger King",
      logo: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=200&q=80",
      discount: "40% Off on Combo Meals",
      expiresIn: 4,
      qrCode: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: '6',
      brand: "KFC",
      logo: "https://images.unsplash.com/photo-1513639776629-7957c3d2db23?auto=format&fit=crop&w=200&q=80",
      discount: "Free Chicken Wings",
      expiresIn: 2,
      qrCode: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: '7',
      brand: "Dunkin' Donuts",
      logo: "https://images.unsplash.com/photo-1530016555861-3d1f3f5ca94b?auto=format&fit=crop&w=200&q=80",
      discount: "6 Donuts for $5",
      expiresIn: 6,
      qrCode: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: '8',
      brand: "Domino's Pizza",
      logo: "https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?auto=format&fit=crop&w=200&q=80",
      discount: "20% Off on Family Size",
      expiresIn: 3,
      qrCode: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: '9',
      brand: "Baskin Robbins",
      logo: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=200&q=80",
      discount: "Buy 2 Get 1 Free",
      expiresIn: 8,
      qrCode: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: '10',
      brand: "Taco Bell",
      logo: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&w=200&q=80",
      discount: "Free Nachos with Combo",
      expiresIn: 1,
      qrCode: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&w=300&q=80"
    }
  ]);

  const [showStoreSelector, setShowStoreSelector] = React.useState(false);
  const [stores] = React.useState<StoreCurrency[]>([
    { name: 'Parabola', gems: 1600, color: 'emerald' },
    { name: 'KFC', gems: 850, color: 'red' },
    { name: 'Pizza Company', gems: 1200, color: 'blue' },
    { name: 'Pizza Hut', gems: 950, color: 'orange' }
  ]);
  const [selectedStore, setSelectedStore] = React.useState(stores[0]);

  const filteredCoupons = React.useMemo(() => {
    return coupons.filter(coupon => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesBrand = coupon.brand.toLowerCase().includes(query);
        const matchesDiscount = coupon.discount.toLowerCase().includes(query);
        if (!matchesBrand && !matchesDiscount) return false;
      }

      // Filter by status
      if (statusFilter === 'used' && !coupon.isUsed) return false;
      if (statusFilter === 'expired' && coupon.expiresIn !== 0) return false;
      if (statusFilter === 'active' && (coupon.isUsed || coupon.expiresIn === 0)) return false;

      // Filter by days
      if (daysFilter === '3days' && coupon.expiresIn > 3) return false;
      if (daysFilter === '7days' && coupon.expiresIn > 7) return false;
      if (daysFilter === '30days' && coupon.expiresIn > 30) return false;

      return true;
    });
  }, [coupons, statusFilter, daysFilter, searchQuery]);

  const getStoreColor = (color: string) => {
    switch (color) {
      case 'emerald': return 'bg-emerald-400';
      case 'red': return 'bg-red-500';
      case 'blue': return 'bg-blue-500';
      case 'orange': return 'bg-orange-500';
      default: return 'bg-emerald-400';
    }
  };

  const handleStoreSelect = (store: StoreCurrency) => {
    setSelectedStore(store);
    setShowStoreSelector(false);
  };

  const getExpiryColor = (days: number) => {
    if (days <= 2) return 'bg-red-100 text-red-700 border border-red-200';
    if (days <= 4) return 'bg-orange-100 text-orange-700 border border-orange-200';
    return 'bg-green-100 text-green-700 border border-green-200';
  };

  const getExpiryIcon = (days: number) => {
    if (days <= 2) {
      return <AlertTriangle className="w-3.5 h-3.5 text-red-500" />;
    }
    return <Timer className="w-3.5 h-3.5" />;
  };

  const getExpiryText = (days: number) => {
    if (days === 0) return 'Expired';
    return `${days} day${days === 1 ? '' : 's'} left`;
  };

  const handleUseCoupon = (coupon: Coupon) => {
    if (coupon.isUsed || coupon.expiresIn === 0) return;
    setSelectedCoupon(coupon);
  };

  const clearFilters = () => {
    setStatusFilter('active');
    setDaysFilter('all');
    setSearchQuery('');
  };

  const hasActiveFilters = statusFilter !== 'active' || daysFilter !== 'all';

  // Get counts for filter badges
  const getCounts = () => {
    const active = coupons.filter(c => !c.isUsed && c.expiresIn > 0).length;
    const used = coupons.filter(c => c.isUsed).length;
    const expired = coupons.filter(c => c.expiresIn === 0).length;
    return { active, used, expired };
  };

  const counts = getCounts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-300 pt-[150px] pb-24">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-b from-blue-200 to-blue-200/95 pt-4 pb-6 px-4 z-30">
        <div className="flex items-center justify-between mb-4">
          <div className="w-14 h-14 bg-white/90 rounded-2xl shadow-lg flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600" />
          </div>

          <div className="flex items-center gap-2">
            {/* Store Selector */}
            <div className="relative">
              <button
                onClick={() => setShowStoreSelector(!showStoreSelector)}
                className="flex items-center gap-2 bg-black/60 px-3 py-2 rounded-xl"
              >
                <div className={`w-4 h-4 rounded-full ${getStoreColor(selectedStore.color)} flex items-center justify-center`}>
                  <Gem className="w-2.5 h-2.5 text-white" />
                </div>
                <span className="text-sm font-bold text-white">{selectedStore.gems}</span>
                <ChevronDown className="w-4 h-4 text-white/80" />
              </button>

              {showStoreSelector && (
                <div className="absolute top-full mt-2 right-0 w-48 bg-white rounded-xl shadow-xl overflow-hidden z-50">
                  {stores.map((store) => (
                    <button
                      key={store.name}
                      onClick={() => handleStoreSelect(store)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${getStoreColor(store.color)} flex items-center justify-center`}>
                          <Gem className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{store.name}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{store.gems}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1 bg-black/60 px-2.5 py-1.5 rounded-full">
              <div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center">
                <Coins className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="text-sm font-bold text-white">2.8m</span>
            </div>
            
            <div className="flex items-center gap-1 bg-black/60 px-2.5 py-1.5 rounded-full">
              <div className="w-4 h-4 rounded-full bg-red-400 flex items-center justify-center">
                <Timer className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="text-sm font-bold text-white">18/20</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-white/90 rounded-2xl shadow-lg flex items-center justify-center">
            <Ticket className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white drop-shadow-lg">My Coupons</h1>
            <p className="text-white/80 text-sm mt-1">Use them before they expire!</p>
          </div>
        </div>

        {/* Search and Filter Row */}
        <div className="mt-4 flex gap-2">
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
            onClick={() => setShowFilters(!showFilters)}
            className={`h-12 px-4 rounded-xl flex items-center gap-2 shadow-lg transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-blue-500 text-white'
                : 'bg-white/90 text-gray-600 hover:bg-white'
            }`}
          >
            <Filter className="w-5 h-5" />
            <span className="text-sm font-medium">Filter</span>
            {hasActiveFilters && (
              <div className="w-5 h-5 rounded-full bg-white text-blue-500 text-xs font-bold flex items-center justify-center">
                {[
                  statusFilter !== 'active',
                  daysFilter !== 'all'
                ].filter(Boolean).length}
              </div>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 bg-white/95 rounded-xl p-4 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Filters</h3>
              {(hasActiveFilters || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 font-medium hover:text-blue-700"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Status</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'active', label: 'Active', count: counts.active },
                  { value: 'used', label: 'Used', count: counts.used },
                  { value: 'expired', label: 'Expired', count: counts.expired },
                  { value: 'all', label: 'All Coupons', count: coupons.length }
                ].map((status) => (
                  <button
                    key={status.value}
                    onClick={() => setStatusFilter(status.value as FilterStatus)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
                      statusFilter === status.value
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {statusFilter === status.value && <Check className="w-4 h-4" />}
                      {status.label}
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/50">
                      {status.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Days Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Expires Within</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'all', label: 'Any Time' },
                  { value: '3days', label: '3 Days' },
                  { value: '7days', label: '7 Days' },
                  { value: '30days', label: '30 Days' }
                ].map((days) => (
                  <button
                    key={days.value}
                    onClick={() => setDaysFilter(days.value as DaysFilter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                      daysFilter === days.value
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {daysFilter === days.value && <Check className="w-4 h-4" />}
                    {days.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Coupon List */}
      <div className="px-4 space-y-4 mt-4">
        {filteredCoupons.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">No coupons found</h3>
            <p className="text-gray-600">
              Try adjusting your filters to see more coupons.
            </p>
            {(hasActiveFilters || searchQuery) && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          filteredCoupons.map((coupon) => (
            <div
              key={coupon.id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-200 ${
                coupon.isUsed || coupon.expiresIn === 0
                  ? 'opacity-60'
                  : 'hover:scale-[1.02]'
              }`}
            >
              <div className="relative p-4 flex items-center gap-4">
                {/* Left Border Decoration */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                  coupon.isUsed
                    ? 'bg-gradient-to-b from-gray-400 to-gray-500'
                    : coupon.expiresIn === 0
                    ? 'bg-gradient-to-b from-red-500 to-red-600'
                    : 'bg-gradient-to-b from-blue-500 to-blue-600'
                }`} />
                
                {/* Logo */}
                <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md">
                  <img
                    src={coupon.logo}
                    alt={coupon.brand}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-gray-800">{coupon.brand}</h3>
                    {coupon.isUsed && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                        Used
                      </span>
                    )}
                  </div>
                  <p className="text-blue-600 font-semibold">{coupon.discount}</p>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mt-2 ${
                    coupon.isUsed
                      ? 'bg-gray-100 text-gray-600'
                      : getExpiryColor(coupon.expiresIn)
                  }`}>
                    {getExpiryIcon(coupon.expiresIn)}
                    <span className="text-sm font-medium">
                      {getExpiryText(coupon.expiresIn)}
                    </span>
                  </div>
                </div>

                {/* Use Button */}
                <button 
                  onClick={() => handleUseCoupon(coupon)}
                  disabled={coupon.isUsed || coupon.expiresIn === 0}
                  className={`px-6 py-2 rounded-xl font-semibold flex items-center gap-2 transition-colors ${
                    coupon.isUsed || coupon.expiresIn === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {coupon.isUsed ? 'Used' : coupon.expiresIn === 0 ? 'Expired' : 'Use'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Border Decoration */}
              <div className={`h-1 ${
                coupon.isUsed
                  ? 'bg-gradient-to-r from-gray-400 to-gray-500'
                  : coupon.expiresIn === 0
                  ? 'bg-gradient-to-r from-red-500 to-red-600'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600'
              }`} />
            </div>
          ))
        )}
      </div>

      {/* QR Code Modal */}
      {selectedCoupon && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedCoupon(null)}
        >
          <div 
            className="bg-white w-[85%] max-w-sm rounded-3xl p-6 transform transition-all"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4">
                <img
                  src={selectedCoupon.logo}
                  alt={selectedCoupon.brand}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{selectedCoupon.brand}</h3>
              <p className="text-blue-600 font-semibold mt-1">{selectedCoupon.discount}</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <div className="aspect-square bg-white rounded-xl p-4 shadow-inner">
              <QRCode  
                  value={selectedCoupon.qrCode || "https://example.com"} 
                  size={150} 
                  className='w-full h-full object-contain' />
              </div>
              <div className="flex items-center justify-center gap-2 mt-4 text-gray-500">
                <QRCode  
                  value={selectedCoupon.qrCode || "https://example.com"} 
                  size={150} 
                  className='w-full h-full object-contain' />
                <span className="text-sm">Show this QR code to the cashier</span>
              </div>
            </div>

            <div className={`flex items-center gap-1.5 justify-center ${getExpiryColor(selectedCoupon.expiresIn)} rounded-full py-2 mb-6`}>
              {getExpiryIcon(selectedCoupon.expiresIn)}
              <span className="text-sm font-medium">
                {getExpiryText(selectedCoupon.expiresIn)}
              </span>
            </div>

            <button 
              onClick={() => setSelectedCoupon(null)}
              className="w-full bg-gray-100 py-3 rounded-xl text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}