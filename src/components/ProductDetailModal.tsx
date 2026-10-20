import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import {
  X,
  MapPin,
  ShieldCheck,
  Calendar,
  Layers,
  Heart,
  Send,
  Building,
  Phone,
  Scale,
  Truck,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MessageCircle,
  Lock,
} from 'lucide-react';

interface ProductDetailModalProps {
  productId: string | null;
  onClose: () => void;
  onOfferSubmitted?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  productId,
  onClose,
  onOfferSubmitted,
}) => {
  const { products, currentUser, favourites, toggleFavourite, submitEnquiry, currentLanguage, t } = useApp();

  const isFarmer = currentUser.role === 'farmer';
  const product = products.find((p) => p.id === productId);

  const [requestedQty, setRequestedQty] = useState<number>(product?.minimumOrderQuantity || 100);
  const [offeredPrice, setOfferedPrice] = useState<number>(product?.expectedPrice || 40);
  const [transportPreference, setTransportPreference] = useState<'Buyer Pick-up' | 'Farmer Deliver' | 'Shared Logistics'>('Buyer Pick-up');
  const [message, setMessage] = useState('We would like to procure this batch. Please confirm pickup date.');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!productId || !product) return null;

  const isFav = favourites.includes(product.id);
  const totalValue = requestedQty * offeredPrice;

  const cleanPhone = (product.farmerPhone || '9481234567').replace(/\D/g, '').slice(-10);

  const handleCallFarmer = () => {
    window.location.href = `tel:+91${cleanPhone}`;
  };

  const handleWhatsAppQuote = () => {
    const msg = encodeURIComponent(
      `Namaskara ${product.farmerName}, I am reviewing your listing for ${product.name} on HASIRU. I would like to request a quote for ${requestedQty} ${product.unit} at ₹${offeredPrice}/${product.unit}. Please connect.`
    );
    window.open(`https://wa.me/91${cleanPhone}?text=${msg}`, '_blank');
  };

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (requestedQty <= 0) {
      setError('Quantity must be greater than zero.');
      return;
    }
    if (requestedQty > product.quantityAvailable) {
      setError(`Requested quantity exceeds available stock (${product.quantityAvailable} ${product.unit}).`);
      return;
    }
    if (requestedQty < product.minimumOrderQuantity) {
      setError(`Minimum order quantity for this crop is ${product.minimumOrderQuantity} ${product.unit}.`);
      return;
    }

    submitEnquiry({
      productId: product.id,
      productName: product.name,
      buyerId: currentUser.uid,
      buyerName: currentUser.name,
      buyerPhone: currentUser.phone,
      buyerOrg: currentUser.businessOrFarmName || (currentUser.role === 'buyer' ? 'Direct Buyer' : 'Independent Trader'),
      farmerId: product.farmerId,
      farmerName: product.farmerName,
      requestedQuantity: requestedQty,
      unit: product.unit,
      offeredPrice,
      totalAmount: totalValue,
      message,
      transportPreference,
    });

    setSubmitted(true);
    setTimeout(() => {
      if (onOfferSubmitted) onOfferSubmitted();
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E2EBDD] animate-in fade-in zoom-in-95 duration-200">
        {/* Top Image Banner */}
        <div className="relative h-60 sm:h-72 w-full bg-gray-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />

          {/* Close & Fav buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => toggleFavourite(product.id)}
              className={`p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                isFav ? 'bg-red-500 text-white' : 'bg-white/80 hover:bg-white text-gray-800'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Badges on Image */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
            <span className="text-xs font-extrabold bg-[#176B45] text-white px-2.5 py-0.5 rounded-full shadow-xs">
              {product.quality}
            </span>
            {product.isOrganic && (
              <span className="text-xs font-extrabold bg-[#E8B94D] text-[#18352A] px-2.5 py-0.5 rounded-full shadow-xs">
                Naturally Grown / Organic
              </span>
            )}
          </div>

          {/* Title & Price on Image */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="text-xs text-[#E8B94D] uppercase font-bold tracking-wider">
              {product.category} • {product.district}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold leading-tight mt-0.5">
              {currentLanguage === 'kn' ? product.nameKn || product.name : product.name}
            </h2>
            <div className="flex items-center justify-between mt-1 text-xs">
              <div className="flex items-center gap-1.5 text-gray-200">
                <MapPin className="w-3.5 h-3.5 text-[#E8B94D]" />
                <span>{product.village}, {product.district} • ~{product.distanceKm} km away</span>
              </div>
              <div className="text-xl font-black text-[#E8B94D]">
                ₹{product.expectedPrice} <span className="text-xs font-normal text-white">/ {product.unit}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 md:p-6 space-y-5">
          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F8FAF6] p-3.5 rounded-2xl border border-[#E2EBDD] text-xs">
            <div>
              <span className="text-gray-400 text-[10px] uppercase font-bold block">{t('available')}</span>
              <strong className="text-gray-900 text-sm">{product.quantityAvailable} {product.unit}</strong>
            </div>
            <div>
              <span className="text-gray-400 text-[10px] uppercase font-bold block">{t('minOrder')}</span>
              <strong className="text-gray-900 text-sm">{product.minimumOrderQuantity} {product.unit}</strong>
            </div>
            <div>
              <span className="text-gray-400 text-[10px] uppercase font-bold block">Freshness</span>
              <strong className="text-[#176B45] text-xs truncate block">{product.harvestFreshness}</strong>
            </div>
            <div>
              <span className="text-gray-400 text-[10px] uppercase font-bold block">Harvest Date</span>
              <strong className="text-gray-800 text-xs truncate block">{product.harvestDate}</strong>
            </div>
          </div>

          {/* Mandi Benchmark comparison indicator - ONLY FOR FARMERS (Confidentiality Guard for Buyers) */}
          {isFarmer ? (
            product.mandiBenchmark && (
              <div className="bg-[#E8F5EC] p-3.5 rounded-xl border border-[#C4D7C8] text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#176B45] flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" /> APMC Benchmark Comparison (Farmer View)
                  </span>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    Reference {product.mandiBenchmark.marketName} modal rate is ₹{product.mandiBenchmark.modalPrice}/{product.unit}.
                  </p>
                </div>
                <span className="font-extrabold text-[#176B45] text-xs bg-white px-2.5 py-1 rounded-lg border border-[#4F9B68]/30">
                  {product.mandiBenchmark.diffPercent <= 0 ? '🟢 Fair / At Mandi' : `+${product.mandiBenchmark.diffPercent}% Premium`}
                </span>
              </div>
            )
          ) : (
            <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-xs flex items-center justify-between text-amber-900">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Farmer Confidentiality Guard:</strong> APMC internal price spreads are restricted to farmers to ensure fair bargaining.
                </span>
              </div>
            </div>
          )}

          {/* Instant Buyer Connect Section (Call & WhatsApp Quote) */}
          <div className="bg-gradient-to-r from-[#E8F5EC] to-[#F1F8F4] p-4 rounded-2xl border border-[#4F9B68]/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#176B45] uppercase tracking-wide flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-[#176B45]" />
                Instant Buyer Connect
              </span>
              <span className="text-[10px] text-gray-500">Reach farmer directly</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleCallFarmer}
                className="w-full py-2.5 px-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Call {product.farmerName} (+91 {cleanPhone})</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppQuote}
                className="w-full py-2.5 px-3 bg-[#176B45] hover:bg-[#125537] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#E8B94D]" />
                <span>Request WhatsApp Quotation</span>
              </button>
            </div>
          </div>

          {/* Farmer Profile & Pickup Location */}
          <div className="bg-white rounded-2xl p-4 border border-[#E2EBDD] space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#176B45] text-white flex items-center justify-center font-bold text-sm">
                  {product.farmerName.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm flex items-center gap-1">
                    <span>{product.farmerName}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#176B45]" />
                  </div>
                  <div className="text-gray-500 text-[11px]">
                    Direct Producer • {product.village}, {product.district}
                  </div>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded">
                Verified Farmer
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
              <div>
                <span className="text-gray-400 block">General Pickup Point:</span>
                <span className="font-semibold text-gray-800">{product.pickupArea}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Grower Notes:</span>
                <span className="text-gray-600 italic">"{product.notes || 'Natural farm produce.'}"</span>
              </div>
            </div>
          </div>

          {/* Transactional Purchase / Enquiry Form */}
          <div className="bg-[#F8FAF6] p-5 rounded-2xl border border-[#C4D7C8] space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <h3 className="font-extrabold text-sm text-[#18352A] flex items-center gap-1.5">
                <Send className="w-4 h-4 text-[#176B45]" />
                <span>{t('makeOfferTitle')}</span>
              </h3>
              <span className="text-[11px] text-gray-500">
                Direct negotiation • No broker fee
              </span>
            </div>

            {submitted ? (
              <div className="p-4 bg-[#E8F5EC] border border-[#4F9B68] rounded-xl text-center space-y-1 text-xs text-[#176B45] animate-in fade-in">
                <CheckCircle2 className="w-8 h-8 mx-auto text-[#176B45]" />
                <div className="font-bold text-sm">Offer Submitted to {product.farmerName}!</div>
                <p className="text-[11px] text-gray-600">
                  The farmer has received your bid of ₹{offeredPrice}/{product.unit} for {requestedQty} {product.unit}. Track status in Orders & Bids.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitOffer} className="space-y-3.5">
                {error && (
                  <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">
                      {t('enterQuantity')} ({product.unit}):
                    </label>
                    <input
                      type="number"
                      required
                      min={product.minimumOrderQuantity}
                      max={product.quantityAvailable}
                      value={requestedQty}
                      onChange={(e) => setRequestedQty(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#176B45]"
                    />
                    <span className="text-[10px] text-gray-400 mt-0.5 block">
                      Max available: {product.quantityAvailable} {product.unit}
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">
                      {t('offeredPricePerUnit')}:
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                      <input
                        type="number"
                        required
                        value={offeredPrice}
                        onChange={(e) => setOfferedPrice(parseFloat(e.target.value) || 0)}
                        className="w-full pl-7 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-[#176B45] focus:outline-none focus:border-[#176B45]"
                      />
                    </div>
                    <span className="text-[10px] text-gray-400 mt-0.5 block">
                      Farmer asking: ₹{product.expectedPrice}/{product.unit}
                    </span>
                  </div>
                </div>

                {/* Logistics Preference */}
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">
                    {t('transportMethod')}:
                  </label>
                  <select
                    value={transportPreference}
                    onChange={(e) => setTransportPreference(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 cursor-pointer"
                  >
                    <option value="Buyer Pick-up">{t('buyerPickup')}</option>
                    <option value="Farmer Deliver">{t('farmerDeliver')}</option>
                    <option value="Shared Logistics">{t('sharedLogistics')}</option>
                  </select>
                </div>

                {/* Message to Farmer */}
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">
                    {t('messageToFarmer')}:
                  </label>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. Can we arrange pickup Thursday morning?"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800"
                  />
                </div>

                {/* Total Value Summary Box */}
                <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold block">Estimated Deal Value</span>
                    <span className="text-gray-600 text-[11px]">
                      {requestedQty} {product.unit} × ₹{offeredPrice}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-[#176B45]">
                      ₹{totalValue.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] text-[#4F9B68] font-bold">0% middleman brokerage</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-[#176B45] hover:bg-[#125537] text-white font-extrabold text-xs md:text-sm py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{t('submitOffer')} (₹{totalValue.toLocaleString('en-IN')})</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
