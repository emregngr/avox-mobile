import { getApp } from '@react-native-firebase/app'
import { getAuth } from '@react-native-firebase/auth'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useFocusEffect } from 'expo-router'
import { useCallback } from 'react'

import {
  addToFavorites,
  fetchFavoriteDetails,
  fetchFavoriteIds,
  removeFromFavorites,
} from '@/services/favoriteService'
import useLocaleStore from '@/store/locale'
import type { FavoriteItem } from '@/types/feature/favorite'

const app = getApp()
const auth = getAuth(app)

const QUERY_KEYS = {
  favoriteDetails: (userId: string, locale: string) => ['favoriteDetails', userId, locale],
  favorites: (userId: string) => ['favorites', userId],
} as const

const getCurrentUserId = () => auth?.currentUser?.uid as string

export const useFavoriteIds = (refetchOnFocus = false) => {
  const userId = getCurrentUserId()
  const queryClient = useQueryClient()

  const query = useQuery({
    enabled: !!userId,
    gcTime: 5 * 60 * 1000,
    queryFn: fetchFavoriteIds,
    queryKey: QUERY_KEYS?.favorites(userId),
    staleTime: 1 * 60 * 1000,
  })

  useFocusEffect(
    useCallback(() => {
      const getFavorites = async () => {
        if (refetchOnFocus && userId) {
          await queryClient.invalidateQueries({
            queryKey: QUERY_KEYS?.favorites(userId),
          })
        }
      }
      getFavorites()
    }, [refetchOnFocus, userId, queryClient]),
  )

  return query
}

export const useFavoriteDetails = (refetchOnFocus = false) => {
  const { selectedLocale } = useLocaleStore()
  const userId = getCurrentUserId()
  const queryClient = useQueryClient()
  const { data: favoriteIds = [] } = useFavoriteIds(refetchOnFocus)

  const query = useQuery({
    enabled: !!userId && !!selectedLocale,
    queryFn: async () => {
      if (!favoriteIds || favoriteIds?.length === 0) return Promise.resolve([])
      const favoriteDetails = await fetchFavoriteDetails(favoriteIds, selectedLocale)
      return favoriteDetails
    },
    queryKey: QUERY_KEYS?.favoriteDetails(userId, selectedLocale),
    staleTime: 1 * 60 * 1000,
  })

  useFocusEffect(
    useCallback(() => {
      const getFavoriteDetails = async () => {
        if (refetchOnFocus && userId) {
          await queryClient?.invalidateQueries({
            queryKey: QUERY_KEYS?.favoriteDetails(userId, selectedLocale),
          })
        }
      }
      getFavoriteDetails()
    }, [refetchOnFocus, userId, selectedLocale, queryClient, favoriteIds]),
  )

  return query
}

export const useAddFavorite = () => {
  const queryClient = useQueryClient()
  const userId = getCurrentUserId()
  const { selectedLocale } = useLocaleStore()

  return useMutation({
    mutationFn: addToFavorites,

    onError: (err, variables, context) => {
      if (context?.previousFavorites && userId) {
        queryClient?.setQueryData(QUERY_KEYS.favorites(userId), context?.previousFavorites)
      }
    },

    onMutate: async (variables: FavoriteItem) => {
      if (!userId) return

      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.favorites(userId),
      })

      const previousFavorites = queryClient?.getQueryData(QUERY_KEYS.favorites(userId))

      queryClient.setQueryData(QUERY_KEYS.favorites(userId), (old: any) => {
        if (!old) return [{ id: variables?.id, type: variables?.type }]

        const exists = old.some(
          (item: any) => item?.id === variables?.id && item?.type === variables?.type,
        )
        if (exists) return old
        return [...old, { id: variables?.id, type: variables?.type }]
      })

      return { previousFavorites }
    },

    onSuccess: async () => {
      if (!userId) return

      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.favorites(userId),
      })

      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.favoriteDetails(userId, selectedLocale),
      })
    },
  })
}

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient()
  const userId = getCurrentUserId()
  const { selectedLocale } = useLocaleStore()

  return useMutation({
    mutationFn: removeFromFavorites,

    onError: (err, variables, context) => {
      if (context?.previousFavorites && userId) {
        queryClient?.setQueryData(QUERY_KEYS.favorites(userId), context?.previousFavorites)
      }
    },

    onMutate: async (variables: FavoriteItem) => {
      if (!userId) return

      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.favorites(userId),
      })

      const previousFavorites = queryClient.getQueryData(QUERY_KEYS.favorites(userId))

      queryClient.setQueryData(QUERY_KEYS.favorites(userId), (old: any) => {
        if (!old) return []
        return old?.filter(
          (item: any) => !(item?.id === variables?.id && item?.type === variables?.type),
        )
      })

      return { previousFavorites }
    },

    onSuccess: async () => {
      if (!userId) return

      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.favorites(userId),
      })

      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.favoriteDetails(userId, selectedLocale),
      })
    },
  })
}

export const useIsFavorite = ({ id, type }: FavoriteItem) => {
  const { data: favoriteIds = [] } = useFavoriteIds()

  return favoriteIds?.some((fav: FavoriteItem) => fav?.id === id && fav?.type === type)
}
