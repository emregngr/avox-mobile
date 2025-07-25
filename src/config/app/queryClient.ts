import crashlytics from '@react-native-firebase/crashlytics'
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error: Error) => {
        console.error(error)
        if (!__DEV__) {
          crashlytics().recordError(error)
        }
      },
      retry: 1,
    },
    queries: {
      gcTime: 5 * 60 * 1000,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 30 * 1000,
    },
  },
})
