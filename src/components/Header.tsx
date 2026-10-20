import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sprout,
  TrendingUp,
  Bell,
  Globe,
  RotateCcw,
  UserCheck,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  LogOut,
  ShieldCheck,
  Lock,
} from 'lucide-react';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenVoiceAssistant: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  onOpenProfile,
  onOpenVoiceAssistant,
  onSignOut,
}) => {
  const {
    currentUser,
    allUsers,
    switchUser,
    currentLanguage,
    setLanguage,
    unreadNotifsCount,
    resetDemoData,
    t,
  } = useApp();

  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const isFarmer = currentUser.role === 'farmer';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2EBDD] shadow-xs">
      {/* Top Demo Context Banner for Hackathon Judges */}
      <div className="bg-[#176B45] text-white px-3 py-1.5 text-xs font-medium flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <span className="bg-[#E8B94D] text-[#18352A] px-2 py-0.5 rounded-full font-bold text-[10px] tracking-wide uppercase">
            {t('demoModeActive')}
          </span>
          <span className="hidden sm:inline text-[#E8F5EC]">
            {isFarmer ? (
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E8B94D]" />
                Farmer Mode: Full APMC AI Price Analysis & 7-Day Forecasting Unlocked
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                Buyer Mode: Farmer Confidentiality Guard Active (Price Analytics Hidden)
              </span>
            )}
          </span>
        </div>

        {/* Quick User Switcher dropdown & Sign Out */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#E8B94D]" />
              <span>
                {isFarmer ? '👨‍🌾 ' : '🏢 '}
                {currentUser.name} ({isFarmer ? 'Farmer' : 'Buyer'})
              </span>
              <ChevronDown className="w-3 h-3 opacity-75" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-gray-200 py-2 text-gray-800 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Switch Active Account
                </div>
                {allUsers.map((u) => {
                  const isSelected = u.uid === currentUser.uid;
                  return (
                    <button
                      key={u.uid}
                      onClick={() => {
                        switchUser(u.uid);
                        setShowUserDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-[#E8F5EC] transition-colors cursor-pointer ${
                        isSelected ? 'bg-[#E8F5EC]/70 font-semibold text-[#176B45]' : 'text-gray-700'
                      }`}
                    >
                      <img
                        src={u.profileImageUrl}
                        alt={u.name}
                        className="w-7 h-7 rounded-full object-cover border border-[#4F9B68]/30"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs truncate flex items-center gap-1">
                          <span>{u.name}</span>
                          {isSelected && <CheckCircle2 className="w-3 h-3 text-[#176B45]" />}
                        </div>
                        <div className="text-[10px] text-gray-500 truncate">
                          {u.role === 'farmer' ? '🌾 Farmer (Full AI)' : '🏢 Buyer (Confidential Guard)'} • {u.village}
                        </div>
                      </div>
                    </button>
                  );
                })}
                <div className="border-t border-gray-100 mt-1 pt-1 px-3 space-y-1">
                  <button
                    onClick={() => {
                      resetDemoData();
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left py-1 text-[11px] text-gray-500 hover:text-red-600 flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset Demo Data
                  </button>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onSignOut();
                    }}
                    className="w-full text-left py-1 text-[11px] text-red-600 hover:underline font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3 h-3" />
                    Sign Out to Registration Page
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onSignOut}
            title="Log out to Registration Page"
            className="hidden sm:flex items-center gap-1 bg-black/20 hover:bg-black/35 px-2 py-1 rounded-md text-[11px] text-white transition-colors cursor-pointer"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#176B45] to-[#4F9B68] flex items-center justify-center text-white shadow-md shadow-[#176B45]/20 relative">
            <Sprout className="w-6 h-6 text-white" />
            <div className="absolute -top-1 -right-1 bg-[#E8B94D] text-[#18352A] p-0.5 rounded-full">
              <TrendingUp className="w-2.5 h-2.5 stroke-[3]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-[#176B45]">
                {t('appName')}
              </h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isFarmer
                  ? 'bg-[#E8F5EC] text-[#176B45] border-[#4F9B68]/30'
                  : 'bg-blue-50 text-blue-800 border-blue-200'
              }`}>
                {isFarmer ? 'Farmer View' : 'Buyer View'}
              </span>
            </div>
            <p className="text-[11px] text-[#4F9B68] font-medium hidden sm:block">
              {t('tagline')}
            </p>
          </div>
        </div>

        {/* Right Actions: Voice Assistant Shortcut (if farmer), Language Switcher, Notifications, Profile */}
        <div className="flex items-center gap-2">
          {isFarmer && (
            <button
              onClick={onOpenVoiceAssistant}
              className="flex items-center gap-1.5 bg-[#E8F5EC] hover:bg-[#D4EBDC] text-[#176B45] font-semibold text-xs px-3 py-1.5 rounded-lg border border-[#4F9B68]/30 transition-all shadow-xs cursor-pointer"
              title="Kannada Voice Assistant (ಹಸಿರು ಸಹಾಯಕ)"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E8B94D]" />
              <span className="hidden md:inline font-kannada">ಹಸಿರು ಸಹಾಯಕ</span>
              <span className="md:hidden">Voice</span>
            </button>
          )}

          {/* Language Selector: EN / ಕನ್ನಡ */}
          <div className="flex items-center bg-[#F1F5E9] rounded-lg p-0.5 border border-[#C4D7C8]">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer ${
                currentLanguage === 'en'
                  ? 'bg-white text-[#176B45] shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('kn')}
              className={`px-2 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer ${
                currentLanguage === 'kn'
                  ? 'bg-white text-[#176B45] shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              ಕನ್ನಡ
            </button>
          </div>

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg text-gray-600 hover:text-[#176B45] hover:bg-[#E8F5EC] transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Profile Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-[#E8F5EC] transition-colors cursor-pointer"
            title="Profile & Settings"
          >
            <img
              src={currentUser.profileImageUrl}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-[#176B45]"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
