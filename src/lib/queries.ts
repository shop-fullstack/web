import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "./api";
import type {
  ApiResponse,
  AuthResponse,
  Product,
  ProductListResponse,
  Order,
  TrendReport,
  BestSellerReport,
  User,
  CreateOrderRequest,
  CreateOrderResponse,
  RecommendationResponse,
  ForecastResponse,
} from "@/types";

// Auth
export function useLogin() {
  return useMutation({
    mutationFn: (body: { email: string; password: string }) =>
      api.post("/auth/login", body) as Promise<ApiResponse<AuthResponse>>,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (body: {
      email: string;
      password: string;
      business_number: string;
      business_type: string;
      company_name: string;
      owner_name: string;
    }) => api.post("/auth/register", body) as Promise<ApiResponse<AuthResponse>>,
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: () => api.post("/auth/logout") as Promise<ApiResponse<null>>,
  });
}

// Users
export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => api.get("/users/me") as Promise<ApiResponse<User>>,
  });
}

export function useUpdateMe() {
  return useMutation({
    mutationFn: (body: Partial<User>) =>
      api.patch("/users/me", body) as Promise<ApiResponse<User>>,
  });
}

// Products
export function useProducts(params?: {
  category?: string;
  sort?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () =>
      api.get("/products", { params }) as Promise<ApiResponse<ProductListResponse>>,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () =>
      api.get(`/products/${id}`) as Promise<ApiResponse<Product>>,
    enabled: !!id,
  });
}

// Orders
export function useCreateOrder() {
  return useMutation({
    mutationFn: (body: CreateOrderRequest) =>
      api.post("/orders", body) as Promise<ApiResponse<CreateOrderResponse>>,
  });
}

export function useOrders(status?: string) {
  return useQuery({
    queryKey: ["orders", status],
    queryFn: () =>
      api.get("/orders", {
        params: status && status !== "all" ? { status } : undefined,
      }) as Promise<ApiResponse<Order[]>>,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () =>
      api.get(`/orders/${id}`) as Promise<ApiResponse<Order>>,
    enabled: !!id,
  });
}

// Trend
export function useTrendReport(period: "weekly" | "monthly" = "weekly", limit?: number) {
  return useQuery({
    queryKey: ["trend-report", period, limit],
    queryFn: () =>
      api.get("/trend/report", {
        params: { period, ...(limit ? { limit } : {}) },
      }) as Promise<ApiResponse<TrendReport>>,
  });
}

export function useBestSellers(type: string, limit?: number) {
  return useQuery({
    queryKey: ["best-sellers", type, limit],
    queryFn: () =>
      api.get("/trend/best", {
        params: { type, ...(limit ? { limit } : {}) },
      }) as Promise<ApiResponse<BestSellerReport>>,
    enabled: !!type,
  });
}

// Recommendations
export function useRecommendations(businessType: string) {
  return useQuery({
    queryKey: ["recommendations", businessType],
    queryFn: async () => {
      try {
        return (await api.get("/recommend", {
          params: { business_type: businessType },
        })) as ApiResponse<RecommendationResponse>;
      } catch {
        const { generateMockRecommendations } = await import("./mock/recommend");
        return {
          statusCode: 200,
          message: "mock",
          data: generateMockRecommendations(businessType),
        } as ApiResponse<RecommendationResponse>;
      }
    },
    enabled: !!businessType,
    staleTime: 5 * 60 * 1000,
  });
}

// Forecast
export function useForecast(businessType: string) {
  return useQuery({
    queryKey: ["forecast", businessType],
    queryFn: async () => {
      try {
        return (await api.get("/forecast", {
          params: { business_type: businessType },
        })) as ApiResponse<ForecastResponse>;
      } catch {
        const { generateMockForecast } = await import("./mock/forecast");
        return {
          statusCode: 200,
          message: "mock",
          data: generateMockForecast(businessType),
        } as ApiResponse<ForecastResponse>;
      }
    },
    enabled: !!businessType,
    staleTime: 10 * 60 * 1000,
  });
}
