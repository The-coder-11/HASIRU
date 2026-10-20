import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Mic,
  Scale,
  Users,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Cpu,
  BadgeCheck,
} from 'lucide-react';

interface AIToolsHubProps {
  onOpenPriceAdvisor: () => void;
  onOpenVoiceAssistant: () => void;
  onOpenOfferComparison: () => void;
  onNavigateToMarketplace: () => void;
}

export const AIToolsHub: React.FC<AIToolsHubProps> = ({
  onOpenPriceAdvisor,
  onOpenVoiceAssistant,
  onOpenOfferComparison,
  onNavigateToMarketplace,
}) => {
  const { currentUser, switchUser, currentLanguage, t } = useApp();

  const isFarmer = currentUser.role === 'farmer';

  if (!isFarmer) {
    return (
      <div className="py-12 max-w-xl mx-auto px-4 text-center space-y-4 animate-in fade-in">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#18352A]">
          AI Decision Suite is Confidential to Farmers
        </h2>
        <p className="text-xs text-gray-600 leading-relaxed">
          Price intelligence tools (AI Price Advisor, Mandi 7-day Forecasting, and Net Margin Calculator) are protected by the <strong>Farmer Confidentiality Guard</strong> to ensure fair bargaining in coastal agricultural trade.
        </p>
        <button
          onClick={() => switchUser('farmer-1')}
          className="bg-[#176B45] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          Switch to Farmer Demo to Unlock
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#176B45] via-[#1E7D52] to-[#2D8F60] text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#E8B94D] text-[#18352A]">
              <Cpu className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold text-[#E8B94D] uppercase tracking-wider">
              AI Agricultural Intelligence Suite
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Hasiru AI Decision Support 🧠
          </h2>
          <p className="text-xs md:text-sm text-[#E8F5EC] max-w-xl">
            Cutting-edge machine intelligence tailored specifically for marginal and small farmers in Dakshina Kannada & Udupi, Karnataka.
          </p>
        </div>
      </div>

      {/* 4 Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Feature 1: AI Price Advisor */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2EBDD] shadow-xs hover:border-[#176B45] hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#E8F5EC] text-[#176B45] flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5 text-[#E8B94D]" />
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full border border-emerald-200">
                Feature 1 • Price Science
              </span>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-gray-900">
                {t('aiAdvisorTitle')}
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Recommends fair selling price bands grounded in live APMC Mandi trends (Mangaluru, Bantwal, Puttur, Udupi) and quality grading. Calculates direct net proceeds after transport expenses.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenPriceAdvisor}
            className="w-full bg-[#176B45] hover:bg-[#125537] text-white font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>Launch Price Advisor</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Feature 2: Kannada Voice Assistant */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2EBDD] shadow-xs hover:border-[#176B45] hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Mic className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-[10px] bg-amber-50 text-amber-800 font-extrabold px-2 py-0.5 rounded-full border border-amber-200">
                Feature 2 • Speech NLP
              </span>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-gray-900 font-kannada">
                {t('voiceAssistantName')} (Kannada Voice Assistant)
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Enables farmers with limited smartphone typing skills to speak naturally in Kannada or English. Gemini NLP extracts crop, volume, price, and location for immediate 1-click publishing.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenVoiceAssistant}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>Open Voice Assistant (ಧ್ವನಿ ಸಹಾಯಕ)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Feature 3: Smart Buyer-Farmer Matching */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2EBDD] shadow-xs hover:border-[#176B45] hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-[10px] bg-blue-50 text-blue-800 font-extrabold px-2 py-0.5 rounded-full border border-blue-200">
                Feature 3 • Recommendation
              </span>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-gray-900">
                Smart Buyer-Farmer Matching Engine
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Pairs coastal institutional buyers (Hotels, Retail Supermarkets, Agro-processors) with marginal farmers using crop compatibility, volume requirements, and geographical proximity within Dakshina Kannada & Udupi.
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToMarketplace}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>Explore Matched Produce in Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Feature 4: Profit & Offer Comparison */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2EBDD] shadow-xs hover:border-[#176B45] hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                <Scale className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full border border-emerald-200">
                Feature 4 • Net Margins
              </span>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-gray-900">
                {t('compareBidsTitle')}
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Compares multiple buyer offers side by side after deducting actual freight, handling, and packaging. Clearly highlights the 8-12% commission savings achieved by skipping traditional middlemen.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenOfferComparison}
            className="w-full bg-[#176B45] hover:bg-[#125537] text-white font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>Open Net Profit Calculator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
