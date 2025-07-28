import { getApp } from '@react-native-firebase/app'
import { getAuth } from '@react-native-firebase/auth'
import { useFocusEffect } from '@react-navigation/native'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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

const getCurrentUserId = () => auth?.currentUser?.uid

export const useFavoriteIds = (refetchOnFocus = false) => {
  const userId = getCurrentUserId()
  const queryClient = useQueryClient()

  const query = useQuery({
    enabled: !!userId,
    gcTime: 5 * 60 * 1000,
    queryFn: fetchFavoriteIds,
    queryKey: QUERY_KEYS?.favorites(userId || ''),
    staleTime: 0,
  })

  useFocusEffect(
    useCallback(() => {
      if (refetchOnFocus && userId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS?.favorites(userId),
        })
      }
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
    queryFn: () => {
      if (!favoriteIds || favoriteIds?.length === 0) return Promise.resolve([])
      return fetchFavoriteDetails(favoriteIds, selectedLocale)
    },
    queryKey: QUERY_KEYS?.favoriteDetails(userId || '', selectedLocale),
    staleTime: 0,
  })

  useFocusEffect(
    useCallback(() => {
      if (refetchOnFocus && userId) {
        queryClient?.invalidateQueries({
          queryKey: QUERY_KEYS?.favoriteDetails(userId, selectedLocale),
        })
      }
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

    onSuccess: () => {
      if (!userId) return

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.favorites(userId),
      })

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.favoriteDetails(userId, selectedLocale),
      })

      queryClient.refetchQueries({
        queryKey: QUERY_KEYS.favorites(userId),
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

    onSuccess: () => {
      if (!userId) return

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.favorites(userId),
      })

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.favoriteDetails(userId, selectedLocale),
      })

      queryClient.refetchQueries({
        queryKey: QUERY_KEYS.favorites(userId),
      })
    },
  })
}

export const useIsFavorite = ({ id, type }: FavoriteItem) => {
  const { data: favoriteIds = [] } = useFavoriteIds()

  return favoriteIds?.some((fav: FavoriteItem) => fav?.id === id && fav?.type === type)
}
