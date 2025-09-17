import { renderHook, waitFor } from '@testing-library/react-native'
import * as SystemUI from 'expo-system-ui'

import { useSystemUI } from '@/hooks/systemUI/useSystemUI'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import { Logger } from '@/utils/common/logger'

jest.mock('@/utils/common/logger')

const mockedLoggerBreadcrumb = Logger.breadcrumb as jest.MockedFunction<typeof Logger.breadcrumb>

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

const mockedSystemUI = SystemUI as jest.Mocked<typeof SystemUI>

describe('useSystemUI Hook', () => {
  it('should set the system background color on initial render', async () => {
    mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })
    renderHook(() => useSystemUI())
    await waitFor(() => {
      expect(mockedSystemUI.setBackgroundColorAsync).toHaveBeenCalledTimes(1)
      expect(mockedSystemUI.setBackgroundColorAsync).toHaveBeenCalledWith(
        themeColors.light.background.primary,
      )
    })
  })

  it('should update the system background color when the theme changes', async () => {
    mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })
    const { rerender } = renderHook(() => useSystemUI())
    await waitFor(() => {
      expect(mockedSystemUI.setBackgroundColorAsync).toHaveBeenCalledWith(
        themeColors.light.background.primary,
      )
    })
    mockedUseThemeStore.mockReturnValue({ selectedTheme: 'dark' })
    rerender(undefined)
    await waitFor(() => {
      expect(mockedSystemUI.setBackgroundColorAsync).toHaveBeenCalledTimes(2)
      expect(mockedSystemUI.setBackgroundColorAsync).toHaveBeenCalledWith(
        themeColors.dark.background.primary,
      )
    })
  })

  it('should log an error if SystemUI.setBackgroundColorAsync fails', async () => {
    const mockError = new Error('System UI is unavailable')
    mockedSystemUI.setBackgroundColorAsync.mockRejectedValue(mockError)
    mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })
    renderHook(() => useSystemUI())
    await waitFor(() => {
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledTimes(1)
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to update system colors',
        'error',
        mockError,
      )
    })
  })

  it('should handle cases where the primary background color is undefined', async () => {
    mockedUseThemeStore.mockReturnValue({ selectedTheme: 'brokenTheme' })
    renderHook(() => useSystemUI())
    await waitFor(() => {
      expect(mockedSystemUI.setBackgroundColorAsync).toHaveBeenCalledTimes(1)
      expect(mockedSystemUI.setBackgroundColorAsync).toHaveBeenCalledWith(undefined)
    })
  })
})
