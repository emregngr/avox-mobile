import { useCallback, useMemo } from 'react'

import { getFilterLabelMap } from '@/constants/activeFilterOptions'
import { getLocale } from '@/locales/i18next'

export function useActiveFilterLabel() {
  const filterLabelMap = useMemo(() => getFilterLabelMap(), [])

  const booleanLabelMap: Record<string, string> = useMemo(
    () => ({
      freeWifi: getLocale('freeWifi'),
      hasCarRental: getLocale('carRental'),
      hasChildrensPlayArea: getLocale('childrensPlayground'),
      hasDutyFree: getLocale('dutyFree'),
      hasHealthServices: getLocale('healthServices'),
      hasHotels: getLocale('hotels'),
      hasLounges: getLocale('lounges'),
      hasMetro: getLocale('metro'),
      hasPrayerRoom: getLocale('placeOfWorship'),
      hasRestaurants: getLocale('restaurants'),
      is24Hour: getLocale('open24Hours'),
    }),
    [],
  )

  const getActiveFilterLabel = useCallback(
    (key: string, value: any): string | number | undefined => {
      if (key === 'minGoogleRating') {
        return `${getLocale('googleRating')}: ${value}+`
      }
      if (key === 'minSkytraxRating') {
        return `${getLocale('skytraxRating')}: ${value}+`
      }

      if (booleanLabelMap[key] && (value === true || value === 'true')) {
        return booleanLabelMap[key]
      }

      const options = filterLabelMap[key]

      if (options) {
        const match = options.find(option => {
          if (typeof value === 'string' && typeof option.value === 'string') {
            return option.value.toLowerCase() === value.toLowerCase()
          }
          return option.value === value
        })
        if (match) {
          return match.label
        }
      }

      return undefined
    },
    [booleanLabelMap, filterLabelMap],
  )

  return getActiveFilterLabel
}
