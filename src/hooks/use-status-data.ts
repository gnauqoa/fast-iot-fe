import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchAllStatuses, clearError } from '@/redux/slices/statusSlice';
import { IStatus } from '@/interfaces/user';

export interface UseStatusDataReturn {
  statuses: IStatus[];
  loading: boolean;
  error: string | null;
  refreshStatuses: () => void;
  clearStatusError: () => void;
}

/**
 * Custom hook for accessing status data from Redux store
 * Automatically fetches statuses on mount and provides utilities for managing status data
 */
export const useStatusData = (autoFetch: boolean = true): UseStatusDataReturn => {
  const dispatch = useAppDispatch();
  const { statuses, loading, error } = useAppSelector((state: any) => state.status);

  // Auto-fetch statuses on mount if requested
  useEffect(() => {
    if (autoFetch) {
      dispatch(fetchAllStatuses());
    }
  }, [dispatch, autoFetch]);

  const refreshStatuses = () => {
    dispatch(fetchAllStatuses());
  };

  const clearStatusError = () => {
    dispatch(clearError());
  };

  return {
    statuses: statuses || [],
    loading: loading || false,
    error: error || null,
    refreshStatuses,
    clearStatusError,
  };
};
