import React from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  X,
  ShieldCheck,
  RotateCcw,
  Globe,
  MapPin,
  Building,
  Phone,
  Mail,
  HelpCircle,
  Award,
  CheckCircle2,
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    allUsers,
    switchUser,
    currentLanguage,
    setLanguage,
    resetDemoData,
    logoutUser,
    t,
  } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E2EBDD] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#176B45] text-white p-5 rounded-t-3xl flex items-center justify-between sticky top-0 z-10 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E8B94D] text-[#18352A] flex items-center justify-center font-bold">
              <User className="w-5 h-5 text-[#18352A]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base md:text-lg leading-tight">
                Profile & Settings
              </h3>
              <p className="text-[11px] text-[#E8F5EC]">
                HASIRU Agri-Tech Platform • Dakshina Kannada & Udupi
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
        <div className="p-5 md:p-6 space-y-6">
          {/* User Card */}
          <div className="flex items-center gap-4 bg-[#F8FAF6] p-4 rounded-2xl border border-[#E2EBDD]">
            <img
              src={currentUser.profileImageUrl}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#176B45] shadow-xs"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-gray-900 truncate">
                  {currentUser.name}
                </h3>
                <span className="text-[10px] bg-[#E8F5EC] text-[#176B45] font-extrabold px-2 py-0.5 rounded-full border border-[#4F9B68]/30 shrink-0">
                  {currentUser.role === 'farmer' ? '🌾 Farmer' : '🏢 Buyer'}
                </span>
              </div>
              <p className="text-xs text-gray-600 truncate mt-0.5 font-medium">
                {currentUser.businessOrFarmName}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#4F9B68]" />
                <span>{currentUser.village}, {currentUser.district}</span>
              </div>
            </div>
          </div>

          {/* Quick Demo Persona Switcher */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-700 block">
              Switch Active Demo Account (Hackathon Testing):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allUsers.map((u) => {
                const isSelected = u.uid === currentUser.uid;
                return (
                  <button
                    key={u.uid}
                    onClick={() => switchUser(u.uid)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#E8F5EC] border-[#176B45] font-bold text-[#176B45] shadow-xs'
                        : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <img src={u.profileImageUrl} alt={u.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate flex items-center justify-between">
                        <span>{u.name}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#176B45]" />}
                      </div>
                      <div className="text-[10px] text-gray-500 truncate">
                        {u.role === 'farmer' ? 'Farmer' : 'Buyer'} • {u.village.split(' ')[0]}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Selector */}
          <div className="bg-[#F8FAF6] p-4 rounded-2xl border border-[#E2EBDD] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-bold text-gray-800">
              <Globe className="w-4 h-4 text-[#176B45]" />
              <span>Preferred Interface Language</span>
            </div>
            <div className="flex items-center bg-white rounded-lg p-0.5 border border-gray-200">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                  currentLanguage === 'en' ? 'bg-[#176B45] text-white shadow-xs' : 'text-gray-600'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('kn')}
                className={`px-3 py-1.5 rounded-md font-bold transition-all font-kannada ${
                  currentLanguage === 'kn' ? 'bg-[#176B45] text-white shadow-xs' : 'text-gray-600'
                }`}
              >
                ಕನ್ನಡ
              </button>
            </div>
          </div>

          {/* Hackathon PS 1.2 Presentation Guide (10-Step Journey) */}
          <div className="bg-[#18352A] text-white p-4 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#E8B94D]">
              <Award className="w-4 h-4" />
              <span>PS 1.2 Hackathon 10-Step Demo Walkthrough</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-[#E8F5EC] leading-relaxed">
              <li><strong>Step 1:</strong> Start as Farmer (Ramesh Bhat, Bantwal).</li>
              <li><strong>Step 2:</strong> View Dashboard & APMC Mandi trends for Dakshina Kannada & Udupi.</li>
              <li><strong>Step 3:</strong> Open AI Price Advisor, see fair price calculation & net proceeds.</li>
              <li><strong>Step 4:</strong> Click "Add Produce" or try "Hasiru Sahayaka" Kannada Voice Assistant.</li>
              <li><strong>Step 5:</strong> Switch to Buyer (Hotel Ocean Pearl) using top demo switcher.</li>
              <li><strong>Step 6:</strong> Search produce, compare listings side-by-side.</li>
              <li><strong>Step 7:</strong> View product details and submit direct purchase offer.</li>
              <li><strong>Step 8:</strong> Switch back to Farmer, open Orders & Enquiries to accept offer.</li>
              <li><strong>Step 9:</strong> See inventory automatically updated and order chit generated.</li>
              <li><strong>Step 10:</strong> Open Offer Comparison tool to view net proceeds & 0% middleman cut.</li>
            </ol>
          </div>

          {/* Reset Demo State Button & Sign Out */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                logoutUser();
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <span>Sign Out to Registration Page</span>
            </button>
            <button
              onClick={() => {
                resetDemoData();
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Demo Data to Initial Clean State</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
