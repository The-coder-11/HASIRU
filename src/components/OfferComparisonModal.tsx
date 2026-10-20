import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Scale,
  X,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Truck,
  Building,
  ArrowRight,
  ShieldCheck,
  Percent,
} from 'lucide-react';

interface OfferComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SimulatedOffer {
  id: string;
  buyerName: string;
  buyerOrg: string;
  cropName: string;
  quantity: number;
  unit: string;
  offeredPrice: number;
  transportCost: number; // total transport
  otherCosts: number; // packaging, loading
  terms: string;
  distanceKm: number;
}

export const OfferComparisonModal: React.FC<OfferComparisonModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentLanguage, t } = useApp();

  // 3 sample realistic buyer offers for comparison
  const [offers, setOffers] = useState<SimulatedOffer[]>([
    {
      id: 'offer-a',
      buyerName: 'Suresh Shetty',
      buyerOrg: 'Hotel Ocean Pearl Mangaluru',
      cropName: 'Mature Coastal Coconuts',
      quantity: 500,
      unit: 'kg',
      offeredPrice: 38,
      transportCost: 800, // farmer arranges mini tempo to Mangaluru
      otherCosts: 250, // gunny bags
      terms: 'Payment on same-day inspection',
      distanceKm: 28,
    },
    {
      id: 'offer-b',
      buyerName: 'K. V. Prabhu',
      buyerOrg: 'Mangaluru Wholesale Agro-Yard',
      cropName: 'Mature Coastal Coconuts',
      quantity: 500,
      unit: 'kg',
      offeredPrice: 35,
      transportCost: 0, // buyer picks up directly from farmgate
      otherCosts: 100, // loose loading
      terms: 'Immediate cash / UPI at farm gate',
      distanceKm: 0,
    },
    {
      id: 'offer-c',
      buyerName: 'Ananya Kamath',
      buyerOrg: 'Coastal Fresh Organic Supermarket (Udupi)',
      cropName: 'Mature Coastal Coconuts',
      quantity: 500,
      unit: 'kg',
      offeredPrice: 41,
      transportCost: 1500, // transport to Udupi
      otherCosts: 300, // crates
      terms: 'NEFT transfer within 24 hours',
      distanceKm: 65,
    },
  ]);

  if (!isOpen) return null;

  // Calculate economics for each offer
  const calculatedOffers = offers.map((offer) => {
    const gross = offer.quantity * offer.offeredPrice;
    const net = gross - offer.transportCost - offer.otherCosts;
    const netPerUnit = (net / offer.quantity).toFixed(2);
    // Compare against standard traditional APMC auction with 9% middleman commission
    const middlemanDeductionTraditional = Math.round(gross * 0.09);
    const directBenefit = middlemanDeductionTraditional;

    return {
      ...offer,
      gross,
      net,
      netPerUnit,
      directBenefit,
    };
  });

  // Find offer with highest net proceeds
  const bestOffer = calculatedOffers.reduce((best, curr) => (curr.net > best.net ? curr : best), calculatedOffers[0]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E2EBDD] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#176B45] to-[#2D8F60] text-white p-5 rounded-t-3xl flex items-center justify-between sticky top-0 z-10 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#E8B94D] text-[#18352A] flex items-center justify-center font-black">
              <Scale className="w-5 h-5 text-[#18352A]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base md:text-lg leading-tight">
                {t('compareBidsTitle')} ⚖️
              </h3>
              <p className="text-[11px] text-[#E8F5EC]">
                {t('compareBidsDesc')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 md:p-6 space-y-6">
          {/* AI Best Recommendation Banner */}
          <div className="bg-gradient-to-r from-[#E8F5EC] to-[#F1F8F4] p-4 rounded-2xl border border-[#4F9B68] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-[#176B45] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  {t('bestOfferBadge')}
                </span>
                <span className="text-xs font-bold text-[#18352A]">
                  {bestOffer.buyerOrg}
                </span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                Despite <strong>₹{bestOffer.transportCost}</strong> in transport logistics, {bestOffer.buyerOrg}'s offer provides <strong>₹{bestOffer.net.toLocaleString('en-IN')}</strong> in net proceeds (₹{bestOffer.netPerUnit}/{bestOffer.unit}), outperforming farmgate cash offers by <strong>₹{(bestOffer.net - calculatedOffers[1].net).toLocaleString('en-IN')}</strong>.
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-gray-500 uppercase font-bold block">Highest Net Gain</span>
              <span className="text-xl font-black text-[#176B45]">
                ₹{bestOffer.net.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Formula explanation as required by master prompt */}
          <div className="bg-[#F8FAF6] p-3 rounded-xl border border-[#E2EBDD] text-xs text-gray-600 flex items-center justify-between">
            <span>
              <strong>Formula:</strong> Gross Value = Qty × Price • Net Proceeds = Gross − Transport − Packaging
            </span>
            <span className="font-bold text-[#176B45] hidden sm:inline">0% Platform Brokerage</span>
          </div>

          {/* Side by side comparison cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {calculatedOffers.map((o) => {
              const isBest = o.id === bestOffer.id;

              return (
                <div
                  key={o.id}
                  className={`rounded-2xl border p-4 flex flex-col justify-between transition-all ${
                    isBest
                      ? 'bg-white border-[#176B45] shadow-md ring-2 ring-[#176B45]/20'
                      : 'bg-white border-gray-200 hover:shadow-xs'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-1 border-b border-gray-100 pb-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">
                          {o.buyerName}
                        </span>
                        <h4 className="font-bold text-xs text-gray-900 leading-snug">
                          {o.buyerOrg}
                        </h4>
                      </div>
                      {isBest && (
                        <span className="text-[9px] bg-[#E8B94D] text-[#18352A] font-extrabold px-1.5 py-0.5 rounded">
                          ★ Best Net
                        </span>
                      )}
                    </div>

                    {/* Offer Parameters */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Offered Price:</span>
                        <strong className="text-[#176B45] text-sm">₹{o.offeredPrice}/{o.unit}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Quantity:</span>
                        <span className="font-semibold text-gray-800">{o.quantity} {o.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Gross Value:</span>
                        <span className="font-bold text-gray-900">₹{o.gross.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>Transport Cost:</span>
                        <span>-₹{o.transportCost}</span>
                      </div>
                      <div className="flex justify-between text-amber-700">
                        <span>Packaging/Handling:</span>
                        <span>-₹{o.otherCosts}</span>
                      </div>
                    </div>

                    {/* Net Result Box */}
                    <div className={`p-3 rounded-xl border text-center ${
                      isBest ? 'bg-[#E8F5EC] border-[#C4D7C8]' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <span className="text-[10px] text-gray-500 uppercase font-bold block">
                        Estimated Net Farmer Proceeds
                      </span>
                      <div className="text-xl font-black text-[#176B45]">
                        ₹{o.net.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[10px] text-[#4F9B68] font-bold">
                        (₹{o.netPerUnit} net / {o.unit})
                      </span>
                    </div>

                    {/* Terms */}
                    <div className="text-[11px] text-gray-500 bg-gray-50 p-2 rounded-lg space-y-0.5">
                      <div><strong>Terms:</strong> {o.terms}</div>
                      <div><strong>Distance:</strong> {o.distanceKm === 0 ? 'Farmgate Pickup' : `${o.distanceKm} km`}</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 mt-3">
                    <span className="text-[10px] text-[#176B45] font-semibold block text-center">
                      ✓ Saves ~₹{o.directBenefit} vs middleman APMC
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
