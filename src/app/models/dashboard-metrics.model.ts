// Same as the backend GetDashboardMetricsUseCase.DashboardMetrics (GET /panel/metrics)
export interface DashboardMetrics {
  // Every request ever made in the store
  requested: number;
  // Requests already notified
  notified: number;
  // Requests still waiting for stock
  pending: number;
}
