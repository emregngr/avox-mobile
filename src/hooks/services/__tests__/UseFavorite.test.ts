import { act, renderHook } from '@testing-library/react-native'
import { useFocusEffect } from 'expo-router'

import {
  useAddFavorite,
  useFavoriteDetails,
  useFavoriteIds,
  useIsFavorite,
  useRemoveFavorite,
} from '@/hooks/services/useFavorite'
import * as favoriteService from '@/services/favoriteService'
import useLocaleStore from '@/store/locale'

const {
  useQuery,
  useMutation,
  mockedCancelQueries,
  mockedGetQueryData,
  mockedInvalidateQueries,
  mockedSetQueryData,
} = require('@tanstack/react-query')
const { getAuth } = require('@react-native-firebase/auth')

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

jest.mock('@/services/favoriteService')

const mockedFavoriteService = favoriteService as jest.Mocked<typeof favoriteService>

const mockedUseFocusEffect = useFocusEffect as jest.MockedFunction<typeof useFocusEffect>

beforeEach(() => {
  mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })

  getAuth.mockReturnValue({ currentUser: { uid: 'test-user-id' } })

  useMutation.mockReturnValue({
    mutateAsync: jest.fn(),
    isLoading: false,
    isError: false,
    error: null,
  })
})

const renderOptions = {}

describe('Favorite Hooks', () => {
  describe('useFavoriteIds', () => {
    it('should successfully fetch user favorite IDs', () => {
      const mockFavoriteIds = [{ id: '1', type: 'airport' }]
      useQuery.mockReturnValue({ data: mockFavoriteIds, isSuccess: true })
      const { result } = renderHook(() => useFavoriteIds(), renderOptions)
      expect(result.current.isSuccess).toBe(true)
      expect(result.current.data).toEqual(mockFavoriteIds)
    })

    it('should show a loading state while fetching data', () => {
      useQuery.mockReturnValue({ isLoading: true })
      const { result } = renderHook(() => useFavoriteIds(), renderOptions)
      expect(result.current.isLoading).toBe(true)
    })

    it('should handle a data fetching error', () => {
      const error = new Error('Could not fetch favorites')
      useQuery.mockReturnValue({ isError: true, error })
      const { result } = renderHook(() => useFavoriteIds(), renderOptions)
      expect(result.current.isError).toBe(true)
      expect(result.current.error).toEqual(error)
    })

    it('should refetch data on focus if refetchOnFocus is true', async () => {
      renderHook(() => useFavoriteIds(true), renderOptions)
      const effectCallback = mockedUseFocusEffect.mock.calls?.[0]?.[0] as any
      await act(async () => {
        await effectCallback()
      })
      expect(mockedInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['favorites', 'test-user-id'],
      })
    })

    it('should not refetch data on focus if refetchOnFocus is false', async () => {
      renderHook(() => useFavoriteIds(false), renderOptions)
      const effectCallback = mockedUseFocusEffect.mock.calls?.[0]?.[0] as any
      await act(async () => {
        await effectCallback()
      })
      expect(mockedInvalidateQueries).not.toHaveBeenCalled()
    })
  })

  describe('useFavoriteDetails', () => {
    it('should successfully fetch favorite details when there are favorite IDs', () => {
      const mockFavoriteIds = [{ id: '1', type: 'airport' }]
      const mockDetails: any = [{ id: '1', title: 'Test airport' }]
      useQuery.mockReturnValueOnce({ data: mockFavoriteIds, isSuccess: true })
      useQuery.mockReturnValueOnce({ data: mockDetails, isSuccess: true })
      mockedFavoriteService.fetchFavoriteDetails.mockResolvedValue(mockDetails)

      const { result } = renderHook(() => useFavoriteDetails(), renderOptions)
      expect(result.current.isSuccess).toBe(true)
      expect(result.current.data).toEqual(mockDetails)
    })

    it('should not fetch details when there are no favorite IDs', async () => {
      useQuery.mockReturnValueOnce({ data: [], isSuccess: true })
      useQuery.mockReturnValueOnce({ data: [], isSuccess: true })
      const { result } = renderHook(() => useFavoriteDetails(), renderOptions)
      expect(result.current.isSuccess).toBe(true)
      expect(result.current.data).toEqual([])
      expect(mockedFavoriteService.fetchFavoriteDetails).not.toHaveBeenCalled()
    })

    it('should not fetch details if favoriteIds data is undefined', () => {
      useQuery.mockReturnValueOnce({ data: undefined, isSuccess: true })
      useQuery.mockReturnValueOnce({ data: [], isSuccess: true })
      const { result } = renderHook(() => useFavoriteDetails(), renderOptions)
      expect(result.current.data).toEqual([])
      expect(mockedFavoriteService.fetchFavoriteDetails).not.toHaveBeenCalled()
    })

    it('should refetch data on focus if refetchOnFocus is true', async () => {
      useQuery.mockReturnValue({ data: [], isSuccess: true })
      renderHook(() => useFavoriteDetails(true), renderOptions)
      const effectCallback = mockedUseFocusEffect.mock.calls?.[1]?.[0] as any
      await act(async () => {
        await effectCallback()
      })
      expect(mockedInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['favoriteDetails', 'test-user-id', 'en'],
      })
    })

    it('should not refetch data on focus if refetchOnFocus is false', async () => {
      useQuery.mockReturnValue({ data: [], isSuccess: true })
      renderHook(() => useFavoriteDetails(false), renderOptions)
      const effectCallback = mockedUseFocusEffect.mock.calls?.[1]?.[0] as any
      await act(async () => {
        await effectCallback()
      })
      expect(mockedInvalidateQueries).not.toHaveBeenCalled()
    })
  })

  describe('useAddFavorite', () => {
    it('should successfully add an item and invalidate caches', async () => {
      const newItem = { id: '2', type: 'tv' }
      const initialFavorites = [{ id: '1', type: 'airport' }]
      renderHook(() => useAddFavorite(), renderOptions)
      const mutationOptions = useMutation.mock.calls[0][0]

      mockedGetQueryData.mockReturnValue(initialFavorites)
      await act(async () => {
        await mutationOptions.onMutate(newItem)
      })
      expect(mockedCancelQueries).toHaveBeenCalled()
      expect(mockedSetQueryData).toHaveBeenCalledWith(
        ['favorites', 'test-user-id'],
        expect.any(Function),
      )
      await act(async () => {
        await mutationOptions.onSuccess()
      })
      expect(mockedInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['favorites', 'test-user-id'],
      })
      expect(mockedInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['favoriteDetails', 'test-user-id', 'en'],
      })
    })

    it('should not change the list when adding an existing item', async () => {
      const existingItem = { id: '1', type: 'airport' }
      const initialFavorites = [{ id: '1', type: 'airport' }]
      renderHook(() => useAddFavorite(), renderOptions)
      const mutationOptions = useMutation.mock.calls[0][0]

      mockedGetQueryData.mockReturnValue(initialFavorites)
      await act(async () => {
        await mutationOptions.onMutate(existingItem)
      })
      const updater = mockedSetQueryData.mock.calls[0][1]
      const newState = updater(initialFavorites)
      expect(newState).toEqual(initialFavorites)
    })

    it('should add an item when the cache is empty', async () => {
      const newItem = { id: '1', type: 'airport' }
      renderHook(() => useAddFavorite(), renderOptions)
      const mutationOptions = useMutation.mock.calls[0][0]

      mockedGetQueryData.mockReturnValue(undefined)
      await act(async () => {
        await mutationOptions.onMutate(newItem)
      })
      const updater = mockedSetQueryData.mock.calls[0][1]
      const newState = updater(undefined)
      expect(newState).toEqual([newItem])
    })

    it('should revert state on error', async () => {
      const initialFavorites = [{ id: '1', type: 'airport' }]
      const newItem = { id: '2', type: 'tv' }
      const error = new Error('Could not add')
      const context = { previousFavorites: initialFavorites }
      renderHook(() => useAddFavorite(), renderOptions)
      const mutationOptions = useMutation.mock.calls[0][0]

      await act(async () => {
        await mutationOptions.onError(error, newItem, context)
      })
      expect(mockedSetQueryData).toHaveBeenCalledWith(
        ['favorites', 'test-user-id'],
        initialFavorites,
      )
    })

    it('should not revert state on error if context is missing', async () => {
      renderHook(() => useAddFavorite(), renderOptions)
      const mutationOptions = useMutation.mock.calls[0][0]
      const error = new Error('Could not add favorite')
      await act(async () => {
        await mutationOptions.onError(error, { id: '1' }, undefined)
      })
      expect(mockedSetQueryData).not.toHaveBeenCalled()
    })

    it('should do nothing if userId is missing', async () => {
      getAuth.mockReturnValue({ currentUser: null })
      renderHook(() => useAddFavorite(), {})
      const mutationOptions = useMutation.mock.calls[0][0]

      await act(async () => {
        await mutationOptions.onMutate({ id: '1', type: 'airport' })
        await mutationOptions.onSuccess()
      })

      expect(mockedCancelQueries).toHaveBeenCalledWith({
        queryKey: ['favorites', 'test-user-id'],
      })
      expect(mockedInvalidateQueries).toHaveBeenCalled()
    })
  })

  describe('useRemoveFavorite', () => {
    it('should successfully remove an item', async () => {
      const itemToRemove = { id: '1', type: 'airport' }
      const initialFavorites = [{ id: '1', type: 'airport' }]
      renderHook(() => useRemoveFavorite(), renderOptions)
      const mutationOptions = useMutation.mock.calls[0][0]

      mockedGetQueryData.mockReturnValue(initialFavorites)
      await act(async () => {
        await mutationOptions.onMutate(itemToRemove)
      })
      const updater = mockedSetQueryData.mock.calls[0][1]
      const newState = updater(initialFavorites)
      expect(newState).toEqual([])
      await act(async () => {
        await mutationOptions.onSuccess()
      })
      expect(mockedInvalidateQueries).toHaveBeenCalledTimes(2)
    })

    it('should revert state on error', async () => {
      const initialFavorites = [{ id: '1', type: 'airport' }]
      const error = new Error('Could not remove')
      const context = { previousFavorites: initialFavorites }
      renderHook(() => useRemoveFavorite(), renderOptions)
      const mutationOptions = useMutation.mock.calls[0][0]

      await act(async () => {
        await mutationOptions.onError(error, { id: '1' }, context)
      })
      expect(mockedSetQueryData).toHaveBeenCalledWith(
        ['favorites', 'test-user-id'],
        initialFavorites,
      )
    })

    it('should not revert state on error if context is missing', async () => {
      renderHook(() => useRemoveFavorite(), renderOptions)
      const mutationOptions = useMutation.mock.calls[0][0]
      const error = new Error('Could not remove favorite')
      await act(async () => {
        await mutationOptions.onError(error, { id: '1' }, undefined)
      })
      expect(mockedSetQueryData).not.toHaveBeenCalled()
    })

    it('should handle removing from an empty cache', async () => {
      const itemToRemove = { id: '1', type: 'airport' }
      renderHook(() => useRemoveFavorite(), renderOptions)
      const mutationOptions = useMutation.mock.calls[0][0]

      mockedGetQueryData.mockReturnValue(undefined)
      await act(async () => {
        await mutationOptions.onMutate(itemToRemove)
      })
      const updater = mockedSetQueryData.mock.calls[0][1]
      const newState = updater(undefined)
      expect(newState).toEqual([])
    })

    it('should not change list when removing a non-existent item', async () => {
      const itemToRemove = { id: '2', type: 'airport' }
      const initialFavorites = [{ id: '1', type: 'airport' }]
      renderHook(() => useRemoveFavorite(), renderOptions)
      const mutationOptions = useMutation.mock.calls[0][0]

      mockedGetQueryData.mockReturnValue(initialFavorites)
      await act(async () => {
        await mutationOptions.onMutate(itemToRemove)
      })
      const updater = mockedSetQueryData.mock.calls[0][1]
      const newState = updater(initialFavorites)
      expect(newState).toEqual(initialFavorites)
    })

    it('should do nothing if userId is missing', async () => {
      getAuth.mockReturnValue({ currentUser: null })
      renderHook(() => useRemoveFavorite(), {})
      const mutationOptions = useMutation.mock.calls[0][0]

      await act(async () => {
        await mutationOptions.onMutate({ id: '1', type: 'airport' })
        await mutationOptions.onSuccess()
      })

      expect(mockedCancelQueries).toHaveBeenCalledWith({
        queryKey: ['favorites', 'test-user-id'],
      })
      expect(mockedInvalidateQueries).toHaveBeenCalled()
    })
  })

  describe('useIsFavorite', () => {
    it('should return true if item is in favorites', () => {
      const favorites = [{ id: '1', type: 'airport' }]
      useQuery.mockReturnValue({ data: favorites, isSuccess: true })
      const { result } = renderHook(() => useIsFavorite({ id: '1', type: 'airport' }))
      expect(result.current).toBe(true)
    })

    it('should return false if item is not in favorites', () => {
      const favorites = [{ id: '1', type: 'airline' }]
      useQuery.mockReturnValue({ data: favorites, isSuccess: true })
      const { result } = renderHook(() => useIsFavorite({ id: '3', type: 'airline' }))
      expect(result.current).toBe(false)
    })

    it('should return false if favorite list is undefined', () => {
      useQuery.mockReturnValue({ data: undefined, isSuccess: true })
      const { result } = renderHook(() => useIsFavorite({ id: '1', type: 'airport' }))
      expect(result.current).toBe(false)
    })
  })
})
