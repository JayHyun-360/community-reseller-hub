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
  viewCount: number;
  createdAt: string;
}
