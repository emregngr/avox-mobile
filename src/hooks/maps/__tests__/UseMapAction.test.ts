import { act, renderHook } from '@testing-library/react-native'
import * as Linking from 'expo-linking'
import type { Coordinates } from 'expo-maps'
import type { AppleMapsMarker } from 'expo-maps/build/apple/AppleMaps.types'
import { Platform } from 'react-native'

import { useMapActions } from '@/hooks/maps/useMapAction'
import useThemeStore from '@/store/theme'

const { mockedUseSafeAreaInsets } = require('react-native-safe-area-context')
const { mockedShowActionSheet } = require('@expo/react-native-action-sheet')

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

const mockedLocaleStrings = {
  appleMaps: 'Apple Maps',
  googleMaps: 'Google Maps',
  cancel: 'Cancel',
  selectMapApp: 'Select Map App',
}

const mockedMarker = {
  coordinates: {
    latitude: 34.0522,
    longitude: -118.2437,
  },
  id: '1',
  title: 'Los Angeles',
  systemImage: 'image.png',
  tintColor: 'red',
} as AppleMapsMarker

const mockedLocationName = 'Los Angeles'
const { latitude, longitude } = mockedMarker.coordinates as Coordinates
const encodedLocationName = encodeURIComponent(mockedLocationName)

describe('useMapActions', () => {
  beforeEach(() => {
    mockedUseThemeStore.mockReturnValue({ selectedTheme: 'dark' })

    mockedUseSafeAreaInsets.mockReturnValue({ bottom: 34 })
  })

  it('should not open action sheet if marker coordinate are missing', async () => {
    const { result } = renderHook(() => useMapActions(mockedLocaleStrings))

    await act(async () => {
      result.current.onMarkerClick({ id: '2' }, mockedLocationName)
    })

    expect(mockedShowActionSheet).not.toHaveBeenCalled()
  })

  describe('on iOS', () => {
    beforeEach(() => {
      Platform.OS = 'ios'
    })

    it('should open Apple Maps when selected', async () => {
      const { result } = renderHook(() => useMapActions(mockedLocaleStrings))

      await act(async () => {
        result.current.onMarkerClick(mockedMarker, mockedLocationName)
      })

      const callback = mockedShowActionSheet.mock.calls[0][1]
      expect(callback).toBeInstanceOf(Function)
      await act(async () => {
        await callback(0)
      })

      const expectedUrl = `http://maps.apple.com/?q=${encodedLocationName}&ll=${latitude},${longitude}`
      expect(Linking.openURL).toHaveBeenCalledWith(expectedUrl)
    })

    it('should open Google Maps when selected', async () => {
      const { result } = renderHook(() => useMapActions(mockedLocaleStrings))

      await act(async () => {
        result.current.onMarkerClick(mockedMarker, mockedLocationName)
      })

      const callback = mockedShowActionSheet.mock.calls[0][1]
      expect(callback).toBeInstanceOf(Function)
      await act(async () => {
        await callback(1)
      })

      const expectedUrl = `https://maps.google.com/?q=${encodedLocationName}&ll=${latitude},${longitude}`
      expect(Linking.openURL).toHaveBeenCalledWith(expectedUrl)
    })

    it('should do nothing when cancel is selected', async () => {
      const { result } = renderHook(() => useMapActions(mockedLocaleStrings))

      await act(async () => {
        result.current.onMarkerClick(mockedMarker, mockedLocationName)
      })

      const callback = mockedShowActionSheet.mock.calls[0][1]
      expect(callback).toBeInstanceOf(Function)
      await act(async () => {
        await callback(2)
      })

      expect(Linking.openURL).not.toHaveBeenCalled()
    })
  })

  describe('on Android', () => {
    beforeEach(() => {
      Platform.OS = 'android'
    })

    it('should open Google Maps when selected', async () => {
      const { result } = renderHook(() => useMapActions(mockedLocaleStrings))

      await act(async () => {
        result.current.onMarkerClick(mockedMarker, mockedLocationName)
      })

      expect(mockedShowActionSheet.mock.calls[0][0].options).toEqual([
        mockedLocaleStrings.googleMaps,
        mockedLocaleStrings.cancel,
      ])

      const callback = mockedShowActionSheet.mock.calls[0][1]
      expect(callback).toBeInstanceOf(Function)
      await act(async () => {
        await callback(0)
      })

      const expectedUrl = `https://maps.google.com/?q=${encodedLocationName}&ll=${latitude},${longitude}`
      expect(Linking.openURL).toHaveBeenCalledWith(expectedUrl)
    })

    it('should do nothing when cancel is selected', async () => {
      const { result } = renderHook(() => useMapActions(mockedLocaleStrings))

      await act(async () => {
        result.current.onMarkerClick(mockedMarker, mockedLocationName)
      })

      const callback = mockedShowActionSheet.mock.calls[0][1]
      expect(callback).toBeInstanceOf(Function)
      await act(async () => {
        await callback(1)
      })

      expect(Linking.openURL).not.toHaveBeenCalled()
    })
  })
})
