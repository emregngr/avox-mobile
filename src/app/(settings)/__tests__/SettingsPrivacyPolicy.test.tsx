import { fireEvent, render } from '@testing-library/react-native'
import { router } from 'expo-router'
import type { ReactNode } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import SettingsPrivacyPolicy from '@/app/(settings)/settings-privacy-policy'
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
      privacyPolicy: 'Privacy Policy',
    }
    return translations[key] || key
  })
})

describe('SettingsPrivacyPolicy Screen', () => {
  it('should render privacy policy screen with header and initial state', async () => {
    const { getByTestId, getByText } = await renderWithSafeAreaProvider(<SettingsPrivacyPolicy />)

    expect(getByTestId('safe-layout')).toBeTruthy()
    expect(getByTestId('header-title')).toBeTruthy()
    expect(getByText('Privacy Policy')).toBeTruthy()
  })

  it('should call router.back when back button is pressed', async () => {
    const { getByTestId } = await renderWithSafeAreaProvider(<SettingsPrivacyPolicy />)

    const backButton = getByTestId('back-button')
    await fireEvent.press(backButton)

    expect(router.back).toHaveBeenCalledTimes(1)
  })

  it('should render English privacy policy text when locale is en', async () => {
    mockedUseLocaleStore.mockReturnValue({
      selectedLocale: 'en',
    })

    const { getByTestId } = await renderWithSafeAreaProvider(<SettingsPrivacyPolicy />)

    const themedText = getByTestId('themed-text-body1-text-100')
    expect(themedText.props.children).toContain('Privacy Policy')
    expect(themedText.props.children).toContain(
      'This privacy policy explains how the application collects',
    )
    expect(themedText.props.children).toContain('Information Collected')
    expect(themedText.props.children).toContain('Use of Information')
  })

  it('should render Turkish privacy policy text when locale is tr', async () => {
    mockedUseLocaleStore.mockReturnValue({
      selectedLocale: 'tr',
    })

    mockedGetLocale.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        privacyPolicy: 'Gizlilik Politikası',
      }
      return translations[key] || key
    })

    const { getByTestId } = await renderWithSafeAreaProvider(<SettingsPrivacyPolicy />)

    const themedText = getByTestId('themed-text-body1-text-100')
    expect(themedText.props.children).toContain('Gizlilik Politikası')
    expect(themedText.props.children).toContain(
      'Bu gizlilik politikası, uygulamanın kişisel verilerinizi',
    )
    expect(themedText.props.children).toContain('Toplanan Bilgiler')
    expect(themedText.props.children).toContain('Bilgilerin Kullanımı')
  })

  it('should display KVKK information in Turkish content', async () => {
    mockedUseLocaleStore.mockReturnValue({
      selectedLocale: 'tr',
    })

    const { getByTestId } = await renderWithSafeAreaProvider(<SettingsPrivacyPolicy />)

    const themedText = getByTestId('themed-text-body1-text-100')
    expect(themedText.props.children).toContain('KVKK')
    expect(themedText.props.children).toContain('6698 sayılı Kişisel Verilerin Korunması Kanunu')
  })

  it('should display contact information', async () => {
    const { getByTestId } = await renderWithSafeAreaProvider(<SettingsPrivacyPolicy />)

    const themedText = getByTestId('themed-text-body1-text-100')
    expect(themedText.props.children).toContain('avox.aviation@gmail.com')
    expect(themedText.props.children).toContain('+90 xxx xxx xx xx')
  })

  it('should display data collection information', async () => {
    const { getByTestId } = await renderWithSafeAreaProvider(<SettingsPrivacyPolicy />)

    const themedText = getByTestId('themed-text-body1-text-100')
    expect(themedText.props.children).toContain('Email address')
    expect(themedText.props.children).toContain('Phone number')
    expect(themedText.props.children).toContain('Device information')
    expect(themedText.props.children).toContain('IP address')
  })

  it('should display user rights information', async () => {
    const { getByTestId } = await renderWithSafeAreaProvider(<SettingsPrivacyPolicy />)

    const themedText = getByTestId('themed-text-body1-text-100')
    expect(themedText.props.children).toContain('Right to access')
    expect(themedText.props.children).toContain('Right to request deletion')
    expect(themedText.props.children).toContain('Right to data portability')
  })

  it('should display data security measures', async () => {
    const { getByTestId } = await renderWithSafeAreaProvider(<SettingsPrivacyPolicy />)

    const themedText = getByTestId('themed-text-body1-text-100')
    expect(themedText.props.children).toContain('Encryption technologies')
    expect(themedText.props.children).toContain('Secure server infrastructure')
    expect(themedText.props.children).toContain('Regular security assessments')
  })

  it("should display information about children's privacy", async () => {
    const { getByTestId } = await renderWithSafeAreaProvider(<SettingsPrivacyPolicy />)

    const themedText = getByTestId('themed-text-body1-text-100')
    expect(themedText.props.children).toContain('children under the age of 13')
    expect(themedText.props.children).toContain('not intended for children')
  })

  it('should display cookie and tracking information', async () => {
    const { getByTestId } = await renderWithSafeAreaProvider(<SettingsPrivacyPolicy />)

    const themedText = getByTestId('themed-text-body1-text-100')
    expect(themedText.props.children).toContain('cookies')
    expect(themedText.props.children).toContain('Session management')
    expect(themedText.props.children).toContain('Usage analysis')
  })

  it('should work with dark theme', async () => {
    mockedUseThemeStore.mockReturnValue({
      selectedTheme: 'dark',
    })

    const { getByTestId } = await renderWithSafeAreaProvider(<SettingsPrivacyPolicy />)

    expect(getByTestId('safe-layout')).toBeTruthy()
    expect(getByTestId('themed-text-body1-text-100')).toBeTruthy()
  })

  it('should work with light theme', async () => {
    mockedUseThemeStore.mockReturnValue({
      selectedTheme: 'light',
    })

    const { getByTestId } = await renderWithSafeAreaProvider(<SettingsPrivacyPolicy />)

    expect(getByTestId('safe-layout')).toBeTruthy()
    expect(getByTestId('themed-text-body1-text-100')).toBeTruthy()
  })

  it('should display data sharing information', async () => {
    const { getByTestId } = await renderWithSafeAreaProvider(<SettingsPrivacyPolicy />)

    const themedText = getByTestId('themed-text-body1-text-100')
    expect(themedText.props.children).toContain('Information Sharing')
    expect(themedText.props.children).toContain('explicit consent')
    expect(themedText.props.children).toContain('service providers')
  })

  it('should display international data transfer information', async () => {
    const { getByTestId } = await renderWithSafeAreaProvider(<SettingsPrivacyPolicy />)

    const themedText = getByTestId('themed-text-body1-text-100')
    expect(themedText.props.children).toContain('International Data Transfer')
    expect(themedText.props.children).toContain('Turkey')
    expect(themedText.props.children).toContain('EU countries')
  })
})

describe('SettingsPrivacyPolicy Screen Snapshot', () => {
  it('should render the SettingsPrivacyPolicy Screen successfully', async () => {
    const { toJSON } = await renderWithSafeAreaProvider(<SettingsPrivacyPolicy />)

    expect(toJSON()).toMatchSnapshot()
  })
})
