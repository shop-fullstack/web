import type { ForecastResponse, ProductForecast, ForecastDataPoint } from "@/types";

const PRODUCT_SEEDS: { name: string; category: string; baseOrders: number }[] = [
  { name: "프리미엄 원두 1kg", category: "식자재", baseOrders: 120 },
  { name: "테이크아웃 컵 500개", category: "소모품", baseOrders: 85 },
  { name: "친환경 종이백 300장", category: "포장재", baseOrders: 65 },
  { name: "에스프레소 시럽 세트", category: "식자재", baseOrders: 45 },
  { name: "업소용 물티슈 100팩", category: "소모품", baseOrders: 95 },
  { name: "일회용 앞치마 200장", category: "소모품", baseOrders: 55 },
];

function getWeekLabel(weekOffset: number): string {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() + weekOffset * 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
  return `${fmt(start)}~${fmt(end)}`;
}

function generateWeeklyForecast(base: number, weekIndex: number): ForecastDataPoint {
  const seasonalFactor = 1 + 0.15 * Math.sin((weekIndex / 4) * Math.PI);
  const noise = 0.9 + Math.random() * 0.2;
  const predicted = Math.round(base * seasonalFactor * noise);
  const margin = Math.round(predicted * (0.1 + Math.random() * 0.1));

  return {
    week_label: getWeekLabel(weekIndex + 1),
    predicted_orders: predicted,
    confidence_low: predicted - margin,
    confidence_high: predicted + margin,
  };
}

export function generateMockForecast(businessType: string): ForecastResponse {
  const forecasts: ProductForecast[] = PRODUCT_SEEDS.map((seed, idx) => {
    const forecast: ForecastDataPoint[] = [];
    for (let w = 0; w < 4; w++) {
      forecast.push(generateWeeklyForecast(seed.baseOrders, w));
    }

    const firstWeek = forecast[0].predicted_orders;
    const lastWeek = forecast[3].predicted_orders;
    const changePercent = Math.round(((lastWeek - firstWeek) / firstWeek) * 100);

    let trend: ProductForecast["trend"];
    if (changePercent > 5) trend = "rising";
    else if (changePercent < -5) trend = "declining";
    else trend = "stable";

    return {
      product_id: `forecast-${idx + 1}`,
      product_name: seed.name,
      category: seed.category,
      current_weekly_avg: seed.baseOrders,
      forecast,
      trend,
      change_percent: changePercent,
    };
  });

  return {
    business_type: businessType,
    period: "4주",
    forecasts,
    generated_at: new Date().toISOString(),
  };
}
