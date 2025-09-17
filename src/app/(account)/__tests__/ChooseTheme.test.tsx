import { fireEvent, render, within } from '@testing-library/react-native'
import { router } from 'expo-router'
import type { ReactNode } from 'react'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import ChooseTheme from '@/app/(account)/choose-theme'
import useThemeStore, { changeTheme } from '@/store/theme'

jest.mock('@/locales/i18next', () => ({
  getLocale: (key: string) => key,
}))

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

const mockedChangeTheme = changeTheme as jest.MockedFunction<typeof changeTheme>

jest.mock('@/components/common', () => {
  const { View, Text, TouchableOpacity } = require('react-native')

  return {
    SafeLayout: ({ children }: { children: ReactNode }) => (
      <View testID="safe-layout">{children}</View>
    ),

    Header: ({ title, backIconOnPress }: { title: string; backIconOnPress: () => void }) => (
      <>
        <Text testID="header-title">{title}</Text>
        <TouchableOpacity onPress={backIconOnPress} testID="back-button">
          <Text>Back</Text>
        </TouchableOpacity>
      </>
    ),

    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

const renderWithSafeAreaProvider = (component: ReactNode) =>
  render(
    <SafeAreaProvider
      initialMetrics={{
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
        frame: { x: 0, y: 0, width: 0, height: 0 },
      }}
    >
      {component}
    </SafeAreaProvider>,
  )

beforeEach(() => {
  mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })
})

describe('ChooseTheme Screen', () => {
  it('should render theme options correctly', () => {
    const { getByText, getByTestId } = renderWithSafeAreaProvider(<ChooseTheme />)

    expect(getByText('chooseTheme')).toBeTruthy()
    expect(getByText('modeSelection')).toBeTruthy()

    expect(getByTestId('theme-item-light')).toBeTruthy()
    expect(getByTestId('theme-item-dark')).toBeTruthy()
    expect(getByText('light')).toBeTruthy()
    expect(getByText('dark')).toBeTruthy()
  })

  it('should display the correct radio icon for the selected theme', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<ChooseTheme />)

    const lightThemeItem = getByTestId('theme-item-light')
    const darkThemeItem = getByTestId('theme-item-dark')

    expect(within(lightThemeItem).getByTestId('mocked-material-community-icon')).toBeTruthy()
    expect(within(darkThemeItem).getByTestId('mocked-material-community-icon')).toBeTruthy()
  })

  it('should update radio icons when the selected theme is dark', () => {
    mockedUseThemeStore.mockReturnValue({ selectedTheme: 'dark' })
    const { getByTestId } = renderWithSafeAreaProvider(<ChooseTheme />)

    const lightThemeItem = getByTestId('theme-item-light')
    const darkThemeItem = getByTestId('theme-item-dark')

    expect(within(darkThemeItem).getByTestId('mocked-material-community-icon')).toBeTruthy()
    expect(within(lightThemeItem).getByTestId('mocked-material-community-icon')).toBeTruthy()
  })

  it('should call changeTheme and router.back when a new theme is selected', async () => {
    const { getByTestId } = renderWithSafeAreaProvider(<ChooseTheme />)

    const darkThemeButton = getByTestId('theme-item-dark')
    await fireEvent.press(darkThemeButton)

    expect(mockedChangeTheme).toHaveBeenCalledWith('dark')
    expect(mockedChangeTheme).toHaveBeenCalledTimes(1)

    expect(router.back).toHaveBeenCalledTimes(1)
  })

  it('should call router.back when the header back button is pressed', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<ChooseTheme />)

    const backButton = getByTestId('back-button')
    fireEvent.press(backButton)

    expect(router.back).toHaveBeenCalledTimes(1)
    expect(mockedChangeTheme).not.toHaveBeenCalled()
  })
})

describe('ChooseTheme Screen Snapshot', () => {
  it('should render the ChooseTheme Screen successfully', () => {
    renderWithSafeAreaProvider(<ChooseTheme />)

    const { toJSON } = renderWithSafeAreaProvider(<ChooseTheme />)

    expect(toJSON()).toMatchSnapshot()
  })
})
