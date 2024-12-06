/* eslint-disable  @typescript-eslint/no-explicit-any */

import { axiosInstance } from "@/lib/axios.ts";

type RequestOptions = {
  params?: Record<string, any>;
  data?: Record<string, any>;
  headers?: Record<string, any>;
};

export const api = {
  get: async <T>(url: string, options: RequestOptions = {}): Promise<T> => {
    const { params, headers } = options;
    const response = await axiosInstance.get<T>(url, { params, headers });
    return response.data;
  },

  post: async <T>(
    url: string,
    data: Record<string, any>,
    options: RequestOptions = {},
  ): Promise<T> => {
    const { headers } = options;
    const response = await axiosInstance.post<T>(url, data, { headers });
    return response.data;
  },

  patch: async <T>(
    url: string,
    data: Record<string, any>,
    options: RequestOptions = {},
  ): Promise<T> => {
    const { headers } = options;
    const response = await axiosInstance.patch<T>(url, data, { headers });
    return response.data;
  },

  delete: async <T>(url: string, options: RequestOptions = {}): Promise<T> => {
    const { params, headers } = options;
    const response = await axiosInstance.delete<T>(url, { params, headers });
    return response.data;
  },
};
