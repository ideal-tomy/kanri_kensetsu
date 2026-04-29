import type { RevenueForecast } from "@/types/domain";

export const revenueForecasts: RevenueForecast[] = [
  {
    id: "rf1",
    projectId: "p1",
    month: "2026-04",
    forecastAmount: 4200000,
    confidence: 0.82,
    actualAmount: 3980000,
  },
  {
    id: "rf2",
    projectId: "p2",
    month: "2026-04",
    forecastAmount: 2800000,
    confidence: 0.74,
    actualAmount: 2630000,
  },
  {
    id: "rf3",
    projectId: "p3",
    month: "2026-05",
    forecastAmount: 3600000,
    confidence: 0.7,
  },
];
