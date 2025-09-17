import { act, renderHook } from '@testing-library/react-hooks'
import { router } from 'expo-router'

import { useAddFavorite, useIsFavorite, useRemoveFavorite } from '@/hooks/services/useFavorite'
import { useFavoriteToggle } from '@/hooks/services/useFavoriteToggle'
import useAuthStore from '@/store/auth'
import { Logger } from '@/utils/common/logger'

jest.mock('@/utils/common/logger')

const mockedLoggerBreadcrumb = Logger.breadcrumb as jest.MockedFunction<typeof Logger.breadcrumb>

jest.mock('@/store/auth')

const mockedUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>

jest.mock('@/hooks/services/useFavorite')

const mockedUseAddFavorite = useAddFavorite as jest.MockedFunction<typeof useAddFavorite>
const mockedUseRemoveFavorite = useRemoveFavorite as jest.MockedFunction<typeof useRemoveFavorite>
const mockedUseIsFavorite = useIsFavorite as jest.MockedFunction<typeof useIsFavorite>

const mockedFavoriteItem = { id: '123', type: 'airline' as const }

const mockedAddFavoriteMutation = jest.fn()
const mockedRemoveFavoriteMutation = jest.fn()

beforeEach(() => {
  mockedUseAuthStore.mockReturnValue({
    isAuthenticated: true,
    user: null,
    setUser: jest.fn(),
    setIsAuthenticated: jest.fn(),
    clearUser: jest.fn(),
  })

  mockedUseAddFavorite.mockReturnValue({
    isPending: false,
    mutateAsync: mockedAddFavoriteMutation,
    mutate: jest.fn(),
    isError: false,
    isSuccess: false,
    error: null,
    data: undefined,
    reset: jest.fn(),
  } as any)

  mockedUseRemoveFavorite.mockReturnValue({
    isPending: false,
    mutateAsync: mockedRemoveFavoriteMutation,
    mutate: jest.fn(),
    isError: false,
    isSuccess: false,
    error: null,
    data: undefined,
    reset: jest.fn(),
  } as any)

  mockedUseIsFavorite.mockReturnValue(false)

  mockedAddFavoriteMutation.mockResolvedValue(undefined)
  mockedRemoveFavoriteMutation.mockResolvedValue(undefined)
})

describe('useFavoriteToggle', () => {
  describe('initialization', () => {
    it('should return correct initial values', () => {
      const { result } = renderHook(() => useFavoriteToggle(mockedFavoriteItem))

      expect(result.current.isFavorite).toBe(false)
      expect(result.current.isPending).toBe(false)
      expect(typeof result.current.handleFavoritePress).toBe('function')
    })

    it('should return correct isFavorite value when item is favorite', () => {
      mockedUseIsFavorite.mockReturnValue(true)

      const { result } = renderHook(() => useFavoriteToggle(mockedFavoriteItem))

      expect(result.current.isFavorite).toBe(true)
    })
  })

  describe('isPending state', () => {
    it('should return true when add favorite is pending', () => {
      mockedUseAddFavorite.mockReturnValue({
        isPending: true,
        mutateAsync: mockedAddFavoriteMutation,
        mutate: jest.fn(),
        isError: false,
        isSuccess: false,
        error: null,
        data: undefined,
        reset: jest.fn(),
      } as any)

      const { result } = renderHook(() => useFavoriteToggle(mockedFavoriteItem))

      expect(result.current.isPending).toBe(true)
    })

    it('should return true when remove favorite is pending', () => {
      mockedUseRemoveFavorite.mockReturnValue({
        isPending: true,
        mutateAsync: mockedRemoveFavoriteMutation,
        mutate: jest.fn(),
        isError: false,
        isSuccess: false,
        error: null,
        data: undefined,
        reset: jest.fn(),
      } as any)

      const { result } = renderHook(() => useFavoriteToggle(mockedFavoriteItem))

      expect(result.current.isPending).toBe(true)
    })

    it('should return true when both add and remove are pending', () => {
      mockedUseAddFavorite.mockReturnValue({
        isPending: true,
        mutateAsync: mockedAddFavoriteMutation,
        mutate: jest.fn(),
        isError: false,
        isSuccess: false,
        error: null,
        data: undefined,
        reset: jest.fn(),
      } as any)

      mockedUseRemoveFavorite.mockReturnValue({
        isPending: true,
        mutateAsync: mockedRemoveFavoriteMutation,
        mutate: jest.fn(),
        isError: false,
        isSuccess: false,
        error: null,
        data: undefined,
        reset: jest.fn(),
      } as any)

      const { result } = renderHook(() => useFavoriteToggle(mockedFavoriteItem))

      expect(result.current.isPending).toBe(true)
    })
  })

  describe('handleFavoritePress', () => {
    it('should redirect to auth when user is not authenticated', async () => {
      mockedUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        user: null,
        setUser: jest.fn(),
        setIsAuthenticated: jest.fn(),
        clearUser: jest.fn(),
      })

      const { result } = renderHook(() => useFavoriteToggle(mockedFavoriteItem))

      await act(async () => {
        await result.current.handleFavoritePress()
      })

      expect(router.replace).toHaveBeenCalledWith('/auth')
      expect(mockedAddFavoriteMutation).not.toHaveBeenCalled()
      expect(mockedRemoveFavoriteMutation).not.toHaveBeenCalled()
    })

    it('should not execute when isPending is true', async () => {
      mockedUseAddFavorite.mockReturnValue({
        isPending: true,
        mutateAsync: mockedAddFavoriteMutation,
        mutate: jest.fn(),
        isError: false,
        isSuccess: false,
        error: null,
        data: undefined,
        reset: jest.fn(),
      } as any)

      const { result } = renderHook(() => useFavoriteToggle(mockedFavoriteItem))

      await act(async () => {
        await result.current.handleFavoritePress()
      })

      expect(mockedAddFavoriteMutation).not.toHaveBeenCalled()
      expect(mockedRemoveFavoriteMutation).not.toHaveBeenCalled()
      expect(router.replace).not.toHaveBeenCalled()
    })

    it('should call addFavoriteMutation when item is not favorite', async () => {
      mockedUseIsFavorite.mockReturnValue(false)

      const { result } = renderHook(() => useFavoriteToggle(mockedFavoriteItem))

      await act(async () => {
        await result.current.handleFavoritePress()
      })

      expect(mockedAddFavoriteMutation).toHaveBeenCalledWith({
        id: '123',
        type: 'airline',
      })
      expect(mockedRemoveFavoriteMutation).not.toHaveBeenCalled()
    })

    it('should call removeFavoriteMutation when item is favorite', async () => {
      mockedUseIsFavorite.mockReturnValue(true)

      const { result } = renderHook(() => useFavoriteToggle(mockedFavoriteItem))

      await act(async () => {
        await result.current.handleFavoritePress()
      })

      expect(mockedRemoveFavoriteMutation).toHaveBeenCalledWith({
        id: '123',
        type: 'airline',
      })
      expect(mockedAddFavoriteMutation).not.toHaveBeenCalled()
    })

    it('should handle errors and log them', async () => {
      const mockError = new Error('Network error')
      mockedAddFavoriteMutation.mockRejectedValue(mockError)
      mockedUseIsFavorite.mockReturnValue(false)

      const { result } = renderHook(() => useFavoriteToggle(mockedFavoriteItem))

      await act(async () => {
        await result.current.handleFavoritePress()
      })

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to toggle favorite',
        'error',
        mockError,
      )
    })

    it('should handle remove favorite errors and log them', async () => {
      const mockError = new Error('Remove error')
      mockedRemoveFavoriteMutation.mockRejectedValue(mockError)
      mockedUseIsFavorite.mockReturnValue(true)

      const { result } = renderHook(() => useFavoriteToggle(mockedFavoriteItem))

      await act(async () => {
        await result.current.handleFavoritePress()
      })

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to toggle favorite',
        'error',
        mockError,
      )
    })
  })

  describe('memoization', () => {
    it('should memoize isPending value', () => {
      const { result, rerender } = renderHook(() => useFavoriteToggle(mockedFavoriteItem))

      const firstIsPending = result.current.isPending

      rerender()

      const secondIsPending = result.current.isPending

      expect(firstIsPending).toBe(secondIsPending)
    })

    it('should memoize handleFavoritePress callback', () => {
      const { result, rerender } = renderHook(() => useFavoriteToggle(mockedFavoriteItem))

      const firstCallback = result.current.handleFavoritePress

      rerender()

      const secondCallback = result.current.handleFavoritePress

      expect(firstCallback).toBe(secondCallback)
    })

    it('should update callback when dependencies change', () => {
      const { result, rerender } = renderHook(
        ({ isFavorite }) => {
          mockedUseIsFavorite.mockReturnValue(isFavorite)
          return useFavoriteToggle(mockedFavoriteItem)
        },
        { initialProps: { isFavorite: false } },
      )

      const firstCallback = result.current.handleFavoritePress

      rerender({ isFavorite: true })

      const secondCallback = result.current.handleFavoritePress

      expect(firstCallback).not.toBe(secondCallback)
    })
  })

  describe('different favorite item types', () => {
    it('should work with airport type', async () => {
      const airportItem = { id: '456', type: 'airport' as const }

      const { result } = renderHook(() => useFavoriteToggle(airportItem))

      await act(async () => {
        await result.current.handleFavoritePress()
      })

      expect(mockedAddFavoriteMutation).toHaveBeenCalledWith({
        id: '456',
        type: 'airport',
      })
    })

    it('should work with airline type', async () => {
      const movieItem = { id: '789', type: 'airline' as const }

      const { result } = renderHook(() => useFavoriteToggle(movieItem))

      await act(async () => {
        await result.current.handleFavoritePress()
      })

      expect(mockedAddFavoriteMutation).toHaveBeenCalledWith({
        id: '789',
        type: 'airline',
      })
    })
  })
})
