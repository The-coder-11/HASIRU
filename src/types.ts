export type UserRole = 'farmer' | 'buyer';
export type Language = 'en' | 'kn';

export interface UserProfile {
  uid: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  preferredLanguage: Language;
  district: 'Dakshina Kannada' | 'Udupi';
  village: string;
  businessOrFarmName?: string;
  profileImageUrl?: string;
  isVerified?: boolean;
}

export type CropCategory = 'Plantation Crops' | 'Spices' | 'Fruits' | 'Vegetables' | 'Grains & Pulses';

export type ProduceUnit = 'kg' | 'quintal' | 'tonne' | 'pieces';

export type ProduceGrade = 'Grade A (Premium)' | 'Grade B (Standard)' | 'Grade C';

export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerVillage: string;
  farmerDistrict: 'Dakshina Kannada' | 'Udupi';
  name: string;
  nameKn: string;
  category: CropCategory;
  imageUrl: string;
  quantityAvailable: number;
  unit: ProduceUnit;
  quality: ProduceGrade;
  harvestDate: string;
  harvestFreshness: 'Freshly Harvested' | 'Ready for Harvest' | 'Cured / Stored Dry';
  expectedPrice: number; // per unit
  minimumOrderQuantity: number;
  district: 'Dakshina Kannada' | 'Udupi';
  village: string;
  pickupArea: string;
  isOrganic: boolean;
  notes?: string;
  status: 'active' | 'paused' | 'sold_out';
  createdAt: string;
  distanceKm?: number;
  mandiBenchmark?: {
    modalPrice: number;
    marketName: string;
    diffPercent: number; // e.g. -5% or +4%
  };
}

export interface MandiPrice {
  id: string;
  commodity: string;
  commodityKn: string;
  category: CropCategory;
  market: string;
  district: 'Dakshina Kannada' | 'Udupi';
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: 'kg' | 'quintal';
  priceDate: string;
  source: string;
  dataStatus: 'Live APMC Feed' | 'Verified Agmarknet' | 'Demo Benchmark';
  history7Days: { date: string; price: number }[];
  sevenDayForecast?: {
    trend: 'rising' | 'stable' | 'softening';
    projectedChangePercent: number; // e.g. +12%
    forecastPrice: number;
    explanation: string;
  };
}

export type EnquiryStatus = 'pending' | 'accepted' | 'rejected' | 'countered';

export interface Enquiry {
  id: string;
  productId: string;
  productName: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerOrg: string;
  farmerId: string;
  farmerName: string;
  requestedQuantity: number;
  unit: ProduceUnit;
  offeredPrice: number; // per unit
  totalAmount: number;
  message: string;
  status: EnquiryStatus;
  transportPreference: 'Buyer Pick-up' | 'Farmer Deliver' | 'Shared Logistics';
  createdAt: string;
}

export type OrderStatus = 'pending' | 'accepted' | 'ready_for_pickup' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  enquiryId?: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: ProduceUnit;
  agreedPrice: number;
  grossValue: number;
  estimatedTransport: number;
  estimatedNetProceeds: number;
  status: OrderStatus;
  pickupLocation: string;
  district: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface PriceAlert {
  id: string;
  userId: string;
  commodity: string;
  targetPrice: number;
  unit: string;
  marketOrDistrict: string;
  direction: 'above' | 'below';
  enabled: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  titleKn: string;
  message: string;
  messageKn: string;
  type: 'order' | 'offer' | 'price_alert' | 'system';
  read: boolean;
  timestamp: string;
}

export interface AIPriceAdvice {
  suggestedMin: number;
  suggestedMax: number;
  recommendedPrice: number;
  rationaleEn: string;
  rationaleKn: string;
  marketTrend: 'rising' | 'stable' | 'softening';
  confidenceScore: number;
  keyFactors: string[];
  directAdvantagePercent: number;
  grossProceeds?: number;
  totalTransport?: number;
  netProceeds?: number;
  additionalGain?: number;
  forecast7Day?: {
    direction: 'rising' | 'stable' | 'softening';
    projectedPercent: number;
    projectedPrice: number;
    forecastRationale: string;
  };
}
