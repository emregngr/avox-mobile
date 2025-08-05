import AsyncStorage from '@react-native-async-storage/async-storage'
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { router } from 'expo-router'

import { ENUMS } from '@/enums'
import type { ApiError, ApiRequestConfig, ApiResponse } from '@/types/common/api'

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? '',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 60000,
})

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const token = await AsyncStorage.getItem(ENUMS.API_TOKEN)

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  error => {
    console.warn('HTTP :: Request Error', error)
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response?.status === 401) {
      router.navigate('/token-expire')
      return Promise.reject(new Error())
    }
    return response
  },

  async (error: AxiosError) => {
    const originalRequest = error.config as ApiRequestConfig

    const apiError: ApiError = {
      errors: {},
      message: 'An error occurred',
      status: error.response?.status ?? 500,
    }

    if (error.response?.data) {
      const errorData = error.response.data as any

      if (errorData.message) {
        apiError.message = errorData.message
      }

      if (errorData.errors) {
        apiError.errors = errorData.errors
      }
    }

    if (!originalRequest?.skipErrorHandling) {
      console.warn('Error Status', apiError.status)
      console.warn('Error Message', apiError.message)
      console.warn('Errors', apiError.errors)
    }

    if (error?.message === 'Request failed with status code 401') {
      router.navigate('/token-expire')
      return Promise.reject(error)
    }

    return Promise.reject(apiError)
  },
)

const apiClient = {
  async delete<T = any>(url: string, config?: ApiRequestConfig): Promise<T> {
    const response = await axiosInstance.delete<ApiResponse<T>>(url, config)
    return response.data.data
  },

  async get<T = any>(url: string, config?: ApiRequestConfig): Promise<T> {
    const response = await axiosInstance.get<ApiResponse<T>>(url, config)
    return response.data.data
  },

  async patch<T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<T> {
    const response = await axiosInstance.patch<ApiResponse<T>>(url, data, config)
    return response.data.data
  },

  async post<T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<T> {
    const response = await axiosInstance.post<ApiResponse<T>>(url, data, config)
    return response.data.data
  },

  async put<T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<T> {
    const response = await axiosInstance.put<ApiResponse<T>>(url, data, config)
    return response.data.data
  },
}

export default apiClient
