import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AIPriceAdvice, CropCategory, ProduceGrade } from '../types';
import {
  Sparkles,
  X,
  TrendingUp,
  Scale,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  DollarSign,
  Truck,
  ArrowRight,
  Loader2,
  Lock,
} from 'lucide-react';

interface AIPriceAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPriceToListing?: (crop: string, price: number, grade: ProduceGrade, qty: number) => void;
}

export const AIPriceAdvisorModal: React.FC<AIPriceAdvisorModalProps> = ({
  isOpen,
  onClose,
  onApplyPriceToListing,
}) => {
  const { currentUser, currentLanguage, t } = useApp();

  const isFarmer = currentUser.role === 'farmer';

  const [crop, setCrop] = useState<string>('Tomato');
  const [district, setDistrict] = useState<'Dakshina Kannada' | 'Udupi'>('Dakshina Kannada');
  const [grade, setGrade] = useState<ProduceGrade>('Grade A (Premium)');
  const [quantity, setQuantity] = useState<number>(500);
  const [unit, setUnit] = useState<string>('kg');
  const [askingPrice, setAskingPrice] = useState<number>(24);
  const [transportCost, setTransportCost] = useState<number>(2.5);

  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<AIPriceAdvice | null>(null);
  const [showHowEstimated, setShowHowEstimated] = useState(false);

  if (!isOpen) return null;

  // Confidentiality Guard for Buyers
  if (!isFarmer) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl border border-amber-300 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-gray-900">
              Confidential to Farmer Accounts
            </h3>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              To maintain fair negotiations and protect farmer margins, the <strong>AI Price Predictor and 7-Day Forecast Engine</strong> are confidential to farmers.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-[#176B45] text-white font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            Return to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const handleGenerateAdvice = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai-price-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop,
          district,
          grade,
          quantity,
          unit,
          askingPrice,
          transportCost,
        }),
      });

      const resData = await response.json();
      if (resData.success) {
        setAdvice(resData.data);
      }
    } catch (err) {
      console.error('Failed to fetch AI price advice:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPrice = () => {
    if (advice && onApplyPriceToListing) {
      onApplyPriceToListing(crop, advice.recommendedPrice, grade, quantity);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E2EBDD] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#176B45] to-[#2D8F60] text-white p-5 rounded-t-3xl flex items-center justify-between sticky top-0 z-10 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E8B94D] text-[#18352A] flex items-center justify-center font-black shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base md:text-lg leading-tight">
                {t('aiAdvisorTitle')}
              </h3>
              <p className="text-[11px] text-[#E8F5EC]">
                {t('aiAdvisorSubtitle')}
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

        {/* Content Body */}
        <div className="p-5 md:p-6 space-y-5">
          {/* Form Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-[#F8FAF6] p-4 rounded-2xl border border-[#E2EBDD]">
            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">
                {t('cropToSell')}:
              </label>
              <select
                value={crop}
                onChange={(e) => {
                  setCrop(e.target.value);
                  if (e.target.value === 'Arecanut') setAskingPrice(450);
                  else if (e.target.value === 'White Pepper') setAskingPrice(680);
                  else if (e.target.value === 'Tomato') setAskingPrice(24);
                  else if (e.target.value === 'Paddy (Jyothi)') setAskingPrice(26);
                  else setAskingPrice(38);
                }}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 cursor-pointer"
              >
                <option value="Tomato">Tomato (ನಾಟಿ ಟೊಮೇಟೊ - +12% 7d forecast)</option>
                <option value="Coconut">Coconut (ತೆಂಗಿನಕಾಯಿ)</option>
                <option value="Arecanut">Arecanut / Chali (ಅಡಿಕೆ)</option>
                <option value="White Pepper">White Pepper (ಬಿಳಿ ಕಾಳುಮೆಣಸು)</option>
                <option value="Black Pepper">Black Pepper (ಕಪ್ಪು ಕಾಳುಮೆಣಸು)</option>
                <option value="Paddy (Jyothi)">Paddy / Red Rice (ಜ್ಯೋತಿ ಭತ್ತ)</option>
                <option value="Banana (Nanjangud/Rasabale)">Banana / Rasabale (ರಸಬಾಳೆ)</option>
                <option value="Cashew Raw">Cashew Raw Nut (ಗೋಡಂಬಿ)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">
                District / Reference Market:
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value as any)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 cursor-pointer"
              >
                <option value="Dakshina Kannada">Dakshina Kannada (Mangaluru/Bantwal/Puttur)</option>
                <option value="Udupi">Udupi (Udupi/Kundapura/Karkala)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">
                {t('qualityOrGrade')}:
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as any)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 cursor-pointer"
              >
                <option value="Grade A (Premium)">Grade A (Premium Export/Clean)</option>
                <option value="Grade B (Standard)">Grade B (Standard Commercial)</option>
                <option value="Grade C">Grade C (Mixed Size/Distress)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">
                Quantity & Unit:
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                  className="w-2/3 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-1/3 bg-white border border-gray-200 rounded-xl px-2 py-2 text-xs font-semibold text-gray-800 cursor-pointer"
                >
                  <option value="kg">kg</option>
                  <option value="quintal">quintal</option>
                  <option value="tonne">tonne</option>
                  <option value="pieces">pieces</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">
                Your Asking Price (₹/{unit}):
              </label>
              <input
                type="number"
                value={askingPrice}
                onChange={(e) => setAskingPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">
                Unit Transport Cost (₹/{unit}):
              </label>
              <input
                type="number"
                step="0.5"
                value={transportCost}
                onChange={(e) => setTransportCost(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
              />
            </div>
          </div>

          {/* Trigger Button */}
          <button
            onClick={handleGenerateAdvice}
            disabled={loading}
            className="w-full bg-[#176B45] hover:bg-[#125537] text-white font-extrabold text-xs md:text-sm py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#E8B94D]" />
                <span>Consulting Karnataka Mandi trends & calculating 7-day forecast...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#E8B94D]" />
                <span>{t('getAiAdvice')}</span>
              </>
            )}
          </button>

          {/* Advice Output Section */}
          {advice && (
            <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
              {/* Primary Recommended Card */}
              <div className="bg-gradient-to-br from-[#176B45] to-[#257A50] text-white p-5 rounded-2xl shadow-md space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#E8B94D] uppercase font-bold tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> AI Recommended Target Price
                  </span>
                  <span className="bg-black/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    Confidence: {advice.confidenceScore}%
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div className="text-3xl md:text-4xl font-black text-white">
                    ₹{advice.recommendedPrice}
                    <span className="text-sm font-normal text-[#E8F5EC]"> / {unit}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-[#E8F5EC] block">Fair Market Window</span>
                    <span className="text-sm font-extrabold text-[#E8B94D]">
                      ₹{advice.suggestedMin} - ₹{advice.suggestedMax} / {unit}
                    </span>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-3 gap-2 bg-black/20 p-2.5 rounded-xl text-center text-xs">
                  <div>
                    <span className="text-[10px] text-gray-300 block">{t('expectedGrossProceeds')}</span>
                    <strong className="text-white text-sm">₹{advice.grossProceeds?.toLocaleString('en-IN')}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-300 block">Est. Transport Cost</span>
                    <strong className="text-amber-200 text-sm">-₹{advice.totalTransport?.toLocaleString('en-IN')}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#E8B94D] font-bold block">{t('estimatedNetProceeds')}</span>
                    <strong className="text-[#E8B94D] text-sm">₹{advice.netProceeds?.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>

              {/* 7-Day Forecast Box (DevHost / Synergia Slide Exact Feature) */}
              {advice.forecast7Day && (
                <div className="bg-gradient-to-r from-amber-500/15 via-[#E8F5EC] to-emerald-500/15 p-4 rounded-2xl border border-[#4F9B68]/40 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[#176B45] uppercase flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-[#176B45]" />
                      7-Day Price Forecast
                    </span>
                    <span className="bg-[#176B45] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      ▲ +{advice.forecast7Day.projectedPercent}% Projected
                    </span>
                  </div>
                  <p className="text-xs text-gray-800 font-semibold leading-relaxed">
                    {advice.forecast7Day.forecastRationale}
                  </p>
                  <div className="text-[11px] text-gray-600 flex items-center justify-between pt-1">
                    <span>Target 7-Day Price: <strong>₹{advice.forecast7Day.projectedPrice}/{unit}</strong></span>
                    <span className="text-emerald-700 font-bold">Recommended action: Hold or stagger sales</span>
                  </div>
                </div>
              )}

              {/* Rationale & Explainability Box */}
              <div className="bg-[#F8FAF6] p-4 rounded-2xl border border-[#C4D7C8] space-y-2 text-xs">
                <div className="font-bold text-[#176B45] flex items-center gap-1.5">
                  <Info className="w-4 h-4" />
                  <span>{t('whyThisPrice')}</span>
                </div>
                <p className="text-gray-700 leading-relaxed font-medium">
                  {advice.rationaleEn}
                </p>
                {advice.rationaleKn && (
                  <p className="text-[#176B45] font-kannada leading-relaxed bg-[#E8F5EC] p-2.5 rounded-xl border border-[#4F9B68]/20">
                    {advice.rationaleKn}
                  </p>
                )}

                <div className="pt-2 border-t border-gray-200">
                  <span className="text-[11px] font-bold text-gray-600 block mb-1">
                    {t('factorsInfluencing')}:
                  </span>
                  <ul className="space-y-1 text-[11px] text-gray-600">
                    {advice.keyFactors.map((factor, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#176B45] shrink-0 mt-0.5" />
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* "Use This Price" Action */}
              <button
                onClick={handleApplyPrice}
                className="w-full bg-[#E8B94D] hover:bg-[#d8a83d] text-[#18352A] font-extrabold text-xs md:text-sm py-3 rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>{t('useThisPrice')} (₹{advice.recommendedPrice}/{unit})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
