import { ReactNode } from 'react'

const mockedSetQueryData = jest.fn()
const mockedRemoveQueries = jest.fn()
const mockedInvalidateQueries = jest.fn()
const mockedGetQueryData = jest.fn()
const mockedCancelQueries = jest.fn()
const mockedRefetchQueries = jest.fn()
const mockedClear = jest.fn()
const mockedGetQueriesData = jest.fn()
const mockedSetQueriesData = jest.fn()
const mockedRefetch = jest.fn(() => Promise.resolve({ data: null }))
const mockedMutate = jest.fn()
const mockedMutateAsync = jest.fn(() => Promise.resolve())
const mockedReset = jest.fn()
const mockedRemove = jest.fn()
const mockedFetchNextPage = jest.fn(() => Promise.resolve({ data: null }))
const mockedFetchPreviousPage = jest.fn(() => Promise.resolve({ data: null }))

const mockedQueryClient = {
  getQueryData: mockedGetQueryData,
  setQueryData: mockedSetQueryData,
  invalidateQueries: mockedInvalidateQueries,
  clear: mockedClear,
  cancelQueries: mockedCancelQueries,
  refetchQueries: mockedRefetchQueries,
  removeQueries: mockedRemoveQueries,
  getQueriesData: mockedGetQueriesData,
  setQueriesData: mockedSetQueriesData,
  isFetching: jest.fn(() => 0),
  isMutating: jest.fn(() => 0),
}

module.exports = {
  QueryClient: jest.fn(() => mockedQueryClient),

  QueryClientProvider: ({ children }: { children: ReactNode }) => children,

  useQuery: jest.fn(() => ({
    data: null,
    error: null,
    isLoading: false,
    isError: false,
    isSuccess: true,
    isIdle: false,
    isFetching: false,
    isStale: false,
    refetch: mockedRefetch,
    remove: mockedRemove,
    dataUpdatedAt: Date.now(),
    errorUpdatedAt: 0,
  })),

  useMutation: jest.fn(() => ({
    mutate: mockedMutate,
    mutateAsync: mockedMutateAsync,
    isLoading: false,
    isError: false,
    isSuccess: false,
    isIdle: true,
    error: null,
    data: undefined,
    reset: mockedReset,
    variables: undefined,
    failureCount: 0,
  })),

  useQueryClient: () => mockedQueryClient,

  useInfiniteQuery: jest.fn(() => ({
    data: { pages: [], pageParams: [] },
    error: null,
    isLoading: false,
    isError: false,
    isSuccess: true,
    isIdle: false,
    isFetching: false,
    hasNextPage: false,
    hasPreviousPage: false,
    isFetchingNextPage: false,
    isFetchingPreviousPage: false,
    fetchNextPage: mockedFetchNextPage,
    fetchPreviousPage: mockedFetchPreviousPage,
    refetch: mockedRefetch,
    remove: mockedRemove,
  })),

  QueryCache: jest.fn(() => ({
    find: jest.fn(),
    findAll: jest.fn(),
    clear: jest.fn(),
    subscribe: jest.fn(),
  })),

  MutationCache: jest.fn(() => ({
    find: jest.fn(),
    findAll: jest.fn(),
    clear: jest.fn(),
    subscribe: jest.fn(),
  })),

  useIsFetching: jest.fn(() => 0),
  useIsMutating: jest.fn(() => 0),

  keepPreviousData: Symbol('keepPreviousData'),

  hashQueryKey: jest.fn((key: any) => JSON.stringify(key)),
  isError: jest.fn(() => false),
  isServer: false,

  mockedSetQueryData,
  mockedRemoveQueries,
  mockedInvalidateQueries,
  mockedQueryClient,
  mockedGetQueryData,
  mockedCancelQueries,
  mockedRefetchQueries,
  mockedClear,
  mockedGetQueriesData,
  mockedSetQueriesData,
  mockedRefetch,
  mockedMutate,
  mockedMutateAsync,
  mockedReset,
  mockedRemove,
  mockedFetchNextPage,
  mockedFetchPreviousPage,
}
