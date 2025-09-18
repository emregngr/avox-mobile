import { router } from 'expo-router'
import { useCallback, useMemo } from 'react'

import { useAddFavorite, useIsFavorite, useRemoveFavorite } from '@/hooks/services/useFavorite'
import useAuthStore from '@/store/auth'
import type { FavoriteItemType } from '@/types/feature/favorite'
import { Logger } from '@/utils/common/logger'

export function useFavoriteToggle({ id, type }: FavoriteItemType) {
  const { isAuthenticated } = useAuthStore()

  const { isPending: isAddFavoritePending, mutateAsync: addFavoriteMutation } = useAddFavorite()
  const { isPending: isRemoveFavoritePending, mutateAsync: removeFavoriteMutation } =
    useRemoveFavorite()

  const isFavorite = useIsFavorite({ id, type })

  const isPending = useMemo(
    () => isAddFavoritePending || isRemoveFavoritePending,
    [isAddFavoritePending, isRemoveFavoritePending],
  )

  const handleFavoritePress = useCallback(async (): Promise<void> => {
    if (!isAuthenticated) {
      router.replace('/auth')
      return
    }

    if (isPending) return

    try {
      if (isFavorite) {
        await removeFavoriteMutation({ id, type })
      } else {
        await addFavoriteMutation({ id, type })
      }
    } catch (error) {
      Logger.breadcrumb('Failed to toggle favorite', 'error', error as Error)
    }
  }, [
    isAuthenticated,
    isPending,
    isFavorite,
    id,
    type,
    addFavoriteMutation,
    removeFavoriteMutation,
  ])

  return { handleFavoritePress, isFavorite, isPending }
}
