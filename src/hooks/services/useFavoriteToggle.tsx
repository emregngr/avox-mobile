import { router } from 'expo-router'
import { useCallback, useMemo } from 'react'

import { useAddFavorite, useIsFavorite, useRemoveFavorite } from '@/hooks/services/useFavorite'
import useAuthStore from '@/store/auth'
import type { FavoriteItem } from '@/types/feature/favorite'

export function useFavoriteToggle({ id, type }: FavoriteItem) {
  const { isAuthenticated } = useAuthStore()

  const { isPending: isAddFavoritePending, mutateAsync: addFavoriteMutation } = useAddFavorite()
  const { isPending: isRemoveFavoritePending, mutateAsync: removeFavoriteMutation } =
    useRemoveFavorite()

  const isFavorite = useIsFavorite({ id, type })

  const isPending = useMemo(
    () => isAddFavoritePending || isRemoveFavoritePending,
    [isAddFavoritePending, isRemoveFavoritePending],
  )

  const handleFavoritePress = useCallback(async () => {
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
    } catch (error) {}
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
