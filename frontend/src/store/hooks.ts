import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from './store';

// Typed versions of the plain react-redux hooks.
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
