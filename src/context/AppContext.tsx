import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Product,
  MandiPrice,
  Enquiry,
  Order,
  PriceAlert,
  NotificationItem,
  Language,
  OrderStatus,
  UserRole,
} from '../types';
import {
  SEED_USERS,
  SEED_PRODUCTS,
  SEED_MANDI_PRICES,
  SEED_ENQUIRIES,
  SEED_ORDERS,
  SEED_NOTIFICATIONS,
  SEED_PRICE_ALERTS,
} from '../data/seedData';
import { translations } from '../i18n/translations';

interface AppContextType {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  isAuthenticated: boolean;
  currentLanguage: Language;
  products: Product[];
  mandiPrices: MandiPrice[];
  enquiries: Enquiry[];
  orders: Order[];
  notifications: NotificationItem[];
  priceAlerts: PriceAlert[];
  favourites: string[];
  unreadNotifsCount: number;
  t: (key: keyof typeof translations['en']) => string;
  setLanguage: (lang: Language) => void;
  loginUser: (user: UserProfile) => void;
  registerNewUser: (user: UserProfile) => void;
  logoutUser: () => void;
  switchUser: (uid: string) => void;
  quickSwitchRole: () => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStatus: (id: string) => void;
  submitEnquiry: (enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) => Enquiry;
  acceptEnquiryAndCreateOrder: (enquiryId: string) => { enquiry: Enquiry; order: Order };
  rejectEnquiry: (enquiryId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  toggleFavourite: (productId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addPriceAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    return (localStorage.getItem('hasiru_lang') as Language) || 'en';
  });

  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('hasiru_all_users');
    return saved ? JSON.parse(saved) : SEED_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('hasiru_user_id') || 'farmer-1';
  });

  // Default isAuthenticated to false so the first screen is the registration/login page as requested!
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('hasiru_auth') === 'true';
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('hasiru_products');
    return saved ? JSON.parse(saved) : SEED_PRODUCTS;
  });

  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    const saved = localStorage.getItem('hasiru_enquiries');
    return saved ? JSON.parse(saved) : SEED_ENQUIRIES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('hasiru_orders');
    return saved ? JSON.parse(saved) : SEED_ORDERS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('hasiru_notifications');
    return saved ? JSON.parse(saved) : SEED_NOTIFICATIONS;
  });

  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(() => {
    const saved = localStorage.getItem('hasiru_alerts');
    return saved ? JSON.parse(saved) : SEED_PRICE_ALERTS;
  });

  const [favourites, setFavourites] = useState<string[]>(() => {
    const saved = localStorage.getItem('hasiru_favourites');
    return saved ? JSON.parse(saved) : ['prod-1'];
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('hasiru_lang', currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    localStorage.setItem('hasiru_auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('hasiru_user_id', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('hasiru_all_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('hasiru_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('hasiru_enquiries', JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    localStorage.setItem('hasiru_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('hasiru_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('hasiru_alerts', JSON.stringify(priceAlerts));
  }, [priceAlerts]);

  useEffect(() => {
    localStorage.setItem('hasiru_favourites', JSON.stringify(favourites));
  }, [favourites]);

  const currentUser = allUsers.find((u) => u.uid === currentUserId) || allUsers[0];

  const t = (key: keyof typeof translations['en']): string => {
    return translations[currentLanguage]?.[key] || translations['en'][key] || String(key);
  };

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
  };

  const loginUser = (user: UserProfile) => {
    setCurrentUserId(user.uid);
    setIsAuthenticated(true);
  };

  const registerNewUser = (newUser: UserProfile) => {
    setAllUsers((prev) => [newUser, ...prev]);
    setCurrentUserId(newUser.uid);
    setIsAuthenticated(true);
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
  };

  const switchUser = (uid: string) => {
    setCurrentUserId(uid);
    setIsAuthenticated(true);
  };

  const quickSwitchRole = () => {
    if (currentUser.role === 'farmer') {
      setCurrentUserId('buyer-1');
    } else {
      setCurrentUserId('farmer-1');
    }
    setIsAuthenticated(true);
  };

  const addProduct = (prodData: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProduct: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      distanceKm: Math.floor(Math.random() * 45) + 12,
    };

    setProducts((prev) => [newProduct, ...prev]);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `New Harvest Listed: ${newProduct.name}`,
      titleKn: `ಹೊಸ ಬೆಳೆ ಪಟ್ಟಿ: ${newProduct.nameKn || newProduct.name}`,
      message: `${newProduct.farmerName} in ${newProduct.village} listed ${newProduct.quantityAvailable} ${newProduct.unit} at ₹${newProduct.expectedPrice}/${newProduct.unit}.`,
      messageKn: `${newProduct.village}ಯ ${newProduct.farmerName} ಅವರು ₹${newProduct.expectedPrice} ದರದಲ್ಲಿ ${newProduct.quantityAvailable} ${newProduct.unit} ಬೆಳೆ ಪಟ್ಟಿ ಮಾಡಿದ್ದಾರೆ.`,
      type: 'system',
      read: false,
      timestamp: 'Just now',
    };
    setNotifications((prev) => [notif, ...prev]);

    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleProductStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStatus = p.status === 'active' ? 'paused' : 'active';
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  const submitEnquiry = (enquiryData: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Enquiry => {
    const newEnquiry: Enquiry = {
      ...enquiryData,
      id: `enq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    setEnquiries((prev) => [newEnquiry, ...prev]);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `New Bid from ${newEnquiry.buyerOrg || newEnquiry.buyerName}`,
      titleKn: `${newEnquiry.buyerOrg || newEnquiry.buyerName} ಅವರಿಂದ ಹೊಸ ಆಫರ್`,
      message: `${newEnquiry.buyerName} offered ₹${newEnquiry.offeredPrice}/${newEnquiry.unit} for ${newEnquiry.requestedQuantity} ${newEnquiry.unit} of ${newEnquiry.productName}.`,
      messageKn: `${newEnquiry.productName} ಬೆಳೆಗೆ ಪ್ರತಿ ${newEnquiry.unit}ಗೆ ₹${newEnquiry.offeredPrice} ದರದಲ್ಲಿ ${newEnquiry.requestedQuantity} ${newEnquiry.unit} ಖರೀದಿಸಲು ಆಫರ್ ಬಂದಿದೆ.`,
      type: 'offer',
      read: false,
      timestamp: 'Just now',
    };
    setNotifications((prev) => [notif, ...prev]);

    return newEnquiry;
  };

  const acceptEnquiryAndCreateOrder = (enquiryId: string) => {
    const enq = enquiries.find((e) => e.id === enquiryId);
    if (!enq) throw new Error('Enquiry not found');

    const updatedEnquiries = enquiries.map((e) =>
      e.id === enquiryId ? { ...e, status: 'accepted' as const } : e
    );
    setEnquiries(updatedEnquiries);

    const targetProd = products.find((p) => p.id === enq.productId);
    if (targetProd) {
      const remainingQty = Math.max(0, targetProd.quantityAvailable - enq.requestedQuantity);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === targetProd.id
            ? {
                ...p,
                quantityAvailable: remainingQty,
                status: remainingQty === 0 ? 'sold_out' : p.status,
              }
            : p
        )
      );
    }

    const gross = enq.requestedQuantity * enq.offeredPrice;
    const estimatedTransport = Math.round(enq.requestedQuantity * 1.5);
    const estimatedNet = gross - estimatedTransport;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      enquiryId: enq.id,
      buyerId: enq.buyerId,
      buyerName: enq.buyerOrg ? `${enq.buyerName} (${enq.buyerOrg})` : enq.buyerName,
      buyerPhone: enq.buyerPhone,
      farmerId: enq.farmerId,
      farmerName: enq.farmerName,
      farmerPhone: targetProd ? targetProd.farmerPhone : '9481234567',
      productId: enq.productId,
      productName: enq.productName,
      quantity: enq.requestedQuantity,
      unit: enq.unit,
      agreedPrice: enq.offeredPrice,
      grossValue: gross,
      estimatedTransport: estimatedTransport,
      estimatedNetProceeds: estimatedNet,
      status: 'accepted',
      pickupLocation: targetProd ? `${targetProd.village}, ${targetProd.pickupArea}` : 'Bantwal Farmgate',
      district: targetProd ? targetProd.district : 'Dakshina Kannada',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: `Offer accepted by farmer. Agreed rate ₹${enq.offeredPrice}/${enq.unit}. Ready for logistics coordination.`,
    };

    setOrders((prev) => [newOrder, ...prev]);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Order Accepted: ${newOrder.productName}`,
      titleKn: `ಆರ್ಡರ್ ದೃಢಪಟ್ಟಿದೆ: ${newOrder.productName}`,
      message: `Direct order created for ${newOrder.quantity} ${newOrder.unit} at ₹${newOrder.agreedPrice}/${newOrder.unit}. Total Value: ₹${newOrder.grossValue.toLocaleString('en-IN')}`,
      messageKn: `${newOrder.quantity} ${newOrder.unit} ಪ್ರಮಾಣಕ್ಕೆ ಒಟ್ಟು ₹${newOrder.grossValue.toLocaleString('en-IN')} ಮೌಲ್ಯದ ನೇರ ಆರ್ಡರ್ ದೃಢಪಟ್ಟಿದೆ.`,
      type: 'order',
      read: false,
      timestamp: 'Just now',
    };
    setNotifications((prev) => [notif, ...prev]);

    return { enquiry: { ...enq, status: 'accepted' as const }, order: newOrder };
  };

  const rejectEnquiry = (enquiryId: string) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === enquiryId ? { ...e, status: 'rejected' as const } : e))
    );
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status,
              updatedAt: new Date().toISOString(),
            }
          : o
      )
    );

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Order #${orderId.toUpperCase()} Status: ${status.replace(/_/g, ' ')}`,
      titleKn: `ಆರ್ಡರ್ #${orderId.toUpperCase()} ಸ್ಥಿತಿ ನವೀಕರಿಸಲಾಗಿದೆ`,
      message: `The order status has been updated to ${status.replace(/_/g, ' ')}.`,
      messageKn: `ಆರ್ಡರ್ ಸ್ಥಿತಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಬದಲಾಯಿಸಲಾಗಿದೆ.`,
      type: 'order',
      read: false,
      timestamp: 'Just now',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const toggleFavourite = (productId: string) => {
    setFavourites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addPriceAlert = (alertData: Omit<PriceAlert, 'id' | 'createdAt'>) => {
    const newAlert: PriceAlert = {
      ...alertData,
      id: `alert-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setPriceAlerts((prev) => [newAlert, ...prev]);
  };

  const resetDemoData = () => {
    localStorage.removeItem('hasiru_products');
    localStorage.removeItem('hasiru_enquiries');
    localStorage.removeItem('hasiru_orders');
    localStorage.removeItem('hasiru_notifications');
    localStorage.removeItem('hasiru_alerts');
    localStorage.removeItem('hasiru_favourites');
    localStorage.removeItem('hasiru_all_users');
    setAllUsers(SEED_USERS);
    setProducts(SEED_PRODUCTS);
    setEnquiries(SEED_ENQUIRIES);
    setOrders(SEED_ORDERS);
    setNotifications(SEED_NOTIFICATIONS);
    setPriceAlerts(SEED_PRICE_ALERTS);
    setFavourites(['prod-1']);
    setCurrentUserId('farmer-1');
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        isAuthenticated,
        currentLanguage,
        products,
        mandiPrices: SEED_MANDI_PRICES,
        enquiries,
        orders,
        notifications,
        priceAlerts,
        favourites,
        unreadNotifsCount,
        t,
        setLanguage,
        loginUser,
        registerNewUser,
        logoutUser,
        switchUser,
        quickSwitchRole,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStatus,
        submitEnquiry,
        acceptEnquiryAndCreateOrder,
        rejectEnquiry,
        updateOrderStatus,
        toggleFavourite,
        markNotificationRead,
        markAllNotificationsRead,
        addPriceAlert,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
