import { fireEvent, render } from '@testing-library/react-native'
import { router, useLocalSearchParams } from 'expo-router'
import type React from 'react'
import type { ReactNode } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import TermsOfUse from '@/app/(auth)/terms-of-use'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'

jest.mock('@/locales/i18next', () => ({
  getLocale: (key: string) => key,
}))

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

jest.mock('@/components/common', () => {
  const { View, Text, TouchableOpacity } = require('react-native')

  return {
    Header: ({ title, backIconOnPress }: { title: string; backIconOnPress: () => void }) => (
      <>
        <Text testID="header-title">{title}</Text>
        <TouchableOpacity onPress={backIconOnPress} testID="back-button">
          <Text>Back</Text>
        </TouchableOpacity>
      </>
    ),

    SafeLayout: ({ children }: { children: ReactNode }) => (
      <View testID="safe-layout">{children}</View>
    ),

    ThemedGradientButton: ({
      onPress,
      label,
      disabled,
      loading,
    }: {
      label: string
      onPress: () => void
      disabled: boolean
      loading: boolean
    }) => (
      <TouchableOpacity disabled={disabled || loading} onPress={onPress} testID="accept-button">
        <Text>{label}</Text>
      </TouchableOpacity>
    ),

    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

const mockedUseLocalSearchParams = useLocalSearchParams as jest.MockedFunction<
  typeof useLocalSearchParams
>

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
  mockedUseLocalSearchParams.mockReturnValue({})

  mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'tr' })
  mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })
})

describe('TermsOfUse Screen', () => {
  it('should render correctly and display Turkish text', () => {
    const { getByText } = renderWithSafeAreaProvider(<TermsOfUse />)

    expect(getByText('termsOfUse')).toBeTruthy()
    expect(getByText('accept')).toBeTruthy()

    expect(getByText(/Türkiye Cumhuriyeti yasalarına tabidir/i)).toBeTruthy()
  })

  it('should display English text when locale is "en"', () => {
    mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })
    const { getByText } = renderWithSafeAreaProvider(<TermsOfUse />)

    expect(
      getByText(/governed by and construed in accordance with the laws of the Republic of Turkey/i),
    ).toBeTruthy()
  })

  it('should call router.back when back button is pressed', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<TermsOfUse />)

    fireEvent.press(getByTestId('back-button'))
    expect(router.back).toHaveBeenCalledTimes(1)
  })

  it('should navigate to register while preserving existing params', () => {
    mockedUseLocalSearchParams.mockReturnValue({ someParam: 'testValue' })

    const { getByText } = renderWithSafeAreaProvider(<TermsOfUse />)

    fireEvent.press(getByText('accept'))

    expect(router.navigate).toHaveBeenCalledWith({
      pathname: '/register',
      params: {
        someParam: 'testValue',
        termsOfUseParam: 'true',
      },
    })
  })
})

describe('TermsOfUse Screen Snapshot', () => {
  it('should render the TermsOfUse successfully', () => {
    const { toJSON } = renderWithSafeAreaProvider(<TermsOfUse />)

    expect(toJSON()).toMatchSnapshot()
  })
})
