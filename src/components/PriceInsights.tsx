import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MandiChart } from './MandiChart';
import {
  LineChart,
  ShieldCheck,
  Building,
  Info,
  Calendar,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Sparkles,
  Lock,
  ArrowRight,
} from 'lucide-react';

interface PriceInsightsProps {
  onOpenPriceAdvisor: () => void;
  onNavigateToMarketplace?: () => void;
}

export const PriceInsights: React.FC<PriceInsightsProps> = ({
  onOpenPriceAdvisor,
  onNavigateToMarketplace,
}) => {
  const { mandiPrices, currentUser, switchUser, currentLanguage, t } = useApp();

  const isFarmer = currentUser.role === 'farmer';

  const [selectedCommodityId, setSelectedCommodityId] = useState<string>('mandi-4'); // Tomato default to showcase +12% forecast
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState<'All' | 'Dakshina Kannada' | 'Udupi'>('All');
  const [farmerSamplePrice, setFarmerSamplePrice] = useState<number>(24);
  const [farmerSampleQty, setFarmerSampleQty] = useState<number>(500);

  // If user is Buyer, enforce the Farmer Confidentiality Guard!
  if (!isFarmer) {
    return (
      <div className="py-12 max-w-2xl mx-auto px-4 text-center space-y-5 animate-in fade-in">
        <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-md border-2 border-amber-300">
          <Lock className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            Confidentiality Guard Active
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#18352A]">
            Price Analytics are Hidden from Buyers
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
            As specified in the HASIRU architecture to prevent unfair bargaining, <strong>APMC mandi daily spreads, margin projections, and 7-day predictive forecasts</strong> are reserved exclusively for registered Farmers.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 text-left text-xs space-y-2 max-w-md mx-auto shadow-xs">
          <div className="font-bold text-gray-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#176B45]" />
            <span>How Buyers Negotiate Fairly:</span>
          </div>
          <p className="text-gray-600 text-[11px] leading-relaxed">
            Buyers can review the farmer's asking price on the Marketplace and submit direct purchase bids or contact the farmer directly via phone or WhatsApp.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => switchUser('farmer-1')}
            className="w-full sm:w-auto bg-[#176B45] hover:bg-[#125537] text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Switch to Farmer Demo (Ramesh Bhat) to Unlock</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          {onNavigateToMarketplace && (
            <button
              onClick={onNavigateToMarketplace}
              className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs px-5 py-3 rounded-xl transition-colors cursor-pointer"
            >
              Browse Marketplace
            </button>
          )}
        </div>
      </div>
    );
  }

  const filteredPrices = mandiPrices.filter((m) => {
    if (selectedDistrictFilter === 'All') return true;
    return m.district === selectedDistrictFilter;
  });

  const activeMandi = mandiPrices.find((m) => m.id === selectedCommodityId) || mandiPrices[0];

  const priceDiff = farmerSamplePrice - activeMandi.modalPrice;
  const percentDiff = Math.round((priceDiff / activeMandi.modalPrice) * 100);
  const middlemanCommissionSaved = Math.round((farmerSampleQty * farmerSamplePrice) * 0.09);

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2EBDD] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#E8F5EC] text-[#176B45]">
                <LineChart className="w-5 h-5" />
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#18352A]">
                {t('mandiTrackerTitle')} 📊
              </h2>
            </div>
            <p className="text-xs md:text-sm text-gray-500 mt-1 max-w-2xl">
              {t('mandiTrackerDesc')} APMC mandi data with predictive 7-day price forecasting for small farmers in Dakshina Kannada & Udupi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPriceAdvisor}
              className="bg-[#176B45] hover:bg-[#125537] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#E8B94D]" />
              <span>Launch AI Price Advisor</span>
            </button>
          </div>
        </div>

        {/* District Filter tabs */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100 text-xs">
          <span className="text-gray-400 font-semibold uppercase text-[10px]">{t('filterByDistrict')}:</span>
          {(['All', 'Dakshina Kannada', 'Udupi'] as const).map((dist) => (
            <button
              key={dist}
              onClick={() => setSelectedDistrictFilter(dist)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedDistrictFilter === dist
                  ? 'bg-[#176B45] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {dist === 'All' ? t('allDistricts') : dist}
            </button>
          ))}
        </div>
      </div>

      {/* Commodity Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {filteredPrices.map((m) => {
          const isSelected = m.id === selectedCommodityId;
          return (
            <button
              key={m.id}
              onClick={() => {
                setSelectedCommodityId(m.id);
                setFarmerSamplePrice(m.modalPrice);
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#176B45] text-white border-[#176B45] shadow-md'
                  : 'bg-white text-gray-800 border-[#E2EBDD] hover:bg-[#E8F5EC]/40'
              }`}
            >
              <div className={`text-[10px] uppercase font-bold truncate ${isSelected ? 'text-[#E8B94D]' : 'text-gray-400'}`}>
                {m.category}
              </div>
              <div className="font-extrabold text-xs md:text-sm truncate mt-0.5">
                {currentLanguage === 'kn' ? m.commodityKn : m.commodity}
              </div>
              <div className={`text-base font-extrabold mt-1 ${isSelected ? 'text-white' : 'text-[#176B45]'}`}>
                ₹{m.modalPrice} <span className="text-[10px] font-normal opacity-80">/{m.unit}</span>
              </div>
              {m.sevenDayForecast && (
                <div className={`text-[9px] font-bold mt-1 ${isSelected ? 'text-[#E8B94D]' : 'text-emerald-700'}`}>
                  ▲ +{m.sevenDayForecast.projectedChangePercent}% 7d forecast
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Feature Highlight: 7-Day Price Forecast (matching DevHost slide exact specification) */}
      {activeMandi.sevenDayForecast && (
        <div className="bg-gradient-to-r from-[#176B45] to-[#257A50] text-white p-5 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-[#E8B94D] text-[#18352A] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                7-Day Price Forecast
              </span>
              <span className="text-xs text-[#E8F5EC] font-bold">
                {activeMandi.commodity} ({activeMandi.market})
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-extrabold text-white">
              {activeMandi.commodity} prices projected to rise +{activeMandi.sevenDayForecast.projectedChangePercent}%
            </h3>
            <p className="text-xs text-[#E8F5EC] max-w-2xl leading-relaxed">
              {activeMandi.sevenDayForecast.explanation}
            </p>
          </div>

          <div className="bg-black/25 p-3.5 rounded-xl border border-white/20 text-center shrink-0">
            <span className="text-[10px] text-gray-300 uppercase block font-semibold">Forecast Modal Target</span>
            <span className="text-2xl font-black text-[#E8B94D]">
              ₹{activeMandi.sevenDayForecast.forecastPrice}
              <span className="text-xs font-normal text-white"> / {activeMandi.unit}</span>
            </span>
            <span className="text-[10px] text-emerald-300 block font-bold mt-0.5">
              Current: ₹{activeMandi.modalPrice}
            </span>
          </div>
        </div>
      )}

      {/* Main Focus Card: Selected APMC Market Details & SVG Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Trend Chart & APMC Metrics (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-[#E2EBDD] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900">
                  {currentLanguage === 'kn' ? activeMandi.commodityKn : activeMandi.commodity}
                </h3>
                <span className="text-[10px] bg-[#E8F5EC] text-[#176B45] font-extrabold px-2 py-0.5 rounded-full border border-[#4F9B68]/30">
                  {activeMandi.district}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Official APMC Yard: <strong>{activeMandi.market}</strong>
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md">
                {activeMandi.dataStatus}
              </span>
              <div className="text-[10px] text-gray-400 mt-0.5">{activeMandi.priceDate}</div>
            </div>
          </div>

          {/* 3 Metric blocks */}
          <div className="grid grid-cols-3 gap-3 bg-[#F8FAF6] p-4 rounded-xl border border-[#E2EBDD]">
            <div className="border-r border-gray-200 pr-2">
              <span className="text-[10px] text-gray-400 uppercase font-bold block">{t('minPrice')}</span>
              <div className="text-lg font-bold text-gray-700">₹{activeMandi.minPrice}</div>
              <span className="text-[10px] text-gray-400">Lowest lot trade</span>
            </div>

            <div className="border-r border-gray-200 pr-2">
              <span className="text-[10px] text-[#176B45] uppercase font-extrabold block">{t('modalPrice')}</span>
              <div className="text-2xl font-extrabold text-[#176B45]">₹{activeMandi.modalPrice}</div>
              <span className="text-[10px] text-[#4F9B68] font-medium">Standard benchmark</span>
            </div>

            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold block">{t('maxPrice')}</span>
              <div className="text-lg font-bold text-gray-700">₹{activeMandi.maxPrice}</div>
              <span className="text-[10px] text-gray-400">Top Grade A lot</span>
            </div>
          </div>

          {/* SVG 7-Day Trend Chart */}
          <div className="pt-2">
            <MandiChart
              data={activeMandi.history7Days}
              commodityName={currentLanguage === 'kn' ? activeMandi.commodityKn : activeMandi.commodity}
              unit={activeMandi.unit}
              color="#176B45"
              height={200}
            />
          </div>

          <div className="bg-[#E8F5EC]/50 p-3 rounded-xl border border-[#C4D7C8]/60 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#176B45]">
              <Info className="w-3.5 h-3.5" />
              <span>Attribution & Market Dynamics</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              <strong>Source:</strong> {activeMandi.source}. Note: APMC mandi auction reference prices represent wholesale lot averages. Final direct farmgate prices may differ based on specific moisture grade, kernel size, sorting quality, and farmgate vs destination delivery terms.
            </p>
          </div>
        </div>

        {/* Right: Farmer's Asking Price Comparison Calculator (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-[#E2EBDD] shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-[#18352A] flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#176B45]" />
              <span>{t('diffVsMandi')}</span>
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Test your asking price against current {activeMandi.market} rates
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Your Expected Price (₹ / {activeMandi.unit}):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                <input
                  type="number"
                  value={farmerSamplePrice}
                  onChange={(e) => setFarmerSamplePrice(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-3 py-2 bg-[#F8FAF6] border border-gray-200 rounded-xl font-bold text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#176B45]/30 focus:border-[#176B45]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Quantity Available ({activeMandi.unit}):
              </label>
              <input
                type="number"
                value={farmerSampleQty}
                onChange={(e) => setFarmerSampleQty(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-[#F8FAF6] border border-gray-200 rounded-xl font-bold text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#176B45]/30 focus:border-[#176B45]"
              />
            </div>

            {/* Calculated Spread Card */}
            <div className={`p-4 rounded-xl border text-xs space-y-2 ${
              percentDiff >= 0
                ? 'bg-[#E8F5EC] border-[#C4D7C8] text-[#176B45]'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-center justify-between font-bold">
                <span>Spread vs APMC Modal:</span>
                <span className="text-sm">
                  {percentDiff >= 0 ? `+₹${priceDiff} (+${percentDiff}%)` : `-₹${Math.abs(priceDiff)} (${percentDiff}%)`}
                </span>
              </div>
              <p className="text-[11px] opacity-90 leading-relaxed">
                {percentDiff > 10
                  ? `Your price is +${percentDiff}% above APMC modal. Ensure you highlight Grade A quality or organic status to coastal buyers.`
                  : percentDiff >= 0
                  ? `Your price matches typical coastal APMC trading levels. Highly competitive for direct hotel/retailer buyers!`
                  : `Your price is below APMC modal rate. Consider raising it slightly using our AI Price Advisor.`}
              </p>
            </div>

            {/* Commission Saved Box */}
            <div className="bg-[#18352A] text-white p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#E8B94D] font-bold">Direct Selling Advantage</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">HASIRU Platform</span>
              </div>
              <div className="text-2xl font-extrabold text-[#E8B94D]">
                ₹{middlemanCommissionSaved.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-[#E8F5EC] leading-relaxed">
                Estimated 8-10% middleman commission & APMC yard charges saved on this {farmerSampleQty} {activeMandi.unit} batch by dealing directly with verified buyers!
              </p>
            </div>

            <button
              onClick={onOpenPriceAdvisor}
              className="w-full bg-[#176B45] hover:bg-[#125537] text-white font-bold text-xs py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E8B94D]" />
              <span>Get Detailed AI Price Advisor Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
