import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product, CropCategory } from '../types';
import {
  Search,
  Filter,
  ArrowUpDown,
  MapPin,
  Heart,
  Scale,
  Sparkles,
  ShieldCheck,
  Check,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  SlidersHorizontal,
  Phone,
  MessageCircle,
  Lock,
} from 'lucide-react';

interface MarketplaceProps {
  onSelectProduct: (productId: string) => void;
  onOpenCompare: (productIds: string[]) => void;
  onOpenAddProduce: () => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  onSelectProduct,
  onOpenCompare,
  onOpenAddProduce,
}) => {
  const { products, currentUser, favourites, toggleFavourite, currentLanguage, t } = useApp();

  const isFarmer = currentUser.role === 'farmer';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [onlyOrganic, setOnlyOrganic] = useState(false);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'freshness' | 'proximity'>('proximity');
  const [compareList, setCompareList] = useState<string[]>([]);

  const categories: { label: string; value: string }[] = [
    { label: t('allCategories'), value: 'All' },
    { label: t('plantationCrops'), value: 'Plantation Crops' },
    { label: t('spices'), value: 'Spices' },
    { label: t('fruits'), value: 'Fruits' },
    { label: t('vegetables'), value: 'Vegetables' },
    { label: t('grains'), value: 'Grains & Pulses' },
  ];

  // Smart Match recommendations for Buyer
  const smartMatches = useMemo(() => {
    return products.filter((p) => p.status === 'active' && (p.isOrganic || p.quality === 'Grade A (Premium)')).slice(0, 3);
  }, [products]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (p.status !== 'active') return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q) || (p.nameKn && p.nameKn.toLowerCase().includes(q));
          const matchLoc = p.village.toLowerCase().includes(q) || p.district.toLowerCase().includes(q);
          const matchFarmer = p.farmerName.toLowerCase().includes(q);
          if (!matchName && !matchLoc && !matchFarmer) return false;
        }

        if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
        if (selectedDistrict !== 'All' && p.district !== selectedDistrict) return false;
        if (selectedGrade !== 'All' && !p.quality.includes(selectedGrade)) return false;
        if (onlyOrganic && !p.isOrganic) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.expectedPrice - b.expectedPrice;
        if (sortBy === 'price_desc') return b.expectedPrice - a.expectedPrice;
        if (sortBy === 'proximity') return (a.distanceKm || 99) - (b.distanceKm || 99);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, searchQuery, selectedCategory, selectedDistrict, selectedGrade, onlyOrganic, sortBy]);

  const handleToggleCompare = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompareList((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 produce listings at once.');
        return prev;
      }
      return [...prev, productId];
    });
  };

  const handleWhatsAppQuote = (prod: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanPhone = (prod.farmerPhone || '9481234567').replace(/\D/g, '').slice(-10);
    const msg = encodeURIComponent(
      `Namaskara ${prod.farmerName}, I found your listing for ${prod.name} (${prod.quantityAvailable} ${prod.unit} available) on HASIRU. I would like to request a quote and discuss purchase. Please connect.`
    );
    window.open(`https://wa.me/91${cleanPhone}?text=${msg}`, '_blank');
  };

  const handleCallFarmer = (prod: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanPhone = (prod.farmerPhone || '9481234567').replace(/\D/g, '').slice(-10);
    window.location.href = `tel:+91${cleanPhone}`;
  };

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      {/* Search & Hero Bar */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2EBDD] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-extrabold text-[#18352A]">
                Direct Harvest Marketplace 🛒
              </h2>
              {!isFarmer && (
                <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-600" />
                  Buyer Mode
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">
              Source verified produce directly from local coastal farmers in Dakshina Kannada & Udupi.
            </p>
          </div>

          {isFarmer ? (
            <button
              onClick={onOpenAddProduce}
              className="self-start md:self-auto bg-[#176B45] hover:bg-[#125537] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              + List Your Harvest
            </button>
          ) : (
            <div className="text-xs text-emerald-800 bg-[#E8F5EC] px-3 py-1.5 rounded-xl border border-[#C4D7C8] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#176B45]" />
              <span>Instant Call & WhatsApp quote requests available</span>
            </div>
          )}
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-11 pr-4 py-2.5 bg-[#F8FAF6] border border-[#C4D7C8] rounded-xl text-xs md:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#176B45]/30 focus:border-[#176B45]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.value
                  ? 'bg-[#176B45] text-white shadow-xs'
                  : 'bg-[#F1F5E9] text-[#18352A] hover:bg-[#E8F5EC]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filters and Sorting Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-[#F8FAF6] border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 font-medium cursor-pointer"
            >
              <option value="All">{t('allDistricts')}</option>
              <option value="Dakshina Kannada">{t('dakshinaKannada')}</option>
              <option value="Udupi">{t('udupi')}</option>
            </select>

            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="bg-[#F8FAF6] border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 font-medium cursor-pointer"
            >
              <option value="All">All Grades</option>
              <option value="Grade A">Grade A (Premium)</option>
              <option value="Grade B">Grade B (Standard)</option>
            </select>

            <button
              onClick={() => setOnlyOrganic(!onlyOrganic)}
              className={`px-3 py-1.5 rounded-lg font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                onlyOrganic
                  ? 'bg-[#E8B94D] text-[#18352A] border-[#E8B94D]'
                  : 'bg-[#F8FAF6] text-gray-700 border-gray-200'
              }`}
            >
              {onlyOrganic && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              <span>{t('organicCertified')}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">{t('sortBy')}:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#F8FAF6] border border-gray-200 rounded-lg px-2.5 py-1.5 text-[#176B45] font-bold cursor-pointer"
            >
              <option value="proximity">{t('proximity')}</option>
              <option value="price_asc">{t('priceLowHigh')}</option>
              <option value="price_desc">{t('priceHighLow')}</option>
              <option value="freshness">{t('freshness')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Floating Compare Action Bar when items selected */}
      {compareList.length > 0 && (
        <div className="bg-[#18352A] text-white p-3.5 rounded-xl shadow-xl flex items-center justify-between gap-4 sticky top-16 z-30 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-xs">
            <Scale className="w-4 h-4 text-[#E8B94D]" />
            <span>
              <strong>{compareList.length}</strong> items selected for side-by-side comparison
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCompareList([])}
              className="text-xs text-gray-300 hover:text-white px-2 py-1"
            >
              Clear
            </button>
            <button
              onClick={() => onOpenCompare(compareList)}
              className="bg-[#E8B94D] hover:bg-[#d8a83d] text-[#18352A] font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <span>{t('compareListings')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* AI Smart Match For You Section */}
      {selectedCategory === 'All' && !searchQuery && (
        <div className="bg-gradient-to-r from-[#E8F5EC] to-[#F1F8F4] p-4 rounded-2xl border border-[#C4D7C8] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#176B45]" />
              <h3 className="text-xs font-bold text-[#176B45] uppercase tracking-wide">
                Smart Direct Procurement Recommendations
              </h3>
            </div>
            <span className="text-[10px] text-gray-500 font-medium">
              Ranked by road distance in Dakshina Kannada & Udupi
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {smartMatches.map((prod) => (
              <div
                key={prod.id}
                onClick={() => onSelectProduct(prod.id)}
                className="bg-white p-3 rounded-xl border border-[#C4D7C8]/60 hover:border-[#176B45] hover:shadow-xs transition-all cursor-pointer flex items-center gap-3"
              >
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  className="w-14 h-14 rounded-lg object-cover shrink-0 border border-gray-100"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-gray-900 truncate">
                    {currentLanguage === 'kn' ? prod.nameKn || prod.name : prod.name}
                  </div>
                  <div className="text-[11px] text-gray-500 truncate">
                    {prod.farmerName} • {prod.village}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-extrabold text-[#176B45]">
                      ₹{prod.expectedPrice}/{prod.unit}
                    </span>
                    <span className="text-[9px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                      {prod.distanceKm} km away
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>Showing <strong>{filteredProducts.length}</strong> verified farmer listings</span>
        <span>Direct Farmgate • Zero Commission</span>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-[#E2EBDD]">
          <SlidersHorizontal className="w-10 h-10 mx-auto text-gray-300 mb-2" />
          <p className="text-sm font-semibold text-gray-600">No produce matching your filters.</p>
          <p className="text-xs text-gray-400 mt-1">Try relaxing your search terms or selecting another category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((prod) => {
            const isFav = favourites.includes(prod.id);
            const isCompared = compareList.includes(prod.id);

            return (
              <div
                key={prod.id}
                onClick={() => onSelectProduct(prod.id)}
                className="bg-white rounded-2xl border border-[#E2EBDD] overflow-hidden hover:shadow-lg transition-all group flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Image container */}
                  <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                    {/* Top badging */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="text-[10px] font-extrabold bg-[#176B45] text-white px-2 py-0.5 rounded-full shadow-xs">
                        {prod.quality}
                      </span>
                      {prod.isOrganic && (
                        <span className="text-[10px] font-extrabold bg-[#E8B94D] text-[#18352A] px-2 py-0.5 rounded-full shadow-xs">
                          Organic
                        </span>
                      )}
                    </div>

                    {/* Action buttons (Fav & Compare) */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleToggleCompare(prod.id, e)}
                        className={`p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                          isCompared
                            ? 'bg-[#E8B94D] text-[#18352A]'
                            : 'bg-white/80 hover:bg-white text-gray-700'
                        }`}
                        title="Compare produce"
                      >
                        <Scale className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavourite(prod.id);
                        }}
                        className={`p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                          isFav
                            ? 'bg-red-500 text-white'
                            : 'bg-white/80 hover:bg-white text-gray-700'
                        }`}
                        title="Save to favourites"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
                      </button>
                    </div>

                    {/* Price and Proximity over image */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                      <div>
                        <div className="text-[10px] text-gray-200">Asking Price</div>
                        <div className="text-xl font-extrabold tracking-tight">
                          ₹{prod.expectedPrice} <span className="text-xs font-normal">/ {prod.unit}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-[#E8F5EC] flex items-center gap-1 font-semibold">
                          <MapPin className="w-3 h-3 text-[#E8B94D]" />
                          {prod.distanceKm} km away
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-4 space-y-2.5">
                    <div>
                      <h3 className="font-bold text-base text-gray-900 group-hover:text-[#176B45] transition-colors line-clamp-1">
                        {currentLanguage === 'kn' ? prod.nameKn || prod.name : prod.name}
                      </h3>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        <span>Farmer: <strong>{prod.farmerName}</strong> • {prod.village}</span>
                      </div>
                    </div>

                    {/* Stock & MOQ info */}
                    <div className="grid grid-cols-2 gap-2 bg-[#F8FAF6] p-2.5 rounded-xl text-xs border border-[#E2EBDD]">
                      <div>
                        <span className="text-gray-400 text-[10px] block">{t('available')}</span>
                        <strong className="text-gray-800">{prod.quantityAvailable} {prod.unit}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] block">{t('minOrder')}</span>
                        <strong className="text-gray-800">{prod.minimumOrderQuantity} {prod.unit}</strong>
                      </div>
                    </div>

                    {/* Mandi benchmark price badge - ONLY SHOWN TO FARMERS! (Confidentiality Guard for Buyers) */}
                    {isFarmer && prod.mandiBenchmark && (
                      <div className="text-[11px] p-2 rounded-lg bg-[#E8F5EC] text-[#176B45] flex items-center justify-between">
                        <span className="truncate">APMC {prod.mandiBenchmark.marketName}:</span>
                        <span className="font-extrabold">
                          {prod.mandiBenchmark.diffPercent <= 0 ? '🟢 Fair / Under Mandi' : `+${prod.mandiBenchmark.diffPercent}% (Premium)`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions: Instant Buyer Connect (Call & WhatsApp) + View Details */}
                <div className="p-4 pt-0 space-y-2">
                  {/* Instant Buyer Connect Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={(e) => handleCallFarmer(prod, e)}
                      className="py-2 px-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      title="Direct phone call with farmer"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Call Farmer</span>
                    </button>

                    <button
                      onClick={(e) => handleWhatsAppQuote(prod, e)}
                      className="py-2 px-2.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      title="Request instant WhatsApp quotation"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp Quote</span>
                    </button>
                  </div>

                  {/* Primary View Details / Bid button */}
                  <button
                    onClick={() => onSelectProduct(prod.id)}
                    className="w-full bg-[#176B45] hover:bg-[#125537] text-white font-bold text-xs py-2 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{t('viewDetails')} & Send Bid</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
