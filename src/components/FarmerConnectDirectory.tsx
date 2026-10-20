import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Phone,
  MessageCircle,
  MapPin,
  ShieldCheck,
  Search,
  Building,
  Package,
} from 'lucide-react';

export const FarmerConnectDirectory: React.FC<{ onSelectProduct: (id: string) => void }> = ({
  onSelectProduct,
}) => {
  const { allUsers, products } = useApp();

  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState<'All' | 'Dakshina Kannada' | 'Udupi'>('All');

  const farmers = allUsers.filter((u) => u.role === 'farmer');

  const filteredFarmers = farmers.filter((f) => {
    if (districtFilter !== 'All' && f.district !== districtFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = f.name.toLowerCase().includes(q) || f.village.toLowerCase().includes(q);
      const matchFarm = (f.businessOrFarmName || '').toLowerCase().includes(q);
      return matchName || matchFarm;
    }
    return true;
  });

  const handleCall = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    window.location.href = `tel:+91${cleanPhone}`;
  };

  const handleWhatsApp = (farmerName: string, phone: string, farmName?: string) => {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const msg = encodeURIComponent(
      `Namaskara ${farmerName}, I am reaching out through the HASIRU Direct Agriculture Platform regarding your farm produce at ${farmName || 'your estate'}. We would like to request current harvest prices and discuss procurement.`
    );
    window.open(`https://wa.me/91${cleanPhone}?text=${msg}`, '_blank');
  };

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      <div className="bg-white rounded-2xl p-5 border border-[#E2EBDD] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#E8F5EC] text-[#176B45]">
                <Phone className="w-5 h-5" />
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#18352A]">
                Instant Farmer Connect Directory
              </h2>
            </div>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Reach local growers directly via direct phone call or WhatsApp quote request with zero middleman brokerage.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {(['All', 'Dakshina Kannada', 'Udupi'] as const).map((dist) => (
              <button
                key={dist}
                onClick={() => setDistrictFilter(dist)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  districtFilter === dist
                    ? 'bg-[#176B45] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {dist}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search verified farmers by name, plantation or taluk..."
            className="w-full pl-10 pr-4 py-2 bg-[#F8FAF6] border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#176B45]"
          />
        </div>
      </div>

      {/* Farmers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFarmers.map((f) => {
          const farmerProds = products.filter((p) => p.farmerId === f.uid && p.status === 'active');
          const cleanPhone = f.phone.replace(/\D/g, '').slice(-10);

          return (
            <div
              key={f.uid}
              className="bg-white rounded-2xl border border-[#E2EBDD] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <img
                    src={f.profileImageUrl}
                    alt={f.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-[#4F9B68]/30 shadow-2xs"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-base text-gray-900 truncate">
                        {f.name}
                      </h3>
                      <ShieldCheck className="w-4 h-4 text-[#176B45] shrink-0" />
                    </div>
                    <div className="text-xs text-gray-500 font-medium truncate mt-0.5">
                      {f.businessOrFarmName || 'Direct Bio-Farm'}
                    </div>
                    <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#4F9B68]" />
                      <span>{f.village}, {f.district}</span>
                    </div>
                  </div>
                </div>

                {/* Available Produce chips */}
                <div className="space-y-1.5 pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Active Harvest Batches ({farmerProds.length}):
                  </span>
                  {farmerProds.length === 0 ? (
                    <span className="text-xs text-gray-400 italic">No crops actively listed</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {farmerProds.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => onSelectProduct(p.id)}
                          className="bg-[#E8F5EC] hover:bg-[#D4EBDC] text-[#176B45] text-[11px] font-bold px-2 py-0.5 rounded-lg border border-[#4F9B68]/30 cursor-pointer"
                        >
                          {p.name} (₹{p.expectedPrice}/{p.unit})
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Instant Connect Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => handleCall(f.phone)}
                  className="py-2.5 px-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call Direct</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleWhatsApp(f.name, f.phone, f.businessOrFarmName)}
                  className="py-2.5 px-3 rounded-xl bg-[#176B45] hover:bg-[#125537] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#E8B94D]" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
