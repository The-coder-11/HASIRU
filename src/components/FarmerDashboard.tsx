import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MandiChart } from './MandiChart';
import {
  Package,
  Layers,
  Inbox,
  ShoppingBag,
  TrendingUp,
  PlusCircle,
  Sparkles,
  Mic,
  ArrowUpRight,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Trash2,
  PauseCircle,
  PlayCircle,
  Building,
  Scale,
  BadgePercent,
  Phone,
  ShieldCheck,
} from 'lucide-react';

interface FarmerDashboardProps {
  onOpenAddProduce: () => void;
  onOpenVoiceAssistant: () => void;
  onOpenPriceAdvisor: () => void;
  onOpenOfferComparison: () => void;
  onSelectProduct: (productId: string) => void;
  onNavigateToTab: (tab: any) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  onOpenAddProduce,
  onOpenVoiceAssistant,
  onOpenPriceAdvisor,
  onOpenOfferComparison,
  onSelectProduct,
  onNavigateToTab,
}) => {
  const {
    currentUser,
    products,
    enquiries,
    orders,
    mandiPrices,
    acceptEnquiryAndCreateOrder,
    rejectEnquiry,
    toggleProductStatus,
    deleteProduct,
    currentLanguage,
    t,
  } = useApp();

  const [selectedCropChart, setSelectedCropChart] = useState<string>('mandi-1');

  // Filter farmer's own products and enquiries
  const farmerProducts = products.filter((p) => p.farmerId === currentUser.uid);
  const activeProducts = farmerProducts.filter((p) => p.status === 'active');
  const totalStock = farmerProducts.reduce((sum, p) => sum + p.quantityAvailable, 0);

  const farmerEnquiries = enquiries.filter((e) => e.farmerId === currentUser.uid);
  const pendingEnquiries = farmerEnquiries.filter((e) => e.status === 'pending');

  const farmerOrders = orders.filter((o) => o.farmerId === currentUser.uid);
  const inProgressOrders = farmerOrders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled');
  const totalNetEarnings = farmerOrders
    .filter((o) => o.status === 'accepted' || o.status === 'ready_for_pickup' || o.status === 'completed')
    .reduce((sum, o) => sum + o.estimatedNetProceeds, 0);

  const currentMandiPrice = mandiPrices.find((m) => m.id === selectedCropChart) || mandiPrices[0];

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#176B45] via-[#1F7A50] to-[#2D8F60] text-white rounded-2xl p-5 md:p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(232,185,77,0.2),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#E8B94D] text-xs font-bold uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full">
                {currentUser.district} • {currentUser.village}
              </span>
              <span className="text-xs text-[#E8F5EC] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E8B94D]" /> Verified Direct Farmer
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {t('greetingFarmer')}, {currentUser.name}! 🌾
            </h2>
            <p className="text-[#E8F5EC] text-xs md:text-sm mt-1 max-w-xl">
              {currentUser.businessOrFarmName || 'Direct Agriculture Hub'}. Manage listings, inspect local APMC rates, and receive direct buyer bids with zero broker commission.
            </p>
          </div>

          {/* Primary Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenAddProduce}
              className="bg-[#E8B94D] hover:bg-[#d8a83d] text-[#18352A] font-bold text-xs md:text-sm px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#18352A]" />
              <span>{t('addProduce')}</span>
            </button>
            <button
              onClick={onOpenVoiceAssistant}
              className="bg-white/15 hover:bg-white/25 text-white font-semibold text-xs md:text-sm px-3.5 py-2.5 rounded-xl border border-white/20 flex items-center gap-2 backdrop-blur-xs transition-colors cursor-pointer"
            >
              <Mic className="w-4 h-4 text-[#E8B94D]" />
              <span className="font-kannada">ಧ್ವನಿ ಮೂಲಕ ಸೇರಿಸಿ</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        {/* Active Listings */}
        <div className="bg-white rounded-xl p-4 border border-[#E2EBDD] shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-medium">{t('activeListings')}</span>
            <div className="w-7 h-7 rounded-lg bg-[#E8F5EC] flex items-center justify-center text-[#176B45]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#18352A]">{activeProducts.length}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">
            {farmerProducts.length} total in inventory
          </div>
        </div>

        {/* Total Stock Available */}
        <div className="bg-white rounded-xl p-4 border border-[#E2EBDD] shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-medium">{t('totalStockAvailable')}</span>
            <div className="w-7 h-7 rounded-lg bg-[#E8F5EC] flex items-center justify-center text-[#176B45]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#18352A]">
            {totalStock.toLocaleString('en-IN')} <span className="text-xs font-normal text-gray-500">kg</span>
          </div>
          <div className="text-[11px] text-[#4F9B68] font-medium mt-0.5">
            Across {farmerProducts.length} crops
          </div>
        </div>

        {/* Buyer Enquiries */}
        <div className="bg-white rounded-xl p-4 border border-[#E2EBDD] shadow-xs cursor-pointer hover:border-[#176B45] transition-colors"
          onClick={() => onNavigateToTab('orders')}
        >
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-medium">{t('buyerEnquiries')}</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-[#E8B94D]">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#18352A] flex items-center gap-1.5">
            <span>{pendingEnquiries.length}</span>
            {pendingEnquiries.length > 0 && (
              <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">New</span>
            )}
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">
            {farmerEnquiries.length} all-time enquiries
          </div>
        </div>

        {/* Active In-Progress Orders */}
        <div className="bg-white rounded-xl p-4 border border-[#E2EBDD] shadow-xs cursor-pointer hover:border-[#176B45] transition-colors"
          onClick={() => onNavigateToTab('orders')}
        >
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-medium">{t('inProgressOrders')}</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#18352A]">{inProgressOrders.length}</div>
          <div className="text-[11px] text-[#4F9B68] font-medium mt-0.5">
            Awaiting pickup / delivery
          </div>
        </div>

        {/* Direct Earnings / Proceeds */}
        <div className="bg-white rounded-xl p-4 border border-[#E2EBDD] shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-medium">{t('estimatedProceeds')}</span>
            <div className="w-7 h-7 rounded-lg bg-[#E8F5EC] flex items-center justify-center text-[#176B45]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#176B45]">
            ₹{totalNetEarnings.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-amber-700 font-medium mt-0.5 flex items-center gap-1">
            <BadgePercent className="w-3 h-3" /> 0% middleman cut
          </div>
        </div>
      </div>

      {/* AI Tools Quick Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={onOpenPriceAdvisor}
          className="bg-white hover:bg-[#E8F5EC]/40 p-3.5 rounded-xl border border-[#C4D7C8] flex items-center gap-3 transition-all text-left shadow-2xs group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#E8F5EC] text-[#176B45] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-[#E8B94D]" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#18352A] flex items-center gap-1">
              <span>{t('priceAdvisor')}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#176B45]" />
            </div>
            <div className="text-[11px] text-gray-500">
              Optimal selling price based on DK & Udupi APMC trends
            </div>
          </div>
        </button>

        <button
          onClick={onOpenVoiceAssistant}
          className="bg-white hover:bg-[#E8F5EC]/40 p-3.5 rounded-xl border border-[#C4D7C8] flex items-center gap-3 transition-all text-left shadow-2xs group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Mic className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#18352A] flex items-center gap-1">
              <span>{t('voiceAssistantName')}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#176B45]" />
            </div>
            <div className="text-[11px] text-gray-500">
              Kannada speech listing for easy hands-free harvest entry
            </div>
          </div>
        </button>

        <button
          onClick={onOpenOfferComparison}
          className="bg-white hover:bg-[#E8F5EC]/40 p-3.5 rounded-xl border border-[#C4D7C8] flex items-center gap-3 transition-all text-left shadow-2xs group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Scale className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#18352A] flex items-center gap-1">
              <span>{t('offerComparison')}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#176B45]" />
            </div>
            <div className="text-[11px] text-gray-500">
              Net proceeds calculator comparing multiple buyer bids
            </div>
          </div>
        </button>
      </div>

      {/* Middle Grid: APMC Market Trends & Pending Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Mandi Trends (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-[#E2EBDD] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-sm font-bold text-[#18352A]">
                  {t('marketSnapshot')}
                </h3>
              </div>
              <p className="text-[11px] text-gray-500">
                Official APMC daily benchmark prices from Dakshina Kannada & Udupi
              </p>
            </div>

            {/* Crop selector pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {mandiPrices.slice(0, 4).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedCropChart(m.id)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCropChart === m.id
                      ? 'bg-[#176B45] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {currentLanguage === 'kn' ? m.commodityKn : m.commodity}
                </button>
              ))}
            </div>
          </div>

          {/* Current selected Mandi stats */}
          <div className="grid grid-cols-3 gap-2 bg-[#F8FAF6] p-3 rounded-xl border border-[#E2EBDD]">
            <div>
              <div className="text-[10px] text-gray-500 uppercase font-semibold">
                {t('modalPrice')}
              </div>
              <div className="text-lg font-extrabold text-[#176B45]">
                ₹{currentMandiPrice.modalPrice}/{currentMandiPrice.unit}
              </div>
              <div className="text-[10px] text-gray-400 truncate">
                {currentMandiPrice.market}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-gray-500 uppercase font-semibold">
                Min - Max Range
              </div>
              <div className="text-sm font-bold text-gray-800">
                ₹{currentMandiPrice.minPrice} - ₹{currentMandiPrice.maxPrice}
              </div>
              <div className="text-[10px] text-gray-400">
                Spread: ₹{currentMandiPrice.maxPrice - currentMandiPrice.minPrice}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-gray-500 uppercase font-semibold">
                Status & Source
              </div>
              <span className="inline-block text-[9px] font-bold bg-[#E8F5EC] text-[#176B45] px-1.5 py-0.5 rounded border border-[#4F9B68]/30">
                {currentMandiPrice.dataStatus}
              </span>
              <div className="text-[9px] text-gray-400 truncate mt-0.5">
                {currentMandiPrice.source}
              </div>
            </div>
          </div>

          {/* 7-Day Forecast Callout (Exact feature from DevHost slide) */}
          {currentMandiPrice.sevenDayForecast && (
            <div className="bg-gradient-to-r from-amber-500/10 via-[#E8F5EC] to-emerald-500/10 p-2.5 rounded-xl border border-[#4F9B68]/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#176B45]">
                <TrendingUp className="w-3.5 h-3.5 text-[#E8B94D]" />
                <span>
                  7-Day AI Forecast: {currentMandiPrice.commodity} projected to rise +{currentMandiPrice.sevenDayForecast.projectedChangePercent}% (Target: ₹{currentMandiPrice.sevenDayForecast.forecastPrice}/{currentMandiPrice.unit})
                </span>
              </div>
              <span className="text-[10px] bg-[#176B45] text-white font-bold px-2 py-0.5 rounded-full shrink-0 hidden sm:inline">
                Confidential to Farmer
              </span>
            </div>
          )}

          {/* Render Chart */}
          <MandiChart
            data={currentMandiPrice.history7Days}
            commodityName={currentLanguage === 'kn' ? currentMandiPrice.commodityKn : currentMandiPrice.commodity}
            unit={currentMandiPrice.unit}
            color="#176B45"
            height={190}
          />

          <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100 text-gray-500">
            <span>Market yards: Mangaluru, Puttur CAMPCO, Bantwal, Udupi, Kundapura</span>
            <button
              onClick={() => onNavigateToTab('price_insights')}
              className="text-[#176B45] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Rates</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right Column: Pending Enquiries & Quick Action (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-[#E2EBDD] shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
              <div>
                <h3 className="text-sm font-bold text-[#18352A]">
                  {t('buyerEnquiries')}
                </h3>
                <p className="text-[11px] text-gray-500">
                  Direct purchase bids requiring your approval
                </p>
              </div>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                {pendingEnquiries.length} Pending
              </span>
            </div>

            {pendingEnquiries.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs">
                <Inbox className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                No pending buyer bids at this moment.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingEnquiries.slice(0, 2).map((enq) => (
                  <div
                    key={enq.id}
                    className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50/70 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-amber-700" />
                          <span>{enq.buyerOrg || enq.buyerName}</span>
                        </div>
                        <div className="text-[11px] text-gray-600 mt-0.5">
                          For: <span className="font-semibold text-gray-800">{enq.productName}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-extrabold text-[#176B45]">
                          ₹{enq.offeredPrice}/{enq.unit}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          Qty: {enq.requestedQuantity} {enq.unit}
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-gray-600 bg-white/80 p-2 rounded-lg my-2 border border-amber-100 italic">
                      "{enq.message}"
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-500 mb-2">
                      <span>Logistics: <strong>{enq.transportPreference}</strong></span>
                      <span className="font-bold text-gray-900">
                        Total: ₹{enq.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Accept / Reject actions */}
                    <div className="flex items-center gap-2 pt-1 border-t border-amber-200/60">
                      <button
                        onClick={() => acceptEnquiryAndCreateOrder(enq.id)}
                        className="flex-1 bg-[#176B45] hover:bg-[#125537] text-white text-xs font-bold py-1.5 rounded-lg flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{t('acceptOffer')}</span>
                      </button>
                      <button
                        onClick={() => rejectEnquiry(enq.id)}
                        className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{t('rejectOffer')}</span>
                      </button>
                    </div>
                  </div>
                ))}

                {pendingEnquiries.length > 2 && (
                  <button
                    onClick={() => onNavigateToTab('orders')}
                    className="w-full text-center text-xs text-[#176B45] font-bold py-1 hover:underline"
                  >
                    View all {pendingEnquiries.length} enquiries →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Active Local Buyers Looking for Produce */}
          <div className="bg-white rounded-2xl p-5 border border-[#E2EBDD] shadow-xs">
            <h3 className="text-sm font-bold text-[#18352A] mb-1">
              {t('nearbyBuyers')}
            </h3>
            <p className="text-[11px] text-gray-500 mb-3">
              Procurement partners active in Dakshina Kannada & Udupi
            </p>

            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-800">Hotel Ocean Pearl Kitchens</div>
                  <div className="text-[10px] text-gray-500">Kodialbail, Mangaluru • Needs 300kg Coconut weekly</div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  Regular Buyer
                </span>
              </div>

              <div className="p-2.5 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-800">Coastal Fresh Supermarket</div>
                  <div className="text-[10px] text-gray-500">Manipal Rd, Udupi • Needs 150kg Arecanut & Spices</div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  High Rating
                </span>
              </div>

              <div className="p-2.5 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-800">Mangaluru Bunder Agro-Trading</div>
                  <div className="text-[10px] text-gray-500">Old Port, Mangaluru • Needs Paddy & Cashew raw nuts</div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  Bulk Buyer
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Farmer's Active Listings Table / Cards */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2EBDD] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm md:text-base font-bold text-[#18352A]">
              My Current Produce Listings ({farmerProducts.length})
            </h3>
            <p className="text-xs text-gray-500">
              Manage stock, update pricing, or pause listings when harvest is sold
            </p>
          </div>
          <button
            onClick={onOpenAddProduce}
            className="flex items-center gap-1.5 bg-[#176B45] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#125537] shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t('addProduce')}</span>
          </button>
        </div>

        {farmerProducts.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <Package className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            <p className="text-sm font-semibold text-gray-600">No active produce listed yet.</p>
            <p className="text-xs text-gray-400 mt-1">
              Add your harvest now to get discovered by coastal hotels, retailers, and wholesalers.
            </p>
            <button
              onClick={onOpenAddProduce}
              className="mt-3 bg-[#176B45] text-white px-4 py-2 rounded-lg text-xs font-bold"
            >
              List Your First Crop
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {farmerProducts.map((prod) => {
              const isPaused = prod.status === 'paused';
              const isSoldOut = prod.status === 'sold_out';

              return (
                <div
                  key={prod.id}
                  className={`rounded-xl border p-3.5 flex flex-col justify-between transition-all ${
                    isSoldOut
                      ? 'bg-gray-50 border-gray-200 opacity-60'
                      : isPaused
                      ? 'bg-amber-50/30 border-amber-200'
                      : 'bg-white border-[#E2EBDD] hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="relative rounded-lg overflow-hidden h-36 mb-3 bg-gray-100">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          prod.status === 'active'
                            ? 'bg-emerald-600 text-white'
                            : prod.status === 'paused'
                            ? 'bg-amber-600 text-white'
                            : 'bg-gray-700 text-white'
                        }`}>
                          {prod.status.toUpperCase()}
                        </span>
                        {prod.isOrganic && (
                          <span className="text-[10px] font-bold bg-[#E8B94D] text-[#18352A] px-2 py-0.5 rounded-full">
                            Organic
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-white text-xs font-extrabold px-2 py-1 rounded">
                        ₹{prod.expectedPrice}/{prod.unit}
                      </div>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 line-clamp-1">
                          {currentLanguage === 'kn' ? prod.nameKn || prod.name : prod.name}
                        </h4>
                        <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#4F9B68]" />
                          <span>{prod.village}, {prod.district}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                        {prod.quality}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-600 my-2 pt-2 border-t border-gray-100">
                      <span>Available: <strong className="text-gray-900">{prod.quantityAvailable} {prod.unit}</strong></span>
                      <span>Min Order: <strong>{prod.minimumOrderQuantity} {prod.unit}</strong></span>
                    </div>

                    {prod.mandiBenchmark && (
                      <div className="text-[10px] bg-[#E8F5EC] text-[#176B45] p-1.5 rounded flex items-center justify-between mb-2">
                        <span>APMC {prod.mandiBenchmark.marketName}:</span>
                        <span className="font-bold">
                          {prod.mandiBenchmark.diffPercent >= 0 ? '+' : ''}{prod.mandiBenchmark.diffPercent}% vs Mandi
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Listing Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                    <button
                      onClick={() => onSelectProduct(prod.id)}
                      className="text-[#176B45] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t('viewDetails')}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleProductStatus(prod.id)}
                        className="text-gray-500 hover:text-amber-600 p-1"
                        title={isPaused ? 'Resume Listing' : 'Pause Listing'}
                      >
                        {isPaused ? <PlayCircle className="w-4 h-4 text-emerald-600" /> : <PauseCircle className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => deleteProduct(prod.id)}
                        className="text-gray-400 hover:text-red-600 p-1"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
