import { useActionSheet } from '@expo/react-native-action-sheet'
import { useCallback, useMemo } from 'react'
import { Linking, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { MapLocaleStrings } from '@/types/feature/map'

export const useMapNavigation = (localeStrings: MapLocaleStrings) => {
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const { bottom } = useSafeAreaInsets()

  const { showActionSheetWithOptions } = useActionSheet()

  const openMapNavigation = useCallback(
    (lat: number, lng: number, placeName: string) => {
      if (!lat || !lng) return

      const isIOS = Platform.OS === 'ios'
      const options = isIOS
        ? [localeStrings.appleMaps, localeStrings.googleMaps, localeStrings.cancel]
        : [localeStrings.googleMaps, localeStrings.cancel]

      showActionSheetWithOptions(
        {
          cancelButtonIndex: options?.length - 1,
          cancelButtonTintColor: colors?.error,
          containerStyle: {
            backgroundColor: colors?.background?.primary,
            paddingBottom: bottom,
          },
          options,
          textStyle: {
            color: colors?.text100,
            fontFamily: 'Inter-Bold',
            fontSize: 16,
            lineHeight: 18,
          },
          tintColor: colors?.text100,
          title: localeStrings.selectMapApp,
          titleTextStyle: {
            color: colors?.text90,
            fontFamily: 'Inter-Regular',
            fontSize: 14,
            lineHeight: 16,
          },
          userInterfaceStyle: selectedTheme,
        },
        async selectedIndex => {
          if (selectedIndex === options?.length - 1) return
          const encodedName = encodeURIComponent(placeName)
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
    [showActionSheetWithOptions, localeStrings, colors, selectedTheme, bottom],
  )

  return { openMapNavigation }
}
