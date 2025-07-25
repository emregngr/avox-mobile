import type { AxiosRequestConfig } from 'axios'

export interface ApiResponse<T = any> {
  data: T
  message: string,
  status: number
}

export interface ApiError {
  errors?: Record<string, string[]>,
  message: string
  status: number
}

export interface ApiRequestConfig extends AxiosRequestConfig {
  skipAuthRefresh?: boolean
  skipErrorHandling?: boolean
}
