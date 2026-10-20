import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';
import {
  Inbox,
  ShoppingBag,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Phone,
  Building,
  CheckCircle2,
  Package,
  Layers,
  Calendar,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const OrdersEnquiriesView: React.FC = () => {
  const {
    currentUser,
    enquiries,
    orders,
    acceptEnquiryAndCreateOrder,
    rejectEnquiry,
    updateOrderStatus,
    currentLanguage,
    t,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'enquiries' | 'orders'>('enquiries');

  // Filter based on whether current user is Farmer or Buyer
  const userEnquiries = enquiries.filter((e) =>
    currentUser.role === 'farmer' ? e.farmerId === currentUser.uid : e.buyerId === currentUser.uid
  );

  const userOrders = orders.filter((o) =>
    currentUser.role === 'farmer' ? o.farmerId === currentUser.uid : o.buyerId === currentUser.uid
  );

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      {/* Header with Sub-tabs */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2EBDD] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-[#18352A]">
              {t('ordersTitle')} 📋
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">
              Track purchase bids, coordinate farmgate pickups, and manage direct fulfillment.
            </p>
          </div>

          <div className="flex bg-[#F1F5E9] p-1 rounded-xl border border-[#C4D7C8]">
            <button
              onClick={() => setActiveSubTab('enquiries')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'enquiries'
                  ? 'bg-white text-[#176B45] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('tabEnquiries')} ({userEnquiries.length})
            </button>
            <button
              onClick={() => setActiveSubTab('orders')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'orders'
                  ? 'bg-white text-[#176B45] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('tabOrders')} ({userOrders.length})
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Enquiries & Bids */}
      {activeSubTab === 'enquiries' && (
        <div className="space-y-4">
          {userEnquiries.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-[#E2EBDD]">
              <Inbox className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-semibold text-gray-600">No purchase bids or enquiries found.</p>
              <p className="text-xs text-gray-400 mt-1">
                {currentUser.role === 'farmer'
                  ? 'When buyers submit purchase bids for your harvest, they will appear here.'
                  : 'Browse the Marketplace to submit purchase offers to coastal farmers.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userEnquiries.map((enq) => {
                const isPending = enq.status === 'pending';
                const isAccepted = enq.status === 'accepted';
                const isRejected = enq.status === 'rejected';

                return (
                  <div
                    key={enq.id}
                    className={`bg-white rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all ${
                      isPending ? 'border-amber-300 shadow-xs' : 'border-[#E2EBDD]'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top status & date */}
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                            isPending
                              ? 'bg-amber-100 text-amber-800'
                              : isAccepted
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {enq.status.toUpperCase()}
                        </span>
                        <span className="text-gray-400 text-[11px] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(enq.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Produce & Price */}
                      <div>
                        <h4 className="font-extrabold text-base text-gray-900">
                          {enq.productName}
                        </h4>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {currentUser.role === 'farmer' ? (
                            <span>Buyer: <strong>{enq.buyerOrg || enq.buyerName}</strong></span>
                          ) : (
                            <span>Farmer: <strong>{enq.farmerName}</strong></span>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Offer Breakdown */}
                      <div className="grid grid-cols-3 gap-2 bg-[#F8FAF6] p-3 rounded-xl border border-[#E2EBDD] text-xs">
                        <div>
                          <span className="text-gray-400 text-[10px] uppercase font-bold block">Offered Rate</span>
                          <strong className="text-[#176B45] text-sm">₹{enq.offeredPrice}/{enq.unit}</strong>
                        </div>
                        <div>
                          <span className="text-gray-400 text-[10px] uppercase font-bold block">Quantity</span>
                          <strong className="text-gray-800 text-sm">{enq.requestedQuantity} {enq.unit}</strong>
                        </div>
                        <div>
                          <span className="text-gray-400 text-[10px] uppercase font-bold block">Total Deal</span>
                          <strong className="text-gray-900 text-sm">₹{enq.totalAmount.toLocaleString('en-IN')}</strong>
                        </div>
                      </div>

                      {/* Message and Logistics */}
                      <div className="text-xs space-y-1">
                        <div className="text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100 italic">
                          "{enq.message}"
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                          <span>Logistics: <strong>{enq.transportPreference}</strong></span>
                          <span>Contact: <strong>{enq.buyerPhone}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons (Only for Farmer when pending) */}
                    {currentUser.role === 'farmer' && isPending && (
                      <div className="pt-4 border-t border-gray-100 mt-3 flex items-center gap-2">
                        <button
                          onClick={() => acceptEnquiryAndCreateOrder(enq.id)}
                          className="flex-1 bg-[#176B45] hover:bg-[#125537] text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>{t('acceptOffer')} & Generate Order</span>
                        </button>
                        <button
                          onClick={() => rejectEnquiry(enq.id)}
                          className="px-3.5 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {isAccepted && (
                      <div className="pt-3 border-t border-emerald-100 mt-3 text-xs text-emerald-800 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Accepted! View under "Confirmed Direct Orders".</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Confirmed Orders */}
      {activeSubTab === 'orders' && (
        <div className="space-y-4">
          {userOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-[#E2EBDD]">
              <ShoppingBag className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-semibold text-gray-600">No confirmed orders yet.</p>
              <p className="text-xs text-gray-400 mt-1">
                When an enquiry or purchase offer is accepted, a formal order receipt is generated here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map((ord) => {
                return (
                  <div
                    key={ord.id}
                    className="bg-white rounded-2xl border border-[#E2EBDD] p-5 shadow-xs space-y-4"
                  >
                    {/* Top Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-[#176B45] uppercase tracking-wide">
                            Order #{ord.id.toUpperCase()}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              ord.status === 'ready_for_pickup'
                                ? 'bg-amber-100 text-amber-800'
                                : ord.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {ord.status.replace(/_/g, ' ').toUpperCase()}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-base text-gray-900 mt-0.5">
                          {ord.productName}
                        </h3>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-black text-[#176B45]">
                          ₹{ord.grossValue.toLocaleString('en-IN')}
                        </span>
                        <div className="text-[10px] text-gray-400">
                          Net Proceeds: ₹{ord.estimatedNetProceeds.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F8FAF6] p-3 rounded-xl border border-[#E2EBDD] text-xs">
                      <div>
                        <span className="text-gray-400 text-[10px] uppercase block">Agreed Price</span>
                        <strong className="text-gray-900">₹{ord.agreedPrice} / {ord.unit}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] uppercase block">Volume</span>
                        <strong className="text-gray-900">{ord.quantity} {ord.unit}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] uppercase block">Buyer Party</span>
                        <strong className="text-gray-900 truncate block">{ord.buyerName}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] uppercase block">Farmer Producer</span>
                        <strong className="text-gray-900 truncate block">{ord.farmerName}</strong>
                      </div>
                    </div>

                    {/* Pickup Address & Logistics */}
                    <div className="text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#E8F5EC]/50 p-3 rounded-xl border border-[#C4D7C8]/50">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#176B45] shrink-0" />
                        <div>
                          <span className="font-bold text-gray-800">Designated Pickup Hub: </span>
                          <span className="text-gray-600">{ord.pickupLocation} ({ord.district})</span>
                        </div>
                      </div>

                      {/* Status Action Workflow (Pending -> Ready for Pickup -> Completed) */}
                      {currentUser.role === 'farmer' && ord.status !== 'completed' && (
                        <div className="flex items-center gap-2">
                          {ord.status === 'accepted' && (
                            <button
                              onClick={() => updateOrderStatus(ord.id, 'ready_for_pickup')}
                              className="bg-[#176B45] hover:bg-[#125537] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
                            >
                              Mark Ready for Pickup
                            </button>
                          )}
                          {ord.status === 'ready_for_pickup' && (
                            <button
                              onClick={() => updateOrderStatus(ord.id, 'completed')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
                            >
                              Mark Completed & Delivered
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
