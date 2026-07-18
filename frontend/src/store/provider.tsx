'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch } from './hooks';
import { fetchMe } from './actions/authActions';
import { TOKEN_KEY } from '@/lib/axios';

/** On app load, rehydrate the user from the stored token (if any). */
function AuthBootstrap() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem(TOKEN_KEY)) {
      dispatch(fetchMe());
    }
  }, [dispatch]);
  return null;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthBootstrap />
      {children}
    </Provider>
  );
}
