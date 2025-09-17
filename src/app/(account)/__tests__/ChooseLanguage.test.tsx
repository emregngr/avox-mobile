import { act, fireEvent, render, within } from '@testing-library/react-native'
import { router } from 'expo-router'
import type { ReactNode } from 'react'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import ChooseLanguageScreen from '@/app/(account)/choose-language'
import useLocaleStore, { changeLocale } from '@/store/locale'
import useThemeStore from '@/store/theme'
import { Logger } from '@/utils/common/logger'

jest.mock('@/utils/common/logger')

const mockedLoggerBreadcrumb = Logger.breadcrumb as jest.MockedFunction<typeof Logger.breadcrumb>

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

const mockedChangeLocale = changeLocale as jest.MockedFunction<typeof changeLocale>

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

jest.mock('@/components/common', () => {
  const { View, Text, TouchableOpacity } = require('react-native')

  return {
    SafeLayout: ({ children }: { children: ReactNode }) => (
      <View testID="safe-layout">{children}</View>
    ),

    Header: ({ title, backIconOnPress }: { title: string; backIconOnPress: () => void }) => (
      <View>
        <Text testID="header-title">{title}</Text>
        <TouchableOpacity onPress={backIconOnPress} testID="back-button" />
      </View>
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
  mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })
  mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })
})

describe('ChooseLanguage Screen', () => {
  it('should render the list of languages correctly', () => {
    const { getByText } = renderWithSafeAreaProvider(<ChooseLanguageScreen />)
    expect(getByText('Türkçe')).toBeTruthy()
    expect(getByText('English')).toBeTruthy()
  })

  it('should display a checkmark next to the selected language', () => {
    mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'tr' })

    const { getByTestId } = renderWithSafeAreaProvider(<ChooseLanguageScreen />)

    const turkishItem = getByTestId('language-item-tr')
    const englishItem = getByTestId('language-item-en')

    expect(within(turkishItem).queryByTestId('mocked-svg-icon')).toBeTruthy()
    expect(within(englishItem).queryByTestId('mocked-svg-icon')).toBeNull()
  })

  it('should call changeLocale and router.back when a new language is selected', async () => {
    mockedChangeLocale.mockResolvedValue(undefined)
    const { getByTestId } = renderWithSafeAreaProvider(<ChooseLanguageScreen />)

    const turkishButton = getByTestId('language-item-tr')
    await act(async () => {
      fireEvent.press(turkishButton)
    })

    expect(mockedChangeLocale).toHaveBeenCalledWith('tr')
    expect(router.back).toHaveBeenCalledTimes(1)
  })

  it('should log an error if changing locale fails', async () => {
    const error = new Error('Failed to change locale')
    mockedChangeLocale.mockRejectedValue(error)
    const { getByTestId } = renderWithSafeAreaProvider(<ChooseLanguageScreen />)

    const englishButton = getByTestId('language-item-en')
    await act(async () => {
      fireEvent.press(englishButton)
    })

    expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith('changeLocaleError', 'error', error)
    expect(router.back).not.toHaveBeenCalled()
  })

  it('should call router.back when the header back button is pressed', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<ChooseLanguageScreen />)
    const backButton = getByTestId('back-button')
    fireEvent.press(backButton)
    expect(router.back).toHaveBeenCalledTimes(1)
  })
})

describe('ChooseLanguage Screen Snapshot', () => {
  it('should render the ChooseLanguage Screen successfully', () => {
    const { toJSON } = renderWithSafeAreaProvider(<ChooseLanguageScreen />)

    expect(toJSON()).toMatchSnapshot()
  })
})
