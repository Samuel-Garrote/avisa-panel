import { useCallback, useEffect, useState } from 'react';

type RequestState<T> =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; data: T };

// Loads data once when the page opens; reload() repeats the request (used by the error page "Retry" button)
export function useRequest<T>(load: () => Promise<T>) {
  const [state, setState] = useState<RequestState<T>>({ status: 'loading' });

  const reload = useCallback(() => {
    setState({ status: 'loading' });
    load()
      .then((data) => setState({ status: 'success', data }))
      .catch(() => setState({ status: 'error' }));
  }, [load]);

  useEffect(reload, [reload]);

  return { state, reload, setState };
}
