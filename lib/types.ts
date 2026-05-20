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
  likeCount: number;
  viewCount?: number;
  tags?: string[];
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
