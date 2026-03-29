export interface User {
  id: string;
  email: string;
  business_number: string;
  business_type: string;
  company_name: string;
  owner_name: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit_price: number;
  unit: string;
  unit_amount: number;
  image_url: string;
  description: string;
  origin: string;
  shelf_life: string;
  storage: string;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: string;
  order_number: string;
  status: "주문완료" | "배송준비" | "배송중" | "배송완료";
  items: OrderItem[];
  total_amount: number;
  delivery_address: string;
  delivery_date: string;
  is_cold: boolean;
  created_at: string;
  courier?: string;
  tracking_number?: string;
  estimated_delivery?: string;
}

export interface TrendItem {
  rank: number;
  product_name: string;
  sales_count: string;
  change: number;
}

export interface TrendReport {
  period: "weekly" | "monthly";
  top_product: string;
  top_category: string;
  total_categories: number;
  total_buyers: number;
  items: TrendItem[];
  category_distribution: { category: string; percentage: number }[];
}

export interface BestSellerItem {
  rank: number;
  product_name: string;
  price: string;
  sales_count: string;
}

export interface SubscriptionItem {
  id: string;
  product: Product;
  cycle: "1주" | "2주" | "월 1회";
  quantity: number;
  next_delivery: string;
  active: boolean;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
