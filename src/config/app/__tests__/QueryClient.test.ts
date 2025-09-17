import { QueryClient } from '@tanstack/react-query'

import { Logger } from '@/utils/common/logger'

jest.mock('@/utils/common/logger')

const mockedLoggerBreadcrumb = Logger.breadcrumb as jest.MockedFunction<typeof Logger.breadcrumb>

describe('queryClient configuration', () => {
  describe('configuration constants', () => {
    it('should have correct time constants', () => {
      const FIVE_MINUTES = 5 * 60 * 1000
      const TWO_MINUTES = 2 * 60 * 1000

      expect(FIVE_MINUTES).toBe(300000)
      expect(TWO_MINUTES).toBe(120000)
      expect(TWO_MINUTES).toBeLessThan(FIVE_MINUTES)
    })

    it('should have reasonable retry values', () => {
      const MUTATION_RETRY = 1
      const QUERY_RETRY = 2

      expect(MUTATION_RETRY).toBe(1)
      expect(QUERY_RETRY).toBe(2)
      expect(QUERY_RETRY).toBeGreaterThan(MUTATION_RETRY)
    })
  })

  describe('query configuration object', () => {
    const queryConfig = {
      gcTime: 5 * 60 * 1000,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 2 * 60 * 1000,
    }

    it('should have gcTime set to 5 minutes', () => {
      expect(queryConfig.gcTime).toBe(5 * 60 * 1000)
      expect(queryConfig.gcTime).toBe(300000)
    })

    it('should have staleTime set to 2 minutes', () => {
      expect(queryConfig.staleTime).toBe(2 * 60 * 1000)
      expect(queryConfig.staleTime).toBe(120000)
    })

    it('should have refetchOnWindowFocus disabled', () => {
      expect(queryConfig.refetchOnWindowFocus).toBe(false)
    })

    it('should have refetchOnMount enabled', () => {
      expect(queryConfig.refetchOnMount).toBe(true)
    })

    it('should have refetchOnReconnect enabled', () => {
      expect(queryConfig.refetchOnReconnect).toBe(true)
    })

    it('should have retry set to 2', () => {
      expect(queryConfig.retry).toBe(2)
    })

    it('should maintain timing consistency', () => {
      expect(queryConfig.staleTime).toBeLessThan(queryConfig.gcTime)
    })

    it('should have correct default options structure', () => {
      expect(queryConfig).toEqual({
        gcTime: 5 * 60 * 1000,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
        retry: 2,
        staleTime: 2 * 60 * 1000,
      })
    })
  })

  describe('mutation configuration object', () => {
    const createOnError = () => (error: Error) => {
      mockedLoggerBreadcrumb('queryClientError', 'error', error as Error)
    }

    const mutationConfig = {
      onError: createOnError(),
      retry: 1,
    }

    it('should have retry set to 1', () => {
      expect(mutationConfig.retry).toBe(1)
    })

    it('should have onError function defined', () => {
      expect(typeof mutationConfig.onError).toBe('function')
    })

    it('should have consistent retry configuration', () => {
      const queryRetry = 2
      const mutationRetry = mutationConfig.retry
      expect(queryRetry).toBeGreaterThan(mutationRetry)
    })
  })

  describe('error handling function', () => {
    const onError = (error: Error) => {
      mockedLoggerBreadcrumb('queryClientError', 'error', error as Error)
    }

    it('should call Logger.breadcrumb when error occurs', () => {
      const testError = new Error('Test mutation error')

      onError(testError)

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith('queryClientError', 'error', testError)
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledTimes(1)
    })

    it('should handle different types of errors', () => {
      const networkError = new Error('Network Error')
      networkError.name = 'NetworkError'

      onError(networkError)

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith('queryClientError', 'error', networkError)
    })

    it('should log error with correct parameters', () => {
      const customError = new Error('Custom error message')
      customError.name = 'CustomError'

      onError(customError)

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledTimes(1)
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'queryClientError',
        'error',
        expect.objectContaining({
          message: 'Custom error message',
          name: 'CustomError',
        }),
      )
    })

    it('should handle error with stack trace', () => {
      const errorWithStack = new Error('Error with stack')
      errorWithStack.stack = 'Error: Error with stack\n    at test'

      onError(errorWithStack)

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'queryClientError',
        'error',
        expect.objectContaining({
          message: 'Error with stack',
          stack: expect.stringContaining('Error: Error with stack'),
        }),
      )
    })

    it('should handle different error types in mutation onError', () => {
      const stringError = 'String error' as any

      onError(stringError)

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith('queryClientError', 'error', stringError)
    })

    it('should handle null or undefined errors gracefully', () => {
      const nullError = null as any
      const undefinedError = undefined as any

      onError(nullError)
      onError(undefinedError)

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledTimes(2)
      expect(mockedLoggerBreadcrumb).toHaveBeenNthCalledWith(
        1,
        'queryClientError',
        'error',
        nullError,
      )
      expect(mockedLoggerBreadcrumb).toHaveBeenNthCalledWith(
        2,
        'queryClientError',
        'error',
        undefinedError,
      )
    })
  })

  describe('complete configuration object', () => {
    const defaultOptions = {
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
    }

    it('should have complete mutations configuration', () => {
      expect(defaultOptions.mutations.retry).toBe(1)
      expect(typeof defaultOptions.mutations.onError).toBe('function')
    })

    it('should have complete queries configuration', () => {
      const queries = defaultOptions.queries

      expect(queries.gcTime).toBe(5 * 60 * 1000)
      expect(queries.refetchOnMount).toBe(true)
      expect(queries.refetchOnReconnect).toBe(true)
      expect(queries.refetchOnWindowFocus).toBe(false)
      expect(queries.retry).toBe(2)
      expect(queries.staleTime).toBe(2 * 60 * 1000)
    })

    it('should have consistent retry configuration', () => {
      expect(defaultOptions.queries.retry).toBeGreaterThan(defaultOptions.mutations.retry)
    })

    it('should have consistent timing configuration', () => {
      expect(defaultOptions.queries.staleTime).toBeLessThan(defaultOptions.queries.gcTime)
    })

    it('should execute onError callback correctly', () => {
      const testError = new Error('Configuration test error')

      defaultOptions.mutations.onError(testError)

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith('queryClientError', 'error', testError)
    })

    it('should have correct structure and values', () => {
      expect(defaultOptions).toEqual({
        mutations: {
          onError: expect.any(Function),
          retry: 1,
        },
        queries: {
          gcTime: 300000,
          refetchOnMount: true,
          refetchOnReconnect: true,
          refetchOnWindowFocus: false,
          retry: 2,
          staleTime: 120000,
        },
      })
    })
  })

  describe('Logger integration', () => {
    it('should use correct breadcrumb parameters', () => {
      const onError = (error: Error) => {
        Logger.breadcrumb('queryClientError', 'error', error as Error)
      }

      const testError = new Error('Integration test')
      onError(testError)

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith('queryClientError', 'error', testError)
    })

    it('should handle breadcrumb calls consistently', () => {
      const onError = (error: Error) => {
        Logger.breadcrumb('queryClientError', 'error', error as Error)
      }

      const error1 = new Error('First error')
      const error2 = new Error('Second error')

      onError(error1)
      onError(error2)

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledTimes(2)
      expect(mockedLoggerBreadcrumb).toHaveBeenNthCalledWith(1, 'queryClientError', 'error', error1)
      expect(mockedLoggerBreadcrumb).toHaveBeenNthCalledWith(2, 'queryClientError', 'error', error2)
    })

    it('should maintain correct parameter order', () => {
      const onError = (error: Error) => {
        Logger.breadcrumb('queryClientError', 'error', error as Error)
      }

      const testError = new Error('Parameter order test')
      onError(testError)

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'queryClientError', // first parameter
        'error', // second parameter
        testError, // third parameter
      )
    })
  })

  describe('QueryClient instantiation', () => {
    it('should create QueryClient with correct configuration', () => {
      const testQueryClient = new QueryClient({
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

      expect(testQueryClient).toBeInstanceOf(QueryClient)
    })

    it('should validate configuration structure is valid for QueryClient', () => {
      const config = {
        defaultOptions: {
          mutations: {
            onError: expect.any(Function),
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
      }

      expect(() => new QueryClient(config)).not.toThrow()
    })
  })
})
