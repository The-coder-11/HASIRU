import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Store,
  LineChart,
  ClipboardList,
  Sparkles,
  PhoneCall,
  Lock,
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'marketplace' | 'price_insights' | 'orders' | 'ai_tools' | 'buyer_connect';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenAddProduce: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  onOpenAddProduce,
}) => {
  const { currentUser, enquiries, t } = useApp();

  const isFarmer = currentUser.role === 'farmer';

  // Pending counts
  const pendingEnquiriesCount = enquiries.filter(
    (e) => (isFarmer ? e.farmerId === currentUser.uid : e.buyerId === currentUser.uid) && e.status === 'pending'
  ).length;

  // Tabs configured strictly based on User Role (Farmer Confidentiality Guard)
  const tabs = isFarmer
    ? [
        {
          id: 'dashboard' as ActiveTab,
          label: t('home'),
          icon: LayoutDashboard,
        },
        {
          id: 'marketplace' as ActiveTab,
          label: t('marketplace'),
          icon: Store,
        },
        {
          id: 'price_insights' as ActiveTab,
          label: 'AI Price & Mandi',
          icon: LineChart,
        },
        {
          id: 'orders' as ActiveTab,
          label: t('orders'),
          icon: ClipboardList,
          badge: pendingEnquiriesCount > 0 ? pendingEnquiriesCount : undefined,
        },
        {
          id: 'ai_tools' as ActiveTab,
          label: 'AI Tools',
          icon: Sparkles,
        },
      ]
    : [
        {
          id: 'marketplace' as ActiveTab,
          label: t('marketplace'),
          icon: Store,
        },
        {
          id: 'orders' as ActiveTab,
          label: 'My Bids & Orders',
          icon: ClipboardList,
          badge: pendingEnquiriesCount > 0 ? pendingEnquiriesCount : undefined,
        },
        {
          id: 'buyer_connect' as ActiveTab,
          label: 'Farmer Connect',
          icon: PhoneCall,
        },
      ];

  return (
    <>
      {/* Desktop & Tablet Top Sub-bar */}
      <nav className="hidden md:block bg-white border-b border-[#E2EBDD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#176B45] text-[#176B45] bg-[#E8F5EC]/40'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#176B45]' : 'text-gray-500'}`} />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#E8B94D] text-[#18352A]">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}

              {/* Show Confidential Guard lock note for Buyers */}
              {!isFarmer && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400 px-3 py-2 italic">
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Price AI: Confidential (Farmer only)</span>
                </div>
              )}
            </div>

          {isFarmer && (
            <button
              onClick={onOpenAddProduce}
              className="my-1.5 flex items-center gap-2 bg-[#176B45] hover:bg-[#125537] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm shadow-[#176B45]/20 transition-all cursor-pointer"
            >
              <span>+ {t('addProduce')}</span>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2EBDD] px-2 py-1.5 shadow-lg">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex flex-col items-center py-1 px-2 rounded-lg transition-all cursor-pointer ${
                  isActive ? 'text-[#176B45] font-bold' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#176B45]' : 'text-gray-500'}`} />
                  {tab.badge !== undefined && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#E8B94D] text-[#18352A] text-[9px] font-extrabold flex items-center justify-center">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5 truncate max-w-[70px]">{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 w-6 h-0.5 bg-[#176B45] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
