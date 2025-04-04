import { useState } from "react";
import { useCustom } from "@refinedev/core";
import { IDevice } from "../interfaces/device";

export interface ScanQueryParams {
  latitude: number;
  longitude: number;
  page?: number;
  limit?: number;
  radius?: number;
}

export const DEFAULT_SCAN_PARAMS: ScanQueryParams = {
  latitude: 10.762622,
  longitude: 106.660172,
  radius: 0.5 * 1000,
  limit: 50,
  page: 1
};

export const useScanDevice = (initialParams: ScanQueryParams = DEFAULT_SCAN_PARAMS) => {
  const [queryParams, setQueryParams] = useState<ScanQueryParams>(initialParams);

  const { data, isFetching, } = useCustom<{ data: IDevice[] }>({
    url: "devices/scan",
    method: "get",

    config: {
      query: queryParams
    },
    queryOptions: {
      enabled: true,
    },
  });

  const handleScan = async (values: any) => {
    const newParams = {
      ...queryParams,
      radius: values.radius * 1000, // Convert km to meters
    };
    setQueryParams(newParams);
  };

  const updateLocation = (latitude: number, longitude: number) => {
    setQueryParams(prev => ({
      ...prev,
      latitude,
      longitude
    }));
  };

  return {
    queryParams,
    setQueryParams,
    isLoading:isFetching,
    data: data?.data.data || [],
    handleScan,
    updateLocation
  };
}; 