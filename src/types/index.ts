export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface User {
  id: string;
  email: string;
  business_number: string;
  business_type: string;
  company_name: string;
  owner_name: string;
  grade: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price_per_unit: number;
  price_per_box: number;
  moq: number;
  image_url: string;
  origin?: string;
  expiry_info?: string;
  created_at: string;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  product_id: string;
  name: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: string;
  status: "주문완료" | "배송준비" | "배송중" | "배송완료";
  total_amount: number;
  delivery_address: string;
  delivery_date: string;
  is_cold: boolean;
  items: OrderItem[];
  created_at: string;
}

export interface TrendRankItem {
  rank: number;
  product_id: string;
  name: string;
  category: string;
  order_count: number;
  change: "up" | "down" | "same" | "new";
}

export interface TrendReport {
  period: "weekly" | "monthly";
  generated_at: string;
  ranking: TrendRankItem[];
}

export interface BestSellerReport {
  business_type: string;
  ranking: TrendRankItem[];
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

export interface CreateOrderRequest {
  items: { product_id: string; quantity: number }[];
  delivery_address: string;
  delivery_date: string;
  is_cold: boolean;
}

export interface CreateOrderResponse {
  order_id: string;
  total_amount: number;
  status: string;
}
