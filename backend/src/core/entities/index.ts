export interface RestaurantEntity {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuCategoryEntity {
  id: string;
  restaurantId: string;
  name: string;
  nameEn?: string | null;
  description?: string | null;
  icon?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItemEntity {
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
  dietaryTags?: string | null;
  allergens?: string | null;
  calories?: number | null;
  preparationTime?: number | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'SUPER_ADMIN' | 'RESTAURANT_OWNER';
  restaurantId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalyticsEventEntity {
  id: string;
  restaurantId: string;
  eventType: 'NFC_TAP' | 'MENU_VIEW' | 'WIFI_CONNECT' | 'GOOGLE_REVIEW' | 'WAITER_CALL';
  tableNumber?: string | null;
  metadata?: string | null;
  createdAt: Date;
}
