/**
 * @file src/app/state/hooks.ts
 * @description Typed Redux hooks for seamless type-safe state access across components.
 *
 * Invariants:
 * - Direct replacement for standard useDispatch / useSelector with RootState typing.
 */

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
