import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Scale, MapPin, CheckCircle2, TrendingUp, Heart } from 'lucide-react';

interface CompareModalProps {
  productIds: string[];
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (id: string) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  productIds,
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const { products, currentLanguage } = useApp();

  if (!isOpen || productIds.length === 0) return null;

  const compareProducts = products.filter((p) => productIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E2EBDD] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#176B45] text-white p-5 rounded-t-3xl flex items-center justify-between sticky top-0 z-10 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E8B94D] text-[#18352A] flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base md:text-lg leading-tight">
                Side-by-Side Produce Comparison
              </h3>
              <p className="text-[11px] text-[#E8F5EC]">
                Evaluating {compareProducts.length} listings in Dakshina Kannada & Udupi
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

        {/* Comparison Table Grid */}
        <div className="p-5 md:p-6 overflow-x-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-[550px]">
            {compareProducts.map((p) => (
              <div
                key={p.id}
                className="bg-[#F8FAF6] rounded-2xl border border-[#E2EBDD] p-4 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="relative h-36 rounded-xl overflow-hidden mb-3">
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs font-black px-2 py-0.5 rounded">
                      ₹{p.expectedPrice}/{p.unit}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-gray-900 line-clamp-1">
                    {currentLanguage === 'kn' ? p.nameKn || p.name : p.name}
                  </h4>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    {p.farmerName} • {p.village}
                  </div>

                  {/* Attributes list */}
                  <div className="space-y-2 mt-3 pt-3 border-t border-gray-200 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Quality Grade:</span>
                      <strong className="text-gray-900">{p.quality}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Stock Available:</span>
                      <strong className="text-gray-900">{p.quantityAvailable} {p.unit}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Min Order Qty:</span>
                      <span className="text-gray-700">{p.minimumOrderQuantity} {p.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Proximity:</span>
                      <span className="font-semibold text-gray-900">{p.distanceKm} km away</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Organic Farming:</span>
                      <span className="font-bold text-[#176B45]">{p.isOrganic ? 'Yes (Certified)' : 'Standard'}</span>
                    </div>

                    {p.mandiBenchmark && (
                      <div className="bg-[#E8F5EC] p-2 rounded-lg text-[10px] text-[#176B45] font-bold text-center">
                        {p.mandiBenchmark.diffPercent <= 0 ? '🟢 At/Below Mandi' : `+${p.mandiBenchmark.diffPercent}% vs Mandi`}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onSelectProduct(p.id);
                  }}
                  className="w-full bg-[#176B45] hover:bg-[#125537] text-white font-bold text-xs py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Select & Make Offer
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
