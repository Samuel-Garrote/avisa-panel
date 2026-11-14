import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { StoreSettings } from '../models/store-settings.model';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/panel/settings`;

  // Last settings loaded or saved (null until the first load)
  readonly settings = signal<StoreSettings | null>(null);

  loadSettings(): Observable<StoreSettings> {
    return this.http.get<StoreSettings>(this.url).pipe(tap((settings) => this.settings.set(settings)));
  }

  // The backend returns the saved settings: the signal keeps what is really stored
  updateSettings(settings: StoreSettings): Observable<StoreSettings> {
    return this.http.put<StoreSettings>(this.url, settings).pipe(tap((saved) => this.settings.set(saved)));
  }
}
