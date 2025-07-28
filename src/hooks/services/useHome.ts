import { useQuery } from '@tanstack/react-query'

import { getAllHomeData } from '@/services/homeService'
import useLocaleStore from '@/store/locale'

export function useHome() {
  const { selectedLocale } = useLocaleStore()

  const {
    data: homeData,
    error,
    isLoading,
  } = useQuery({
    queryFn: () => getAllHomeData(selectedLocale),
    queryKey: ['home', selectedLocale],
    staleTime: 5 * 60 * 1000,
  })

  return {
    error,
    homeData,
    isLoading,
  }
}
