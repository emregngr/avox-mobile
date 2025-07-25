import { useActionSheet } from '@expo/react-native-action-sheet'
import type { AppleMapsMarker } from 'expo-maps/build/apple/AppleMaps.types'
import { useCallback } from 'react'
import { Linking, Platform } from 'react-native'

import type { MapLocaleStrings } from '@/types/feature/map'

export const useMapActions = (localeStrings: MapLocaleStrings) => {
  const { showActionSheetWithOptions } = useActionSheet()

  const onMarkerClick = useCallback(
    (marker: AppleMapsMarker, name: string) => {
      if (!marker?.coordinates?.latitude || !marker?.coordinates?.longitude) return

      const isIOS = Platform.OS === 'ios'
      const options = isIOS
        ? [localeStrings.appleMaps, localeStrings.googleMaps, localeStrings.cancel]
        : [localeStrings.googleMaps, localeStrings.cancel]

      showActionSheetWithOptions(
        {
          cancelButtonIndex: options?.length - 1,
          options,
          title: localeStrings.selectMapApp,
        },
        async selectedIndex => {
          if (selectedIndex === options?.length - 1) return

          const lat = marker?.coordinates?.latitude
          const lng = marker?.coordinates?.longitude
          const encodedName = encodeURIComponent(name)
          let url = ''

          if (isIOS) {
            if (selectedIndex === 0) {
              url = `http://maps.apple.com/?q=${encodedName}&ll=${lat},${lng}`
            } else {
              url = `https://maps.google.com/?q=${encodedName}&ll=${lat},${lng}`
            }
          } else {
            url = `https://maps.google.com/?q=${encodedName}&ll=${lat},${lng}`
          }

          await Linking?.openURL(url)
        },
      )
    },
    [showActionSheetWithOptions, localeStrings],
  )

  return { onMarkerClick }
}
