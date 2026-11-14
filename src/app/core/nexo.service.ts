import { Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  ACTION_LOG_ERROR,
  ACTION_NAVIGATE_SYNC,
  connect,
  create,
  getSessionToken,
  iAmReady,
  NavigateSyncResponse,
  openInDefaultBrowser,
  syncPathname,
} from '@tiendanube/nexo';
import { filter } from 'rxjs';
import { environment } from '../../environments/environment';

// Connection between the panel and the Tiendanube admin it is embedded in (Nexo SDK)
@Injectable({ providedIn: 'root' })
export class NexoService {
  private readonly nexo = create({
    clientId: environment.tiendanubeClientId,
    log: !environment.production,
  });

  // null: connecting, true: inside the admin, false: opened outside the admin
  readonly connected = signal<boolean | null>(null);

  // Called once when the app starts (see app.config.ts)
  async start(router: Router): Promise<void> {
    try {
      // Waits up to 3 seconds for the admin to answer
      await connect(this.nexo);
    } catch {
      this.connected.set(false);
      return;
    }

    // The admin tells us which route to show (e.g. the merchant used the browser back button)
    this.nexo.suscribe(ACTION_NAVIGATE_SYNC, ({ path, replace }: NavigateSyncResponse) => {
      router.navigateByUrl(path, { replaceUrl: replace });
    });

    // We tell the admin our route, so it appears in the browser URL
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => syncPathname(this.nexo, event.urlAfterRedirects));

    // Must be sent after listening to ACTION_NAVIGATE_SYNC: the admin answers with the initial route
    iAmReady(this.nexo);
    this.connected.set(true);
  }

  // JWT signed by Tiendanube with our client secret; the backend checks it (NexoSessionTokenFilter)
  getSessionToken(): Promise<string> {
    return getSessionToken(this.nexo);
  }

  // Stripe pages cannot be shown inside the admin iframe: open them in the browser
  openInBrowser(url: string): void {
    openInDefaultBrowser(this.nexo, url);
  }

  // Reports an error to the admin (replaces Nexo's React-only ErrorBoundary)
  logError(error: unknown): void {
    const err = error instanceof Error ? error : new Error(String(error));
    this.nexo.dispatch({
      type: ACTION_LOG_ERROR,
      payload: { url: window.location.href, message: err.message, stack: err.stack ?? '' },
    });
  }
}
