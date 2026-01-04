
export type Category = 'Kursus' | 'E-book' | 'Sistem' | 'Cetak' | 'Toolkit' | 'Templat';

export interface FAQ {
  question: string;
  answer: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  videoUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  category: Category;
  image: string;
  instructor?: string;
  features: string[];
  modules?: string[];
  faqs?: FAQ[];
}

export interface CourseProgress {
  productId: string;
  completedModules: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type PaymentMethodId = 'credit-card' | 'gopay' | 'ovo' | 'bank-transfer' | 'paypal';

export interface PaymentMethod {
  id: PaymentMethodId;
  name: string;
  icon: string;
  description: string;
}
