import { ACTION_NAVIGATE_SYNC, iAmReady, type NavigateSyncResponse, syncPathname } from '@tiendanube/nexo';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { nexo } from '../nexo';

// Keeps the panel route and the admin URL in sync, in both directions
export function NexoSync() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // React Router gives a new navigate function after every route change.
  // Keep the latest one in a ref so the effect below runs only once
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  // The admin tells us which route to show (first load, browser back button...).
  // We listen first and then send iAmReady, ONCE: the admin answers it with the initial route
  useEffect(() => {
    const unsubscribe = nexo.suscribe(ACTION_NAVIGATE_SYNC, ({ path, replace }: NavigateSyncResponse) => {
      navigateRef.current(path, { replace });
    });
    iAmReady(nexo);
    return unsubscribe;
  }, []);

  // We tell the admin our route, so it appears in the browser URL
  useEffect(() => {
    syncPathname(nexo, pathname);
  }, [pathname]);

  return null;
}
