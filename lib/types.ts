export interface Seller {
  id: string;
  username: string;
  fullName?: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  messengerUrl?: string;
  whatsappNum?: string | null;
  instagramHandle?: string | null;
  tiktokHandle?: string | null;
  role?: string;
  createdAt?: string;
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
  stockQty?: number;
  status?: string;
  isFeatured: boolean;
  likeCount?: number;
  viewCount?: number;
  tags?: string[];
  overallRating?: number | null; // decimal like 4.5, null if no ratings
  ratingCount?: number;
  commentCount?: number;
  createdAt: string;
}

export type CategoryFilterType =
  | "all"
  | "suggested"
  | "trending"
  | "category"
  | "browse";

export interface CategoryFilterItem {
  id: string;
  type: CategoryFilterType;
  name: string;
  emoji?: string;
  productCount?: number;
}

export type StockStatus = "available" | "low" | "sold_out";

export interface ProductRating {
  id: string;
  userId: string;
  productId: string;
  rating: number; // 1.0 to 5.0
  createdAt: string;
  updatedAt: string;
}

export interface ProductComment {
  id: string;
  userId: string;
  productId: string;
  commentText: string;
  createdAt: string;
  updatedAt: string;
  author?: Seller; // User info (populated on retrieval)
  rating?: number; // Current user's rating if viewing their own comment
}

export interface ProductRatingSummary {
  overallRating: number | null; // decimal like 4.5, null if no ratings
  ratingCount: number;
  commentCount: number;
  userRating?: number; // current user's rating if exists
  userComment?: ProductComment; // current user's comment if exists
}
