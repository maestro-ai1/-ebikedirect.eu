export interface ProductOption {
  frameSizes: string[];
  batteries: { label: string; capacityWh: number; priceDelta: number }[];
  colors: { name: string; hex: string }[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: 'E-MTB' | 'E-Trekking' | 'E-City' | 'Speed-Pedelec' | 'Cargo-E-Bike' | 'Falt-E-Bike' | 'E-Gravel' | 'E-Kinder' | 'Zubehör';
  /** Accessory group, matches /zubehoer/<group> (only for category Zubehör). */
  accessory?: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewsCount: number;
  motor: string;
  torqueNm: number;
  batteryStandardWh: number;
  rangeKm: number;
  weightKg: number;
  image: string;
  gallery: string[];
  shortDescription: string;
  description: string;
  options: ProductOption;
  specs: { [key: string]: string };
  isFeatured?: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedFrameSize: string;
  selectedBattery: { label: string; capacityWh: number; priceDelta: number };
  selectedColor: { name: string; hex: string };
  quantity: number;
  unitPrice: number;
}

export interface TrustpilotReview {
  id: string;
  name: string;
  location: string;
  language: 'de' | 'nl' | 'it' | 'es';
  stars: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  bikeModel?: string;
}

export interface SaleNotification {
  id: string;
  customerName: string;
  location: string;
  productName: string;
  productImage: string;
  price: number;
  timeAgo: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  author: {
    name: string;
    role: string;
  };
  image: string;
}

export interface Brand {
  name: string;
  country: string;
  description: string;
  svgLogo: string;
}
