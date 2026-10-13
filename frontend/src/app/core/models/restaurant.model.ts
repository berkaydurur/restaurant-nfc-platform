export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  tagline?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  coverUrl?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  websiteUrl?: string | null;
  primaryColor: string;
  accentColor: string;
  themeMode: string;
  fontFamily: string;
  wifiSsid?: string | null;
  wifiPassword?: string | null;
  wifiEncryption: string;
  wifiHidden: boolean;
  googleReviewUrl?: string | null;
  googlePlaceId?: string | null;
  googleMapsUrl?: string | null;
  instagramHandle?: string | null;
  whatsappNumber?: string | null;
  tripadvisorUrl?: string | null;
  currency: string;
  languageDefault: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenuCategory {
  id: string;
  restaurantId: string;
  name: string;
  nameEn?: string | null;
  description?: string | null;
  icon?: string | null;
  sortOrder: number;
  isActive: boolean;
  items?: MenuItem[];
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  nameEn?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  price: number;
  discountedPrice?: number | null;
  imageUrl?: string | null;
  isAvailable: boolean;
  isChefSpecial: boolean;
  isPopular: boolean;
  isNew: boolean;
  dietaryTags?: string | null; // e.g. "vejetaryen,glutensiz"
  allergens?: string | null;
  calories?: number | null;
  preparationTime?: number | null;
  sortOrder: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'RESTAURANT_OWNER';
}

export interface DashboardStats {
  totalNfcTaps: number;
  totalMenuViews: number;
  totalWifiConnects: number;
  totalGoogleReviews: number;
  totalWaiterCalls: number;
  recentEvents: {
    id: string;
    eventType: string;
    tableNumber?: string;
    createdAt: string;
  }[];
  eventsByDate: {
    date: string;
    nfcTaps: number;
    menuViews: number;
    wifiConnects: number;
    reviews: number;
  }[];
}

export interface WifiQrResponse {
  hasWifiConfig: boolean;
  ssid?: string;
  password?: string;
  encryption?: string;
  payload?: string;
  qrDataUrl?: string;
  qrSvg?: string;
}

export interface TableQrResponse {
  restaurantName: string;
  slug: string;
  tableNumber?: string;
  targetUrl: string;
  qrDataUrl: string;
}
