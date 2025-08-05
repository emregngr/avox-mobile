import { QueryClient } from '@tanstack/react-query'

import { Logger } from '@/utils/common/logger'

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error: Error) => {
        Logger.breadcrumb('queryClientError', 'error', error as Error)
      },
      retry: 1,
    },
    queries: {
      gcTime: 5 * 60 * 1000,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 2 * 60 * 1000,
    },
  },
})
