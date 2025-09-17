import { renderHook } from '@testing-library/react-hooks'

import { useHome } from '@/hooks/services/useHome'
import { getAllHomeData } from '@/services/homeService'
import useLocaleStore from '@/store/locale'
import type { HomeType } from '@/types/feature/home'

const { useQuery } = require('@tanstack/react-query')

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

jest.mock('@/services/homeService')

const mockedGetAllHomeData = getAllHomeData as jest.MockedFunction<typeof getAllHomeData>

const mockedHomeData = {
  breakingNews: [],
  popularAirlines: [],
  popularAirports: [],
  popularDestinations: [],
  totalAirplanes: [],
}

beforeEach(() => {
  mockedUseLocaleStore.mockReturnValue({
    selectedLocale: 'en',
    setSelectedLocale: jest.fn(),
  })

  useQuery.mockReturnValue({
    data: mockedHomeData,
    error: null,
    isLoading: false,
    isError: false,
    isSuccess: true,
    refetch: jest.fn(),
  })

  mockedGetAllHomeData.mockResolvedValue(mockedHomeData)
})

describe('useHome', () => {
  it('should return home data with correct initial values', () => {
    const { result } = renderHook(() => useHome())

    expect(result.current.homeData).toEqual(mockedHomeData)
    expect(result.current.error).toBe(null)
    expect(result.current.isLoading).toBe(false)
  })

  it('should call useQuery with correct parameters', () => {
    renderHook(() => useHome())

    expect(useQuery).toHaveBeenCalledWith({
      queryFn: expect.any(Function),
      queryKey: ['homeData', 'en'],
      staleTime: 5 * 60 * 1000,
    })
  })

  it('should update queryKey when selectedLocale changes', () => {
    mockedUseLocaleStore.mockReturnValue({
      selectedLocale: 'tr',
      setSelectedLocale: jest.fn(),
    })

    renderHook(() => useHome())

    expect(useQuery).toHaveBeenCalledWith({
      queryFn: expect.any(Function),
      queryKey: ['homeData', 'tr'],
      staleTime: 5 * 60 * 1000,
    })
  })

  it('should return loading state correctly', () => {
    useQuery.mockReturnValue({
      data: undefined,
      error: null,
      isLoading: true,
      isError: false,
      isSuccess: false,
      refetch: jest.fn(),
    })

    const { result } = renderHook(() => useHome())

    expect(result.current.homeData).toBeUndefined()
    expect(result.current.error).toBe(null)
    expect(result.current.isLoading).toBe(true)
  })

  it('should return error state correctly', () => {
    const mockError = new Error('Failed to fetch home data')

    useQuery.mockReturnValue({
      data: undefined,
      error: mockError,
      isLoading: false,
      isError: true,
      isSuccess: false,
      refetch: jest.fn(),
    } as any)

    const { result } = renderHook(() => useHome())

    expect(result.current.homeData).toBeUndefined()
    expect(result.current.error).toBe(mockError)
    expect(result.current.isLoading).toBe(false)
  })

  it('should call getAllHomeData with selectedLocale when queryFn is executed', async () => {
    const mockedQueryFn = jest.fn()

    useQuery.mockImplementation(({ queryFn }: { queryFn: () => Promise<HomeType> }) => {
      mockedQueryFn.mockImplementation(queryFn)
      return {
        data: mockedHomeData,
        error: null,
        isLoading: false,
        isError: false,
        isSuccess: true,
        refetch: jest.fn(),
      }
    })

    renderHook(() => useHome())

    await mockedQueryFn()

    expect(mockedGetAllHomeData).toHaveBeenCalledWith('en')
  })

  it('should set correct staleTime', () => {
    renderHook(() => useHome())

    const expectedStaleTime = 5 * 60 * 1000
    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        staleTime: expectedStaleTime,
      }),
    )
  })

  describe('with different locales', () => {
    it('should work with Turkish locale', () => {
      mockedUseLocaleStore.mockReturnValue({
        selectedLocale: 'tr',
        setSelectedLocale: jest.fn(),
      })

      renderHook(() => useHome())

      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: ['homeData', 'tr'],
        }),
      )
    })

    it('should work with English locale', () => {
      mockedUseLocaleStore.mockReturnValue({
        selectedLocale: 'en',
        setSelectedLocale: jest.fn(),
      })

      renderHook(() => useHome())

      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: ['homeData', 'en'],
        }),
      )
    })
  })
})
