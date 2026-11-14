import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Billing, BillingSession } from '../models/billing.model';

@Injectable({ providedIn: 'root' })
export class BillingService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/panel/billing`;

  // Current plan (null until the first load)
  readonly billing = signal<Billing | null>(null);

  loadBilling(): Observable<Billing> {
    return this.http.get<Billing>(this.url).pipe(tap((billing) => this.billing.set(billing)));
  }

  // Stripe page to open: checkout (free plan) or customer portal (paid plan)
  createSession(): Observable<BillingSession> {
    return this.http.post<BillingSession>(`${this.url}/session`, null);
  }
}
