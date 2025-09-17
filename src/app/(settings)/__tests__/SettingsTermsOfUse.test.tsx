import { fireEvent, render } from '@testing-library/react-native'
import { router } from 'expo-router'
import type { ReactNode } from 'react'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import SettingsTermsOfUse from '@/app/(settings)/settings-terms-of-use'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

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

    ThemedText: ({
      children,
      testID,
      color,
      type,
    }: {
      children: ReactNode
      testID?: string
      color?: string
      type?: string
    }) => <Text testID={testID || `themed-text-${type}-${color}`}>{children}</Text>,
  }
})

const renderWithSafeAreaProvider = (component: ReactNode) =>
  render(
    <SafeAreaProvider
      initialMetrics={{
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
        frame: { x: 0, y: 0, width: 375, height: 812 },
      }}
    >
      {component}
    </SafeAreaProvider>,
  )

beforeEach(() => {
  mockedUseLocaleStore.mockReturnValue({
    selectedLocale: 'en',
  })

  mockedUseThemeStore.mockReturnValue({
    selectedTheme: 'light',
  })

  mockedGetLocale.mockImplementation((key: string) => {
    const translations: Record<string, string> = {
      termsOfUse: 'Terms of Use',
    }
    return translations[key] || key
  })
})

describe('SettingsTermsOfUse Screen', () => {
  it('should render terms of use screen with header and initial state', () => {
    const { getByTestId, getByText } = renderWithSafeAreaProvider(<SettingsTermsOfUse />)

    expect(getByTestId('safe-layout')).toBeTruthy()
    expect(getByTestId('header-title')).toBeTruthy()
    expect(getByText('Terms of Use')).toBeTruthy()
  })

  it('should call router.back when back button is pressed', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<SettingsTermsOfUse />)

    const backButton = getByTestId('back-button')
    fireEvent.press(backButton)

    expect(router.back).toHaveBeenCalledTimes(1)
  })

  it('should render English terms of use text when locale is en', () => {
    mockedUseLocaleStore.mockReturnValue({
      selectedLocale: 'en',
    })

    const { getByTestId } = renderWithSafeAreaProvider(<SettingsTermsOfUse />)

    const themedText = getByTestId('themed-text-body1-text-100')
    expect(themedText.props.children).toContain('Terms of Use')
    expect(themedText.props.children).toContain(
      'By using our application, you agree to the following terms',
    )
    expect(themedText.props.children).toContain('Terms of Service')
    expect(themedText.props.children).toContain('User Account and Security')
  })

  it('should render Turkish terms of use text when locale is tr', () => {
    mockedUseLocaleStore.mockReturnValue({
      selectedLocale: 'tr',
    })

    mockedGetLocale.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        termsOfUse: 'Kullanım Koşulları',
      }
      return translations[key] || key
    })

    const { getByTestId } = renderWithSafeAreaProvider(<SettingsTermsOfUse />)

    const themedText = getByTestId('themed-text-body1-text-100')
    expect(themedText.props.children).toContain('Kullanım Koşulları')
    expect(themedText.props.children).toContain(
      'Uygulamamızı kullanarak aşağıdaki şartları kabul etmiş sayılırsınız',
    )
    expect(themedText.props.children).toContain('Hizmet Kullanım Koşulları')
    expect(themedText.props.children).toContain('Kullanıcı Hesabı ve Güvenlik')
  })

  it('should display user responsibility information', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<SettingsTermsOfUse />)

    const themedText = getByTestId('themed-text-body1-text-100')
    expect(themedText.props.children).toContain('responsible for all activities')
    expect(themedText.props.children).toContain('protecting the confidentiality')
  })

  it('should display prohibited uses section', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<SettingsTermsOfUse />)

    const themedText = getByTestId('themed-text-body1-text-100')
    expect(themedText.props.children).toContain('Prohibited Uses')
    expect(themedText.props.children).toContain('illegal, harmful, or inappropriate content')
    expect(themedText.props.children).toContain('harassing other users')
    expect(themedText.props.children).toContain('commercial purposes')
  })

  it('should display intellectual property rights information', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<SettingsTermsOfUse />)

    const themedText = getByTestId('themed-text-body1-text-100')
    expect(themedText.props.children).toContain('Intellectual Property Rights')
    expect(themedText.props.children).toContain('intellectual property of our company')
    expect(themedText.props.children).toContain('prohibited to copy, modify, or distribute')
  })

  it('should display service changes information', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<SettingsTermsOfUse />)

    const themedText = getByTestId('themed-text-body1-text-100')
    expect(themedText.props.children).toContain('Service Changes')
    expect(themedText.props.children).toContain('reserve the right to modify')
    expect(themedText.props.children).toContain('suspend, or terminate')
  })

  it('should display limitation of liability section', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<SettingsTermsOfUse />)

    const themedText = getByTestId('themed-text-body1-text-100')
    expect(themedText.props.children).toContain('Limitation of Liability')
    expect(themedText.props.children).toContain('as is')
    expect(themedText.props.children).toContain('uninterrupted or error-free')
    expect(themedText.props.children).toContain('not liable for any damages')
  })

  it('should display account termination information', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<SettingsTermsOfUse />)

    const themedText = getByTestId('themed-text-body1-text-100')
    expect(themedText.props.children).toContain('Account Termination')
    expect(themedText.props.children).toContain('suspend or terminate accounts')
    expect(themedText.props.children).toContain('terminate your account at any time')
  })

  it('should display contact and support information', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<SettingsTermsOfUse />)

    const themedText = getByTestId('themed-text-body1-text-100')
    expect(themedText.props.children).toContain('Contact and Support')
    expect(themedText.props.children).toContain('support team')
    expect(themedText.props.children).toContain('assist you as soon as possible')
  })

  it('should display updates and changes information', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<SettingsTermsOfUse />)

    const themedText = getByTestId('themed-text-body1-text-100')
    expect(themedText.props.children).toContain('Updates and Changes')
    expect(themedText.props.children).toContain('update these terms')
    expect(themedText.props.children).toContain('continued use of the application')
  })

  it('should display applicable law information', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<SettingsTermsOfUse />)

    const themedText = getByTestId('themed-text-body1-text-100')
    expect(themedText.props.children).toContain('Applicable Law')
    expect(themedText.props.children).toContain('Republic of Turkey')
    expect(themedText.props.children).toContain('courts of Turkey')
  })

  it('should display Turkish legal information when locale is tr', () => {
    mockedUseLocaleStore.mockReturnValue({
      selectedLocale: 'tr',
    })

    const { getByTestId } = renderWithSafeAreaProvider(<SettingsTermsOfUse />)

    const themedText = getByTestId('themed-text-body1-text-100')
    expect(themedText.props.children).toContain('Türkiye Cumhuriyeti yasalarına')
    expect(themedText.props.children).toContain('Türkiye mahkemeleri')
  })

  it('should display privacy and data use information', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<SettingsTermsOfUse />)

    const themedText = getByTestId('themed-text-body1-text-100')
    expect(themedText.props.children).toContain('Privacy and Data Use')
    expect(themedText.props.children).toContain('Privacy Policy')
    expect(themedText.props.children).toContain('consent to the collection and use')
  })

  it('should display user content responsibility', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<SettingsTermsOfUse />)

    const themedText = getByTestId('themed-text-body1-text-100')
    expect(themedText.props.children).toContain('User Content')
    expect(themedText.props.children).toContain('responsible for all content you upload')
    expect(themedText.props.children).toContain('not infringe on copyrights')
  })

  it('should work with dark theme', () => {
    mockedUseThemeStore.mockReturnValue({
      selectedTheme: 'dark',
    })

    const { getByTestId } = renderWithSafeAreaProvider(<SettingsTermsOfUse />)

    expect(getByTestId('safe-layout')).toBeTruthy()
    expect(getByTestId('themed-text-body1-text-100')).toBeTruthy()
  })

  it('should work with light theme', () => {
    mockedUseThemeStore.mockReturnValue({
      selectedTheme: 'light',
    })

    const { getByTestId } = renderWithSafeAreaProvider(<SettingsTermsOfUse />)

    expect(getByTestId('safe-layout')).toBeTruthy()
    expect(getByTestId('themed-text-body1-text-100')).toBeTruthy()
  })
})

describe('SettingsTermsOfUse Screen Snapshot', () => {
  it('should render the SettingsTermsOfUse Screen successfully', () => {
    const { toJSON } = renderWithSafeAreaProvider(<SettingsTermsOfUse />)

    expect(toJSON()).toMatchSnapshot()
  })
})
