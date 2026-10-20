import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthPage } from './components/AuthPage';
import { Header } from './components/Header';
import { Navigation, ActiveTab } from './components/Navigation';
import { FarmerDashboard } from './components/FarmerDashboard';
import { Marketplace } from './components/Marketplace';
import { PriceInsights } from './components/PriceInsights';
import { OrdersEnquiriesView } from './components/OrdersEnquiriesView';
import { AIToolsHub } from './components/AIToolsHub';
import { FarmerConnectDirectory } from './components/FarmerConnectDirectory';
import { AddProduceModal } from './components/AddProduceModal';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { AIPriceAdvisorModal } from './components/AIPriceAdvisorModal';
import { OfferComparisonModal } from './components/OfferComparisonModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CompareModal } from './components/CompareModal';
import { NotificationsModal } from './components/NotificationsModal';
import { ProfileModal } from './components/ProfileModal';
import { ProduceGrade } from './types';

const MainAppContent: React.FC = () => {
  const { currentUser, isAuthenticated, logoutUser } = useApp();

  const isFarmer = currentUser.role === 'farmer';

  // Role-based initial tab: Farmers start on dashboard; Buyers start on marketplace
  const [activeTab, setActiveTab] = useState<ActiveTab>(isFarmer ? 'dashboard' : 'marketplace');

  // Modals state
  const [isAddProduceOpen, setIsAddProduceOpen] = useState(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [isPriceAdvisorOpen, setIsPriceAdvisorOpen] = useState(false);
  const [isOfferComparisonOpen, setIsOfferComparisonOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [compareProductIds, setCompareProductIds] = useState<string[]>([]);

  // State passed from AI advisor to listing form
  const [advisorPrefill, setAdvisorPrefill] = useState<{
    crop?: string;
    price?: number;
    grade?: ProduceGrade;
    quantity?: number;
  }>({});

  const handleApplyAdvisorPrice = (
    crop: string,
    price: number,
    grade: ProduceGrade,
    quantity: number
  ) => {
    setAdvisorPrefill({ crop, price, grade, quantity });
    setIsAddProduceOpen(true);
  };

  // If user is not authenticated, show the Farmer and Buyer Registration / Login page first!
  if (!isAuthenticated) {
    return (
      <AuthPage
        onLoginSuccess={() => {
          // Route immediately based on role
          setActiveTab(currentUser.role === 'farmer' ? 'dashboard' : 'marketplace');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF6] text-[#18352A] flex flex-col font-sans">
      {/* Top Header */}
      <Header
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
        onSignOut={() => logoutUser()}
      />

      {/* Main Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onOpenAddProduce={() => setIsAddProduceOpen(true)}
      />

      {/* Main Scrollable Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-5">
        {/* Render Farmer Dashboard only when role is Farmer */}
        {activeTab === 'dashboard' && (
          isFarmer ? (
            <FarmerDashboard
              onOpenAddProduce={() => setIsAddProduceOpen(true)}
              onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
              onOpenPriceAdvisor={() => setIsPriceAdvisorOpen(true)}
              onOpenOfferComparison={() => setIsOfferComparisonOpen(true)}
              onSelectProduct={(id) => setSelectedProductId(id)}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          ) : (
            <Marketplace
              onSelectProduct={(id) => setSelectedProductId(id)}
              onOpenCompare={(ids) => setCompareProductIds(ids)}
              onOpenAddProduce={() => setIsAddProduceOpen(true)}
            />
          )
        )}

        {activeTab === 'marketplace' && (
          <Marketplace
            onSelectProduct={(id) => setSelectedProductId(id)}
            onOpenCompare={(ids) => setCompareProductIds(ids)}
            onOpenAddProduce={() => setIsAddProduceOpen(true)}
          />
        )}

        {/* Price Insights: Active for Farmers; Confidential for Buyers */}
        {activeTab === 'price_insights' && (
          <PriceInsights
            onOpenPriceAdvisor={() => setIsPriceAdvisorOpen(true)}
            onNavigateToMarketplace={() => setActiveTab('marketplace')}
          />
        )}

        {activeTab === 'orders' && <OrdersEnquiriesView />}

        {/* AI Tools Hub: Available for Farmers */}
        {activeTab === 'ai_tools' && (
          <AIToolsHub
            onOpenPriceAdvisor={() => setIsPriceAdvisorOpen(true)}
            onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
            onOpenOfferComparison={() => setIsOfferComparisonOpen(true)}
            onNavigateToMarketplace={() => setActiveTab('marketplace')}
          />
        )}

        {/* Farmer Connect Directory for Buyers */}
        {activeTab === 'buyer_connect' && (
          <FarmerConnectDirectory
            onSelectProduct={(id) => setSelectedProductId(id)}
          />
        )}
      </main>

      {/* Modals & Overlays */}
      <AddProduceModal
        isOpen={isAddProduceOpen}
        onClose={() => setIsAddProduceOpen(false)}
        onOpenPriceAdvisor={() => {
          setIsAddProduceOpen(false);
          setIsPriceAdvisorOpen(true);
        }}
        initialValues={advisorPrefill}
      />

      <VoiceAssistantModal
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
        onListingPublished={() => setActiveTab('marketplace')}
      />

      <AIPriceAdvisorModal
        isOpen={isPriceAdvisorOpen}
        onClose={() => setIsPriceAdvisorOpen(false)}
        onApplyPriceToListing={handleApplyAdvisorPrice}
      />

      <OfferComparisonModal
        isOpen={isOfferComparisonOpen}
        onClose={() => setIsOfferComparisonOpen(false)}
      />

      <ProductDetailModal
        productId={selectedProductId}
        onClose={() => setSelectedProductId(null)}
        onOfferSubmitted={() => setActiveTab('orders')}
      />

      <CompareModal
        productIds={compareProductIds}
        isOpen={compareProductIds.length > 0}
        onClose={() => setCompareProductIds([])}
        onSelectProduct={(id) => {
          setCompareProductIds([]);
          setSelectedProductId(id);
        }}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
