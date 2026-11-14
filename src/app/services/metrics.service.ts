import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { DashboardMetrics } from '../models/dashboard-metrics.model';

@Injectable({ providedIn: 'root' })
export class MetricsService {
  private readonly http = inject(HttpClient);

  // Last metrics loaded (null until the first load)
  readonly metrics = signal<DashboardMetrics | null>(null);

  loadMetrics(): Observable<DashboardMetrics> {
    return this.http
      .get<DashboardMetrics>(`${environment.apiUrl}/panel/metrics`)
      .pipe(tap((metrics) => this.metrics.set(metrics)));
  }
}
