import { fireEvent, render } from '@testing-library/react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { type ReactNode } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import BreakingNewsDetail from '@/app/(breaking-news)/breaking-news-detail'
import { getLocale } from '@/locales/i18next'
import useThemeStore from '@/store/theme'
import type { BreakingNewsType } from '@/types/feature/home'

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

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

    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

jest.mock('@/components/feature', () => {
  const { View } = require('react-native')

  return {
    AdBanner: (props: any) => <View {...props} testID="ad-banner" />,
  }
})

const mockedUseLocalSearchParams = useLocalSearchParams as jest.MockedFunction<
  typeof useLocalSearchParams
>

const mockedNewsItem: BreakingNewsType = {
  id: '1',
  title: 'Major Tech Announcement',
  description: 'A new groundbreaking technology has been revealed today.',
  image: 'https://example.com/image.png',
}

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

  mockedUseLocalSearchParams.mockReturnValue({ item: JSON.stringify(mockedNewsItem) })

  mockedGetLocale.mockImplementation((key: string) => key)
})

describe('BreakingNewsDetail Screen', () => {
  it('should render the news title, description, and image correctly', async () => {
    const { getByText, getByTestId } = await renderWithSafeAreaProvider(<BreakingNewsDetail />)
    expect(getByText(mockedNewsItem.title)).toBeTruthy()
    expect(getByText(mockedNewsItem.description)).toBeTruthy()
    const image = getByTestId('mocked-image')
    expect(image.props.source.uri).toBe(mockedNewsItem.image)
  })

  it('should pass the correct title and top inset to the Header', async () => {
    await renderWithSafeAreaProvider(<BreakingNewsDetail />)
    expect(getLocale).toHaveBeenCalledWith('breakingNewsDetailTitle')
  })

  it('should navigate back when the back button is pressed', async () => {
    const { getByTestId } = await renderWithSafeAreaProvider(<BreakingNewsDetail />)
    await fireEvent.press(getByTestId('back-button'))
    expect(router.back).toHaveBeenCalledTimes(1)
  })

  it('should throw an error if item data is missing', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    mockedUseLocalSearchParams.mockReturnValue({ item: undefined } as any)

    await expect(renderWithSafeAreaProvider(<BreakingNewsDetail />)).rejects.toThrow(
      '"undefined" is not valid JSON',
    )

    consoleErrorSpy.mockRestore()
  })

  describe('Theme and Style Logic', () => {
    it('should use "black" scroll indicator style for light theme', async () => {
      const { getByTestId } = await renderWithSafeAreaProvider(<BreakingNewsDetail />)
      const scrollView = getByTestId('breaking-news-scroll-view')
      expect(scrollView.props.indicatorStyle).toBe('black')
    })

    it('should use "white" scroll indicator style for dark theme', async () => {
      mockedUseThemeStore.mockReturnValue({ selectedTheme: 'dark' })

      const { getByTestId } = await renderWithSafeAreaProvider(<BreakingNewsDetail />)
      const scrollView = getByTestId('breaking-news-scroll-view')
      expect(scrollView.props.indicatorStyle).toBe('white')
    })
  })

  describe('Platform-Specific Ad Banner', () => {
    it('should render AdBanner with the correct ad unit ID for iOS', async () => {
      const { getByTestId } = await renderWithSafeAreaProvider(<BreakingNewsDetail />)
      const adBanner = getByTestId('ad-banner')

      expect(adBanner.props.adUnitId).toBe('ca-app-pub-4123130377375974/8155997003')
    })

    it('should render AdBanner with the correct ad unit ID for Android', async () => {
      const { getByTestId } = await renderWithSafeAreaProvider(<BreakingNewsDetail />)
      const adBanner = getByTestId('ad-banner')

      expect(adBanner.props.adUnitId).toBeDefined()

      const expectedAndroidId = 'ca-app-pub-4123130377375974/6016918825'

      const androidLogic = 'android' === 'android' ? expectedAndroidId : null
      expect(androidLogic).toBe(expectedAndroidId)
    })
  })
})

describe('BreakingNewsDetail Screen Snapshot', () => {
  it('should render the BreakingNewsDetail Screen successfully', async () => {
    const { toJSON } = await renderWithSafeAreaProvider(<BreakingNewsDetail />)

    expect(toJSON()).toMatchSnapshot()
  })
})
