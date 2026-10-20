import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  X,
  CheckCircle,
  TrendingUp,
  Inbox,
  ShoppingBag,
  PlusCircle,
  Check,
} from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    priceAlerts,
    addPriceAlert,
    markNotificationRead,
    markAllNotificationsRead,
    currentLanguage,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'notifications' | 'alerts'>('notifications');

  // New alert form state
  const [commodity, setCommodity] = useState('Arecanut');
  const [targetPrice, setTargetPrice] = useState(460);
  const [unit, setUnit] = useState('kg');
  const [market, setMarket] = useState('Puttur CAMPCO');
  const [direction, setDirection] = useState<'above' | 'below'>('above');
  const [alertSaved, setAlertSaved] = useState(false);

  if (!isOpen) return null;

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    addPriceAlert({
      userId: 'user',
      commodity,
      targetPrice,
      unit,
      marketOrDistrict: market,
      direction,
      enabled: true,
    });
    setAlertSaved(true);
    setTimeout(() => setAlertSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E2EBDD] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#176B45] text-white p-5 rounded-t-3xl flex items-center justify-between sticky top-0 z-10 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E8B94D] text-[#18352A] flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base md:text-lg leading-tight">
                {t('notifications')} & {t('priceAlerts')}
              </h3>
              <p className="text-[11px] text-[#E8F5EC]">
                Instant activity updates and APMC market threshold triggers.
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

        {/* Sub-tabs */}
        <div className="flex border-b border-gray-100 px-5 pt-3">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'notifications'
                ? 'border-[#176B45] text-[#176B45]'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            {t('notifications')} ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'alerts'
                ? 'border-[#176B45] text-[#176B45]'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            {t('priceAlerts')} ({priceAlerts.length})
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {activeTab === 'notifications' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Recent Platform Alerts</span>
                <button
                  onClick={markAllNotificationsRead}
                  className="text-[#176B45] hover:underline font-bold text-[11px] cursor-pointer"
                >
                  Mark all as read
                </button>
              </div>

              {notifications.length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-xs">
                  {t('noNotifications')}
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-3.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                      n.read ? 'bg-gray-50/70 border-gray-200' : 'bg-[#E8F5EC]/60 border-[#4F9B68]/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold text-gray-900 flex items-center gap-1.5">
                        {n.type === 'offer' ? (
                          <Inbox className="w-3.5 h-3.5 text-amber-600" />
                        ) : n.type === 'order' ? (
                          <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <TrendingUp className="w-3.5 h-3.5 text-[#176B45]" />
                        )}
                        <span>{currentLanguage === 'kn' ? n.titleKn || n.title : n.title}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 shrink-0">{n.timestamp}</span>
                    </div>
                    <p className="text-gray-600 mt-1 text-[11px]">
                      {currentLanguage === 'kn' ? n.messageKn || n.message : n.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Form to add a new price alert */}
              <form onSubmit={handleCreateAlert} className="bg-[#F8FAF6] p-4 rounded-2xl border border-[#E2EBDD] space-y-3 text-xs">
                <h4 className="font-bold text-[#18352A] flex items-center gap-1">
                  <PlusCircle className="w-4 h-4 text-[#176B45]" />
                  <span>{t('setPriceAlert')}</span>
                </h4>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                      Commodity
                    </label>
                    <select
                      value={commodity}
                      onChange={(e) => setCommodity(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-semibold cursor-pointer"
                    >
                      <option value="Arecanut">Arecanut (ಅಡಿಕೆ)</option>
                      <option value="Coconut">Coconut (ತೆಂಗಿನಕಾಯಿ)</option>
                      <option value="White Pepper">White Pepper (ಬಿಳಿ ಕಾಳುಮೆಣಸು)</option>
                      <option value="Paddy (Jyothi)">Paddy / Red Rice</option>
                      <option value="Tomato">Tomato</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                      Target Price (₹)
                    </label>
                    <input
                      type="number"
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-bold text-[#176B45]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                      Market Yard
                    </label>
                    <select
                      value={market}
                      onChange={(e) => setMarket(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-semibold cursor-pointer"
                    >
                      <option value="Puttur CAMPCO">Puttur CAMPCO APMC</option>
                      <option value="Mangaluru APMC">Mangaluru APMC</option>
                      <option value="Bantwal APMC">Bantwal APMC</option>
                      <option value="Udupi APMC">Udupi APMC</option>
                      <option value="Kundapura APMC">Kundapura APMC</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                      Condition
                    </label>
                    <select
                      value={direction}
                      onChange={(e) => setDirection(e.target.value as any)}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-semibold cursor-pointer"
                    >
                      <option value="above">When price crosses above</option>
                      <option value="below">When price drops below</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#176B45] hover:bg-[#125537] text-white font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  {alertSaved ? 'Alert Trigger Saved!' : 'Save Mandi Price Alert'}
                </button>
              </form>

              {/* Active Alerts List */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase">Active Monitored Triggers:</span>
                {priceAlerts.map((alt) => (
                  <div key={alt.id} className="p-3 rounded-xl border border-gray-200 bg-white flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-gray-900">{alt.commodity}</div>
                      <div className="text-[10px] text-gray-500">
                        Notify if {alt.direction} ₹{alt.targetPrice}/{alt.unit} at {alt.marketOrDistrict}
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Monitoring Live
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
