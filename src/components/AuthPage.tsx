import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserProfile, UserRole } from '../types';
import {
  Sprout,
  TrendingUp,
  ShieldCheck,
  Phone,
  Lock,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Sparkles,
  Building,
  MapPin,
  MessageSquare,
  AlertTriangle,
  Globe,
} from 'lucide-react';

interface AuthPageProps {
  onLoginSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const { allUsers, loginUser, registerNewUser, currentLanguage, setLanguage, t } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDistrict, setRegDistrict] = useState<'Dakshina Kannada' | 'Udupi'>('Dakshina Kannada');
  const [regVillage, setRegVillage] = useState('Bantwal');
  const [regBusiness, setRegBusiness] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMsg(null);
    setOtpSent(true);
    // Auto-fill test OTP for seamless hackathon UX
    setOtp('1234');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '1234') {
      setErrorMsg('Invalid OTP. Please enter 1234 for demo verification.');
      return;
    }

    // Match existing user or create on-the-fly
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const existing = allUsers.find(
      (u) => u.phone.replace(/\D/g, '').slice(-10) === cleanPhone && u.role === selectedRole
    );

    if (existing) {
      loginUser(existing);
      onLoginSuccess();
    } else {
      // Create new session user
      const newUser: UserProfile = {
        uid: `user-${Date.now()}`,
        name: selectedRole === 'farmer' ? 'New Farmer Partner' : 'New Buyer Partner',
        phone: cleanPhone,
        role: selectedRole,
        preferredLanguage: currentLanguage,
        district: 'Dakshina Kannada',
        village: 'Mangaluru',
        businessOrFarmName: selectedRole === 'farmer' ? 'Coastal Family Farm' : 'Local Agri-Store',
        profileImageUrl:
          selectedRole === 'farmer'
            ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80'
            : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        isVerified: true,
      };
      registerNewUser(newUser);
      onLoginSuccess();
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) {
      setErrorMsg('Name and phone number are required.');
      return;
    }

    const newUser: UserProfile = {
      uid: `user-${Date.now()}`,
      name: regName,
      phone: regPhone,
      role: selectedRole,
      preferredLanguage: currentLanguage,
      district: regDistrict,
      village: regVillage,
      businessOrFarmName: regBusiness || (selectedRole === 'farmer' ? 'Family Bio-Farm' : 'Commercial Buyer'),
      profileImageUrl:
        selectedRole === 'farmer'
          ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isVerified: true,
    };

    registerNewUser(newUser);
    onLoginSuccess();
  };

  const handleQuickDemoLogin = (uid: string) => {
    const user = allUsers.find((u) => u.uid === uid);
    if (user) {
      loginUser(user);
      onLoginSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAF6] via-[#E8F5EC]/40 to-[#F1F8F4] flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* Top Navbar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#176B45] to-[#4F9B68] flex items-center justify-center text-white shadow-md shadow-[#176B45]/20 relative">
            <Sprout className="w-6 h-6 text-white" />
            <div className="absolute -top-1 -right-1 bg-[#E8B94D] text-[#18352A] p-0.5 rounded-full">
              <TrendingUp className="w-2.5 h-2.5 stroke-[3]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-[#176B45]">HASIRU</span>
              <span className="text-[10px] font-bold bg-[#176B45] text-white px-2 py-0.5 rounded-full">
                PS 1.2
              </span>
            </div>
            <p className="text-[11px] text-[#4F9B68] font-medium hidden sm:block">
              Smart Agriculture. Fair Prices. Direct Connections.
            </p>
          </div>
        </div>

        {/* Language switch */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white rounded-xl p-0.5 border border-[#C4D7C8] shadow-2xs">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                currentLanguage === 'en' ? 'bg-[#176B45] text-white' : 'text-gray-600'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('kn')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all font-kannada ${
                currentLanguage === 'kn' ? 'bg-[#176B45] text-white' : 'text-gray-600'
              }`}
            >
              ಕನ್ನಡ
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl w-full mx-auto my-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left column: Overview & Confidentiality Guard Rule */}
        <div className="lg:col-span-6 space-y-5">
          <div className="inline-flex items-center gap-2 bg-[#E8F5EC] text-[#176B45] px-3 py-1 rounded-full text-xs font-bold border border-[#4F9B68]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#E8B94D]" />
            <span>DevHost 2026 • Synergia SOSC Agritech</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#18352A] leading-tight">
            Direct Market Access for Marginal Farmers.
          </h1>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            HASIRU connects farmers directly with retail, hotel, and wholesale buyers across <strong>Dakshina Kannada and Udupi</strong> with 0% middleman commission.
          </p>

          {/* Solution Overview Pillars */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-[#E2EBDD] space-y-1">
              <div className="font-extrabold text-xs text-[#176B45] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#176B45]" />
                <span>Direct Marketplace</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Post harvest batches & connect directly with buyers via call or WhatsApp.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-[#E2EBDD] space-y-1">
              <div className="font-extrabold text-xs text-[#176B45] flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#E8B94D]" />
                <span>AI Price Predictor</span>
              </div>
              <p className="text-[11px] text-gray-500">
                APMC mandi guidance & 7-day forecast (e.g., Tomato prices projected +12%).
              </p>
            </div>
          </div>

          {/* CRITICAL: Farmer Confidentiality Guard Banner (from Slide & Prompt) */}
          <div className="bg-amber-50 border border-amber-300/80 p-4 rounded-2xl text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-amber-900 font-extrabold">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Farmer Confidentiality Guard Active</span>
            </div>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              <strong>Core Platform Principle:</strong> AI price analytics, APMC mandi spreads, and 7-day profit forecasts are <strong>strictly confidential to Farmer accounts</strong> to prevent unfair buyer bargaining.
            </p>
          </div>
        </div>

        {/* Right column: Registration & Login Card */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-[#E2EBDD] space-y-5">
          {/* Role Selection Tabs */}
          <div>
            <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider block mb-2">
              Select Your Platform Role
            </label>
            <div className="grid grid-cols-2 gap-2 bg-[#F1F5E9] p-1 rounded-2xl border border-[#C4D7C8]">
              <button
                type="button"
                onClick={() => setSelectedRole('farmer')}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  selectedRole === 'farmer'
                    ? 'bg-[#176B45] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>🌾 {t('roleFarmer')} (ರೈತರು)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('buyer')}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  selectedRole === 'buyer'
                    ? 'bg-[#176B45] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>🏢 {t('roleBuyer')} (ಖರೀದಿದಾರರು)</span>
              </button>
            </div>
          </div>

          {/* Role Capability Indicator */}
          <div className={`p-3 rounded-xl border text-xs ${
            selectedRole === 'farmer'
              ? 'bg-[#E8F5EC] border-[#C4D7C8] text-[#176B45]'
              : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}>
            {selectedRole === 'farmer' ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#176B45]" />
                <span>
                  <strong>Farmer Mode:</strong> Unlocks Farmer Dashboard, AI Price Predictor, 7-Day Forecasts & Kannada Voice Assistant.
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-blue-700" />
                <span>
                  <strong>Buyer Mode:</strong> Unlocks Marketplace, Call/WhatsApp Connect, and Purchase Bids. Price analytics remain confidential.
                </span>
              </div>
            )}
          </div>

          {/* Auth Mode Toggle (Login vs Register) */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-2 text-xs">
            <div className="flex gap-4">
              <button
                onClick={() => setAuthMode('login')}
                className={`font-extrabold pb-1 border-b-2 transition-all ${
                  authMode === 'login' ? 'border-[#176B45] text-[#176B45]' : 'border-transparent text-gray-400'
                }`}
              >
                Mobile OTP Login
              </button>
              <button
                onClick={() => setAuthMode('register')}
                className={`font-extrabold pb-1 border-b-2 transition-all ${
                  authMode === 'register' ? 'border-[#176B45] text-[#176B45]' : 'border-transparent text-gray-400'
                }`}
              >
                New Registration
              </button>
            </div>
            <span className="text-[10px] text-gray-400">Dakshina Kannada & Udupi</span>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Content */}
          {authMode === 'login' ? (
            <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-3.5">
              {!otpSent ? (
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Enter Mobile Number (10 digits):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="94812 34567"
                      className="w-full pl-12 pr-4 py-2.5 bg-[#F8FAF6] border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#176B45]/30 focus:border-[#176B45]"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-700">Enter OTP sent to +91 {phone}:</span>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-[#176B45] hover:underline"
                    >
                      Change number
                    </button>
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 1234"
                    maxLength={4}
                    className="w-full text-center tracking-widest text-lg font-black py-2.5 bg-[#F8FAF6] border border-[#176B45] rounded-xl text-[#176B45] focus:outline-none focus:ring-2 focus:ring-[#176B45]"
                  />
                  <p className="text-[11px] text-gray-400 text-center">
                    Demo verification code: <strong>1234</strong>
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#176B45] hover:bg-[#125537] text-white font-extrabold text-sm py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{otpSent ? 'Verify OTP & Enter' : 'Get OTP on Mobile'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Full Name:
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Ramesh Bhat"
                  className="w-full px-3 py-2 bg-[#F8FAF6] border border-gray-200 rounded-xl text-xs font-bold text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Mobile Number:
                  </label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="9481234567"
                    className="w-full px-3 py-2 bg-[#F8FAF6] border border-gray-200 rounded-xl text-xs font-bold text-gray-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    District:
                  </label>
                  <select
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#F8FAF6] border border-gray-200 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    <option value="Dakshina Kannada">Dakshina Kannada</option>
                    <option value="Udupi">Udupi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Village / Town:
                  </label>
                  <input
                    type="text"
                    value={regVillage}
                    onChange={(e) => setRegVillage(e.target.value)}
                    placeholder="e.g. Bantwal, Puttur, Kundapura"
                    className="w-full px-3 py-2 bg-[#F8FAF6] border border-gray-200 rounded-xl text-xs font-bold text-gray-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    {selectedRole === 'farmer' ? 'Farm / Plantation Name' : 'Company / Store Name'}:
                  </label>
                  <input
                    type="text"
                    value={regBusiness}
                    onChange={(e) => setRegBusiness(e.target.value)}
                    placeholder={selectedRole === 'farmer' ? 'e.g. Mani Bio Farms' : 'e.g. Coastal Fresh Mart'}
                    className="w-full px-3 py-2 bg-[#F8FAF6] border border-gray-200 rounded-xl text-xs font-bold text-gray-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#176B45] hover:bg-[#125537] text-white font-extrabold text-sm py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <span>Register & Open {selectedRole === 'farmer' ? 'Farmer Dashboard' : 'Buyer Marketplace'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick 1-Click Demo Logins for Hackathon Judges */}
          <div className="pt-3 border-t border-gray-100 space-y-2">
            <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider block">
              ⚡ 1-Click Demo Accounts for Judges:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('farmer-1')}
                className="p-2.5 rounded-xl border border-[#4F9B68]/30 bg-[#E8F5EC] hover:bg-[#D4EBDC] text-left text-xs transition-colors flex items-center gap-2.5 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-[#176B45] text-white flex items-center justify-center font-bold shrink-0">
                  👨‍🌾
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-extrabold text-[#176B45] group-hover:underline truncate">
                    Ramesh Bhat (Farmer)
                  </div>
                  <div className="text-[10px] text-gray-500 truncate">
                    Bantwal, DK • AI Price & Dashboard
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('buyer-1')}
                className="p-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-left text-xs transition-colors flex items-center gap-2.5 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold shrink-0">
                  🏢
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-extrabold text-blue-900 group-hover:underline truncate">
                    Hotel Ocean Pearl (Buyer)
                  </div>
                  <div className="text-[10px] text-gray-500 truncate">
                    Mangaluru • Confidential Guard Active
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="max-w-6xl w-full mx-auto text-center text-xs text-gray-400 pt-4 border-t border-[#E2EBDD]">
        <span>HASIRU Agri-Tech Platform • PS 1.2 Direct Market Access • Dakshina Kannada & Udupi, Karnataka</span>
      </div>
    </div>
  );
};
