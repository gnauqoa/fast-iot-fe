import { useState, useCallback } from 'react';
import { useCustom } from '@refinedev/core';
import { IDevice, DeviceStatus } from '@/interfaces/device';

export interface ScanQueryParams {
  latitude: number;
  longitude: number;
  page?: number;
  limit?: number;
  radius?: number;
  status?: DeviceStatus;
}

export const DEFAULT_SCAN_PARAMS: ScanQueryParams = {
  latitude: 10.762622,
  longitude: 106.660172,
  radius: 0.5 * 1000,
  limit: 50,
  page: 1,
};

export const useScanDevice = (initialParams: ScanQueryParams = DEFAULT_SCAN_PARAMS) => {
  const [queryParams, setQueryParams] = useState<ScanQueryParams>(initialParams);

  const { data, isFetching, refetch } = useCustom<{ data: IDevice[] }>({
    url: 'devices/scan',
    method: 'get',
    config: {
      query: {
        latitude: queryParams.latitude,
        longitude: queryParams.longitude,
        radius: queryParams.radius,
        page: queryParams.page,
        limit: queryParams.limit,
        ...(queryParams.status !== undefined && {
          status: queryParams.status,
        }),
      },
    },
    queryOptions: {
      enabled: true,
    },
  });

  const handleScan = useCallback(async (values: { radius: number; status?: DeviceStatus }) => {
    setQueryParams(prev => {
      const newParams: ScanQueryParams = {
        ...prev,
        radius: values.radius * 1000, // Convert km to meters
      };

      // Add status filter if provided
      if (values.status !== undefined) {
        newParams.status = values.status;
      } else {
        // Remove status filter if not provided
        delete newParams.status;
      }

      return newParams;
    });
  }, []);

  const updateLocation = useCallback((latitude: number, longitude: number) => {
    setQueryParams(prev => ({
      ...prev,
      latitude,
      longitude,
    }));
  }, []);

  return {
    queryParams,
    setQueryParams,
    isLoading: isFetching,
    data: data?.data.data || [],
    handleScan,
    updateLocation,
    refetch,
  };
};
