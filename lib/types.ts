export type TrustTier = "New" | "Rising" | "Verified" | "Elite";

export type StockStatus = "available" | "low" | "sold_out";

export interface Seller {
  id: string;
  username: string;
  fullName?: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  messengerUrl?: string;
  whatsappNum?: string | null;
  role?: string;
  trustScore?: number;
  trustTier?: string;
  idVerified?: boolean;
  tradesCount?: number;
  createdAt?: string;
  primaryColor?: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  productCount?: number;
}

export interface Product {
  id: string;
  sellerId: string;
  categoryId: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  stockQty: number;
  status: StockStatus;
  isFeatured: boolean;
  viewCount: number;
  createdAt: string;
}

export interface NotifyQueueItem {
  id: string;
  productId: string;
  contactMethod: "whatsapp" | "messenger";
  contactInfo: string;
  createdAt: string;
}
