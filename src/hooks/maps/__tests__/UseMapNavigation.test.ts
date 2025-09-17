import { act, renderHook } from '@testing-library/react-native'
import * as Linking from 'expo-linking'
import { Platform } from 'react-native'

import { useMapNavigation } from '@/hooks/maps/useMapNavigation'
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

const lat = 41.015137
const lng = 28.97953
const placeName = 'İstanbul'
const encodedPlaceName = encodeURIComponent(placeName)

describe('useMapNavigation', () => {
  beforeEach(() => {
    mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })

    mockedUseSafeAreaInsets.mockReturnValue({ bottom: 34 })
  })

  it('should not open action sheet if latitude or longitude is invalid', async () => {
    const { result } = renderHook(() => useMapNavigation(mockedLocaleStrings))

    await act(async () => {
      result.current.openMapNavigation(0, 0, placeName)
    })

    expect(mockedShowActionSheet).not.toHaveBeenCalled()
  })

  describe('on iOS', () => {
    beforeEach(() => {
      Platform.OS = 'ios'
    })

    it('should open Apple Maps when the first option is selected', async () => {
      const { result } = renderHook(() => useMapNavigation(mockedLocaleStrings))

      await act(async () => {
        result.current.openMapNavigation(lat, lng, placeName)
      })

      expect(mockedShowActionSheet.mock.calls[0][0].options).toEqual([
        'Apple Maps',
        'Google Maps',
        'Cancel',
      ])

      const callback = mockedShowActionSheet.mock.calls[0][1]
      await act(async () => {
        await callback(0)
      })

      const expectedUrl = `http://maps.apple.com/?q=${encodedPlaceName}&ll=${lat},${lng}`
      expect(Linking.openURL).toHaveBeenCalledWith(expectedUrl)
    })

    it('should open Google Maps when the second option is selected', async () => {
      const { result } = renderHook(() => useMapNavigation(mockedLocaleStrings))

      await act(async () => {
        result.current.openMapNavigation(lat, lng, placeName)
      })

      const callback = mockedShowActionSheet.mock.calls[0][1]
      await act(async () => {
        await callback(1)
      })

      const expectedUrl = `https://maps.google.com/?q=${encodedPlaceName}&ll=${lat},${lng}`
      expect(Linking.openURL).toHaveBeenCalledWith(expectedUrl)
    })

    it('should do nothing when cancel is selected', async () => {
      const { result } = renderHook(() => useMapNavigation(mockedLocaleStrings))

      await act(async () => {
        result.current.openMapNavigation(lat, lng, placeName)
      })

      const callback = mockedShowActionSheet.mock.calls[0][1]
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

    it('should open Google Maps when the first option is selected', async () => {
      const { result } = renderHook(() => useMapNavigation(mockedLocaleStrings))

      await act(async () => {
        result.current.openMapNavigation(lat, lng, placeName)
      })

      expect(mockedShowActionSheet.mock.calls[0][0].options).toEqual(['Google Maps', 'Cancel'])

      const callback = mockedShowActionSheet.mock.calls[0][1]
      await act(async () => {
        await callback(0)
      })

      const expectedUrl = `https://maps.google.com/?q=${encodedPlaceName}&ll=${lat},${lng}`
      expect(Linking.openURL).toHaveBeenCalledWith(expectedUrl)
    })

    it('should do nothing when cancel is selected', async () => {
      const { result } = renderHook(() => useMapNavigation(mockedLocaleStrings))

      await act(async () => {
        result.current.openMapNavigation(lat, lng, placeName)
      })

      const callback = mockedShowActionSheet.mock.calls[0][1]
      await act(async () => {
        await callback(1)
      })

      expect(Linking.openURL).not.toHaveBeenCalled()
    })
  })
})
