import { getCrashlytics, recordError } from '@react-native-firebase/crashlytics'
import { QueryClient } from '@tanstack/react-query'

const crashlytics = getCrashlytics()

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error: Error) => {
        console.error(error)
        if (!__DEV__) {
          recordError(crashlytics, error as Error)
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
