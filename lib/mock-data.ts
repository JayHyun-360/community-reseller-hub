import { Seller, Product, Category } from "./types";

const IMAGE_MAP: Record<string, string[]> = {
  keychain: [
    "https://images.unsplash.com/photo-1606103920295-972888a6ce90?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
  ],
  charm: [
    "https://images.unsplash.com/photo-1566576721346-d4a3b4eaad55?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1617038224558-28ad3fb558a7?auto=format&fit=crop&w=800&q=80",
  ],
  jacket: [
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
  ],
  denim: [
    "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1475178626620-a4d074967452?auto=format&fit=crop&w=800&q=80",
  ],
  clay: [
    "https://images.unsplash.com/photo-1621360841013-c7683c659ec6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
  ],
  plush: [
    "https://images.unsplash.com/photo-1559563458-527298cb2b42?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
  ],
  tee: [
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
  ],
  tshirt: [
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
  ],
  beaded: [
    "https://images.unsplash.com/photo-1627250682845-66708990a423?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=800&q=80",
  ],
  strap: [
    "https://images.unsplash.com/photo-1627250682845-66708990a423?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=800&q=80",
  ],
  sticker: [
    "https://images.unsplash.com/photo-1591522810850-58128c5fb089?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=800&q=80",
  ],
  bag: [
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
  ],
  phone: [
    "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
  ],
  ring: [
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
  ],
  necklace: [
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
  ],
  sanrio: [
    "https://images.unsplash.com/photo-1606103920295-972888a6ce90?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
  ],
  "hello kitty": [
    "https://images.unsplash.com/photo-1566576721346-d4a3b4eaad55?auto=format&fit=crop&w=800&q=80",
  ],
  cinnamoroll: [
    "https://images.unsplash.com/photo-1559563458-527298cb2b42?auto=format&fit=crop&w=800&q=80",
  ],
  ghibli: [
    "https://images.unsplash.com/photo-1591522810850-58128c5fb089?auto=format&fit=crop&w=800&q=80",
  ],
  vintage: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
  ],
  band: [
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
  ],
  nirvana: [
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
  ],
  y2k: [
    "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
  ],
  default: [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
  ],
};

export function getImageForProduct(
  title: string,
  description: string,
): string[] {
  const text = `${title} ${description}`.toLowerCase();

  const keywordOrder = [
    "sanrio",
    "hello kitty",
    "cinnamoroll",
    "ghibli",
    "keychain",
    "charm",
    "plush",
    "plushie",
    "jacket",
    "denim",
    "y2k",
    "vintage",
    "tee",
    "tshirt",
    "band",
    "nirvana",
    "clay",
    "beaded",
    "strap",
    "sticker",
    "bag",
    "phone",
    "ring",
    "necklace",
  ];

  for (const keyword of keywordOrder) {
    if (text.includes(keyword)) {
      const images = IMAGE_MAP[keyword];
      if (images && images.length > 0) {
        return [images[Math.floor(Math.random() * images.length)]];
      }
    }
  }

  return [
    IMAGE_MAP.default[Math.floor(Math.random() * IMAGE_MAP.default.length)],
  ];
}

export const MOCK_CATEGORIES: Category[] = [
  { id: "cat1", name: "All", emoji: "✨", productCount: 45 },
  { id: "cat2", name: "Keychains", emoji: "🔑", productCount: 12 },
  { id: "cat3", name: "Thrift", emoji: "👕", productCount: 8 },
  { id: "cat4", name: "Custom", emoji: "🎨", productCount: 15 },
  { id: "cat5", name: "Accessories", emoji: "💍", productCount: 10 },
];

export const MOCK_SELLERS: Seller[] = [
  {
    id: "s1",
    username: "keychainph",
    displayName: "Keychain PH by Charl Dul",
    avatarUrl: "https://picsum.photos/seed/charl-avatar/200",
    bio: "Sanrio, anime, custom keychains! Shipping nationwide from QC.",
    messengerUrl: "https://m.me/keychainph",
    whatsappNum: "639171234567",
    trustScore: 88,
    trustTier: "elite",
    idVerified: true,
    tradesCount: 142,
    createdAt: "2022-03-15",
    primaryColor: "#7B6FE8",
  },
  {
    id: "s2",
    username: "thrifthubmnl",
    displayName: "ThriftHub Manila",
    avatarUrl: "https://picsum.photos/seed/thrift-shop/200",
    bio: "Y2K thrift, vintage finds, pre-loved. Weekly drops!",
    messengerUrl: "https://m.me/thrifthubmnl",
    whatsappNum: null,
    trustScore: 62,
    trustTier: "verified",
    idVerified: true,
    tradesCount: 37,
    createdAt: "2023-01-08",
    primaryColor: "#1DB97A",
  },
  {
    id: "s3",
    username: "artisan.jen",
    displayName: "Artisan Jen",
    avatarUrl: "https://picsum.photos/seed/artisan-girl/200",
    bio: "Handmade clay charms and personalized jewelry.",
    messengerUrl: "https://m.me/artisanjen",
    whatsappNum: "639189876543",
    trustScore: 45,
    trustTier: "rising",
    idVerified: false,
    tradesCount: 12,
    createdAt: "2024-05-20",
    primaryColor: "#E86FAA",
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    sellerId: "s1",
    categoryId: "cat2",
    title: "Sanrio Keychain Set (5pcs)",
    description:
      "Cute pastel Sanrio characters. BPA-free acrylic. Perfect for bags!",
    price: 129,
    images: getImageForProduct(
      "Sanrio Keychain Set",
      "Cute pastel Sanrio characters",
    ),
    stockQty: 8,
    status: "available",
    isFeatured: true,
    viewCount: 340,
    createdAt: "2024-11-01",
  },
  {
    id: "p2",
    sellerId: "s1",
    categoryId: "cat2",
    title: "Hello Kitty Mini Charm",
    description: "Limited edition HK charm. Fits most phone cases and bags.",
    price: 89,
    images: getImageForProduct(
      "Hello Kitty Mini Charm",
      "Limited edition HK charm",
    ),
    stockQty: 2,
    status: "low",
    isFeatured: false,
    viewCount: 210,
    createdAt: "2024-11-05",
  },
  {
    id: "p3",
    sellerId: "s2",
    categoryId: "cat3",
    title: "Y2K Denim Cargo Jacket",
    description: "Authentic Y2K vibes, great condition. Oversized fit.",
    price: 320,
    images: getImageForProduct(
      "Y2K Denim Cargo Jacket",
      "Authentic Y2K denim jacket",
    ),
    stockQty: 0,
    status: "sold_out",
    isFeatured: true,
    viewCount: 185,
    createdAt: "2024-10-28",
  },
  {
    id: "p4",
    sellerId: "s3",
    categoryId: "cat4",
    title: "Custom Clay Bag Tag",
    description: "Personalized with your name. Choose your colors!",
    price: 150,
    images: getImageForProduct(
      "Custom Clay Bag Tag",
      "Handmade clay personalized tag",
    ),
    stockQty: 15,
    status: "available",
    isFeatured: false,
    viewCount: 95,
    createdAt: "2024-11-10",
  },
  {
    id: "p5",
    sellerId: "s1",
    categoryId: "cat2",
    title: "Cinnamoroll Plushie Clip",
    description: "Soft cinnamoroll clip for your backpack.",
    price: 199,
    images: getImageForProduct(
      "Cinnamoroll Plushie Clip",
      "Soft cute plushie clip",
    ),
    stockQty: 5,
    status: "available",
    isFeatured: false,
    viewCount: 420,
    createdAt: "2024-11-12",
  },
  {
    id: "p6",
    sellerId: "s2",
    categoryId: "cat3",
    title: "Vintage Nirvana Band Tee",
    description: "Distressed look, size L. One of a kind finds.",
    price: 450,
    images: getImageForProduct(
      "Vintage Nirvana Band Tee",
      "Distressed vintage band tee",
    ),
    stockQty: 1,
    status: "low",
    isFeatured: true,
    viewCount: 560,
    createdAt: "2024-11-13",
  },
  {
    id: "p7",
    sellerId: "s3",
    categoryId: "cat5",
    title: "Handmade Beaded Phone Strap",
    description: "Colorful Y2K style beaded strap with star charms.",
    price: 120,
    images: getImageForProduct(
      "Handmade Beaded Phone Strap",
      "Colorful beaded phone strap",
    ),
    stockQty: 10,
    status: "available",
    isFeatured: false,
    viewCount: 150,
    createdAt: "2024-11-14",
  },
  {
    id: "p8",
    sellerId: "s1",
    categoryId: "cat4",
    title: "Ghibli Inspired Sticker Pack",
    description: "10 waterproof stickers featuring your favorite characters.",
    price: 75,
    images: getImageForProduct(
      "Ghibli Inspired Sticker Pack",
      "Waterproof anime stickers",
    ),
    stockQty: 25,
    status: "available",
    isFeatured: true,
    viewCount: 890,
    createdAt: "2024-11-15",
  },
];
