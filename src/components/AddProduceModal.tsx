import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CropCategory, ProduceUnit, ProduceGrade } from '../types';
import {
  X,
  PlusCircle,
  Sparkles,
  Upload,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface AddProduceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPriceAdvisor: () => void;
  initialValues?: {
    crop?: string;
    price?: number;
    grade?: ProduceGrade;
    quantity?: number;
  };
}

export const AddProduceModal: React.FC<AddProduceModalProps> = ({
  isOpen,
  onClose,
  onOpenPriceAdvisor,
  initialValues,
}) => {
  const { currentUser, addProduct, currentLanguage, t } = useApp();

  // Photo presets for Dakshina Kannada & Udupi crops
  const photoPresets = [
    {
      name: 'Coconut',
      url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Arecanut',
      url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Pepper',
      url: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Banana',
      url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Red Rice',
      url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Tomato',
      url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const [cropName, setCropName] = useState(initialValues?.crop || 'Mature Coastal Coconuts');
  const [cropNameKn, setCropNameKn] = useState('ಕರಾವಳಿ ಬಲಿತ ತೆಂಗಿನಕಾಯಿ');
  const [category, setCategory] = useState<CropCategory>('Plantation Crops');
  const [imageUrl, setImageUrl] = useState(photoPresets[0].url);
  const [quantity, setQuantity] = useState<number>(initialValues?.quantity || 500);
  const [unit, setUnit] = useState<ProduceUnit>('kg');
  const [quality, setQuality] = useState<ProduceGrade>(initialValues?.grade || 'Grade A (Premium)');
  const [harvestFreshness, setHarvestFreshness] = useState<'Freshly Harvested' | 'Ready for Harvest' | 'Cured / Stored Dry'>('Freshly Harvested');
  const [expectedPrice, setExpectedPrice] = useState<number>(initialValues?.price || 38);
  const [minimumOrderQuantity, setMinimumOrderQuantity] = useState<number>(50);
  const [district, setDistrict] = useState<'Dakshina Kannada' | 'Udupi'>(currentUser.district);
  const [village, setVillage] = useState(currentUser.village.split(' ')[0] || 'Bantwal');
  const [pickupArea, setPickupArea] = useState('Farm Gate Pickup, Main Road junction');
  const [isOrganic, setIsOrganic] = useState(true);
  const [notes, setNotes] = useState('Direct harvest from family plantation. Well-graded, ready for loading.');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName.trim()) {
      setError('Please provide a crop name.');
      return;
    }
    if (quantity <= 0 || isNaN(quantity)) {
      setError('Please specify a valid quantity greater than zero.');
      return;
    }
    if (expectedPrice <= 0 || isNaN(expectedPrice)) {
      setError('Please specify a valid expected price.');
      return;
    }

    addProduct({
      farmerId: currentUser.uid,
      farmerName: currentUser.name,
      farmerPhone: currentUser.phone,
      farmerVillage: village,
      farmerDistrict: district,
      name: cropName,
      nameKn: cropNameKn,
      category,
      imageUrl,
      quantityAvailable: quantity,
      unit,
      quality,
      harvestDate: 'Fresh harvest',
      harvestFreshness,
      expectedPrice,
      minimumOrderQuantity,
      district,
      village,
      pickupArea,
      isOrganic,
      notes,
      status: 'active',
      mandiBenchmark: {
        modalPrice: expectedPrice - 3,
        marketName: district === 'Udupi' ? 'Udupi APMC' : 'Mangaluru APMC',
        diffPercent: 6,
      },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E2EBDD] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#176B45] text-white p-5 rounded-t-3xl flex items-center justify-between sticky top-0 z-10 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E8B94D] text-[#18352A] flex items-center justify-center font-bold">
              <PlusCircle className="w-5 h-5 text-[#18352A]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base md:text-lg leading-tight">
                List Produce for Direct Buyers
              </h3>
              <p className="text-[11px] text-[#E8F5EC]">
                Instant publication to Coastal Karnataka marketplace with 0% middleman fees.
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Photo Preset Selector */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">
              Select Crop Photo (or click a preset below):
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {photoPresets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setImageUrl(preset.url);
                    if (preset.name === 'Coconut') {
                      setCropName('Fresh Coastal Coconuts');
                      setCropNameKn('ಕರಾವಳಿ ಬಲಿತ ತೆಂಗಿನಕಾಯಿ');
                      setCategory('Plantation Crops');
                      setExpectedPrice(38);
                    } else if (preset.name === 'Arecanut') {
                      setCropName('Grade A Rashi Arecanut');
                      setCropNameKn('ಉತ್ತಮ ರಾಶಿ ಅಡಿಕೆ (ಚಾಲಿ)');
                      setCategory('Plantation Crops');
                      setExpectedPrice(450);
                    } else if (preset.name === 'Pepper') {
                      setCropName('Bold White Pepper');
                      setCropNameKn('ಪುತ್ತೂರು ಬಿಳಿ ಕಾಳುಮೆಣಸು');
                      setCategory('Spices');
                      setExpectedPrice(680);
                    } else if (preset.name === 'Banana') {
                      setCropName('Fresh Rasabale Banana Bunch');
                      setCropNameKn('ಕರಾವಳಿ ರಸಬಾಳೆ ಹಣ್ಣು');
                      setCategory('Fruits');
                      setExpectedPrice(44);
                    } else if (preset.name === 'Red Rice') {
                      setCropName('Traditional Jyothi Boiled Red Rice');
                      setCropNameKn('ಸಾಂಪ್ರದಾಯಿಕ ಜ್ಯೋತಿ ಕುಚುಲಕ್ಕಿ');
                      setCategory('Grains & Pulses');
                      setExpectedPrice(42);
                    } else if (preset.name === 'Tomato') {
                      setCropName('Farm-Fresh Country Tomatoes');
                      setCropNameKn('ತಾಜಾ ನಾಟಿ ಟೊಮೇಟೊ');
                      setCategory('Vegetables');
                      setExpectedPrice(24);
                    }
                  }}
                  className={`relative rounded-xl overflow-hidden w-16 h-16 shrink-0 border-2 transition-all cursor-pointer ${
                    imageUrl === preset.url ? 'border-[#176B45] ring-2 ring-[#176B45]/30 scale-95' : 'border-gray-200'
                  }`}
                >
                  <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] text-center font-bold py-0.5">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Crop Names (En & Kn) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Crop / Product Name (English) *
              </label>
              <input
                type="text"
                required
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                placeholder="e.g. Mature Coastal Coconuts"
                className="w-full px-3 py-2 bg-[#F8FAF6] border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#176B45]/30 focus:border-[#176B45]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                ಬೆಳೆ ಹೆಸರು (ಕನ್ನಡದಲ್ಲಿ - Kannada)
              </label>
              <input
                type="text"
                value={cropNameKn}
                onChange={(e) => setCropNameKn(e.target.value)}
                placeholder="ಉದಾಹರಣೆಗೆ: ಬಲಿತ ತೆಂಗಿನಕಾಯಿ"
                className="w-full px-3 py-2 bg-[#F8FAF6] border border-gray-200 rounded-xl text-xs font-bold text-gray-900 font-kannada focus:outline-none focus:ring-2 focus:ring-[#176B45]/30 focus:border-[#176B45]"
              />
            </div>
          </div>

          {/* Category & Quality Grade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Crop Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#F8FAF6] border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 cursor-pointer"
              >
                <option value="Plantation Crops">Plantation Crops (ತೆಂಗು / ಅಡಿಕೆ / ಗೋಡಂಬಿ)</option>
                <option value="Spices">Spices (ಕಾಳುಮೆಣಸು / ಏಲಕ್ಕಿ / ಶುಂಠಿ)</option>
                <option value="Fruits">Fruits (ಬಾಳೆ / ಮಾವು / ಹಲಸು)</option>
                <option value="Vegetables">Vegetables (ತರಕಾರಿಗಳು)</option>
                <option value="Grains & Pulses">Grains & Pulses (ಭತ್ತ / ಕುಚುಲಕ್ಕಿ)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Quality / Grade
              </label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#F8FAF6] border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 cursor-pointer"
              >
                <option value="Grade A (Premium)">Grade A (Premium Export Quality)</option>
                <option value="Grade B (Standard)">Grade B (Standard Commercial)</option>
                <option value="Grade C">Grade C (Mixed Size / Utility)</option>
              </select>
            </div>
          </div>

          {/* Quantity, Unit & Minimum Order Quantity */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Available Quantity *
              </label>
              <input
                type="number"
                required
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-[#F8FAF6] border border-gray-200 rounded-xl text-xs font-bold text-gray-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#F8FAF6] border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 cursor-pointer"
              >
                <option value="kg">kg</option>
                <option value="quintal">quintal</option>
                <option value="tonne">tonne</option>
                <option value="pieces">pieces</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Min. Order (MOQ)
              </label>
              <input
                type="number"
                value={minimumOrderQuantity}
                onChange={(e) => setMinimumOrderQuantity(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-[#F8FAF6] border border-gray-200 rounded-xl text-xs font-bold text-gray-900"
              />
            </div>
          </div>

          {/* Pricing & AI Advisor Trigger */}
          <div className="bg-[#E8F5EC] p-3.5 rounded-2xl border border-[#C4D7C8] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#176B45]">
                Expected Selling Price (₹ per {unit}) *
              </label>
              <button
                type="button"
                onClick={onOpenPriceAdvisor}
                className="text-[11px] bg-white text-[#176B45] hover:bg-[#176B45] hover:text-white px-2.5 py-1 rounded-lg border border-[#4F9B68]/30 font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E8B94D]" />
                <span>Consult AI Price Advisor</span>
              </button>
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-gray-500">₹</span>
              <input
                type="number"
                required
                value={expectedPrice}
                onChange={(e) => setExpectedPrice(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-3 py-2.5 bg-white border border-[#C4D7C8] rounded-xl text-base font-extrabold text-[#176B45] focus:outline-none focus:ring-2 focus:ring-[#176B45]"
              />
            </div>
            <p className="text-[10px] text-gray-500">
              Direct selling gives you 10-15% higher realization than distress sales at local APMC yards.
            </p>
          </div>

          {/* Location & Organic Certification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                District:
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#F8FAF6] border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 cursor-pointer"
              >
                <option value="Dakshina Kannada">Dakshina Kannada</option>
                <option value="Udupi">Udupi</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Village / Town:
              </label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="e.g. Bantwal, Puttur, Belthangady"
                className="w-full px-3 py-2 bg-[#F8FAF6] border border-gray-200 rounded-xl text-xs font-bold text-gray-900"
              />
            </div>
          </div>

          {/* Pickup Area & Organic Checkbox */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Pickup Area / Landmark (Public area until order confirmed):
            </label>
            <input
              type="text"
              value={pickupArea}
              onChange={(e) => setPickupArea(e.target.value)}
              placeholder="e.g. Near Mani Highway Junction Godown"
              className="w-full px-3 py-2 bg-[#F8FAF6] border border-gray-200 rounded-xl text-xs font-medium text-gray-900"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="organicToggle"
              checked={isOrganic}
              onChange={(e) => setIsOrganic(e.target.checked)}
              className="w-4 h-4 text-[#176B45] rounded accent-[#176B45] cursor-pointer"
            />
            <label htmlFor="organicToggle" className="text-xs font-bold text-gray-800 cursor-pointer">
              Grown with Natural / Organic bio-farming practices (Attracts coastal hotel premiums)
            </label>
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#176B45] hover:bg-[#125537] text-white font-extrabold text-xs md:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Confirm & Publish Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
