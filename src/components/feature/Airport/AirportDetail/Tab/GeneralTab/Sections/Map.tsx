import { AppleMaps } from 'expo-maps'
import type { AppleMapsMarker } from 'expo-maps/build/apple/AppleMaps.types'
import React, { useCallback, useMemo } from 'react'
import { Platform, View } from 'react-native'
import { WebView } from 'react-native-webview'

import { ThemedText } from '@/components/common/ThemedText'
import { useMapActions } from '@/hooks/maps/useMapAction'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { Airport } from '@/types/feature/airport'
import type { RegionKey } from '@/types/feature/region'

const zoomLevel = 12

const createDynamicGoogleMapsHTML = (
  name: string,
  latitude: number,
  longitude: number,
  selectedTheme: 'light' | 'dark',
) => {
  const embedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=${zoomLevel}&output=embed`

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${name} Haritası</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          ${selectedTheme === 'dark' ? 'background-color: #1a1a1a;' : 'background-color: #ffffff;'}
        }

        .map-container {
          width: 100%;
          height: 250px;
          position: relative;
          overflow: hidden;
          ${
            selectedTheme === 'dark'
              ? 'border: 1px solid #333; border-radius: 8px;'
              : 'border: 1px solid #e0e0e0; border-radius: 8px;'
          }
        }

        iframe {
          width: 100%;
          height: 260px;
          border: none;
          position: absolute;
          top: 0;
          left: 0;
          ${
            selectedTheme === 'dark'
              ? 'filter: invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%);'
              : ''
          }
        }
      </style>
    </head>
    <body>
      <div class="map-container">
        <iframe
          src="${embedUrl}"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade">
        </iframe>
      </div>
    </body>
    </html>
  `
}

interface MapProps {
  airportData: Airport
}

export const Map = ({ airportData }: MapProps) => {
  const { selectedTheme } = useThemeStore()
  const { selectedLocale } = useLocaleStore()
  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const { iataCode, id, name, operations } = airportData ?? {}
  const {
    location: {
      coordinates: { latitude, longitude },
    },
    region,
  } = operations ?? {}

  const googleMapsHTML = useMemo(
    () => createDynamicGoogleMapsHTML(name, latitude, longitude, selectedTheme),
    [name, latitude, longitude, selectedTheme],
  )

  const markerColor = useMemo(() => colors?.[region?.toLowerCase() as RegionKey], [colors, region])

  const appleMarkers: AppleMapsMarker[] = useMemo(
    () => [
      {
        coordinates: { latitude, longitude },
        id: name,
        systemImage: 'airplane',
        tintColor: markerColor,
        title: `${name} (${iataCode})`,
      },
    ],
    [name, latitude, longitude, iataCode, markerColor],
  )

  const cameraPosition = useMemo(
    () => ({
      coordinates: { latitude, longitude },
      zoom: zoomLevel,
    }),
    [latitude, longitude],
  )

  const localeStrings = useMemo(
    () => ({
      airportLocation: getLocale('airportLocation'),
    }),
    [selectedLocale],
  )

  const mapLocaleStrings = useMemo(
    () => ({
      appleMaps: getLocale('appleMaps'),
      cancel: getLocale('cancel'),
      googleMaps: getLocale('googleMaps'),
      selectMapApp: getLocale('selectMapApp'),
    }),
    [selectedLocale],
  )

  const { onMarkerClick } = useMapActions(mapLocaleStrings)

  const handleMarkerPress = useCallback(
    (marker: AppleMapsMarker) => {
      onMarkerClick(marker, name)
    },
    [onMarkerClick, name],
  )

  return (
    <View>
      <ThemedText className="mb-3" color="text-100" type="h3">
        {localeStrings.airportLocation}
      </ThemedText>

      <View className="rounded-xl overflow-hidden h-64">
        {Platform.OS === 'ios' ? (
          <AppleMaps.View
            cameraPosition={cameraPosition}
            markers={appleMarkers}
            onMarkerClick={handleMarkerPress}
            style={{ flex: 1 }}
          />
        ) : (
          <WebView
            key={id}
            originWhitelist={['*']}
            source={{ html: googleMapsHTML }}
            style={{ flex: 1 }}
            allowsInlineMediaPlayback
            domStorageEnabled
            javaScriptEnabled
            scalesPageToFit
            startInLoadingState
            useWebKit
          />
        )}
      </View>
    </View>
  )
}
