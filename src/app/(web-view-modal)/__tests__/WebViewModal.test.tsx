import { fireEvent, render, screen } from '@testing-library/react-native'
import { router } from 'expo-router'
import type { ReactNode } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import WebViewModal from '@/app/(web-view-modal)/web-view-modal'
import useThemeStore from '@/store/theme'

const { useLocalSearchParams } = require('expo-router')

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

jest.mock('@/components/common', () => {
  const { View, Text } = require('react-native')

  return {
    SafeLayout: ({ children }: { children: ReactNode }) => (
      <View testID="safe-layout">{children}</View>
    ),

    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

const mockedTitle = 'Test Web Page'
const mockedUrl = 'https://www.google.com'

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
  useLocalSearchParams.mockReturnValue({
    title: mockedTitle,
    webViewUrl: mockedUrl,
  })

  mockedUseThemeStore.mockReturnValue({
    selectedTheme: 'light',
  })
})

describe('WebViewModal Screen', () => {
  it('should render the title and WebView with the correct URL', async () => {
    await renderWithSafeAreaProvider(<WebViewModal />)

    expect(screen.getByText(mockedTitle)).toBeTruthy()

    const webView = screen.getByTestId('mocked-webview')
    expect(webView.props.source.uri).toBe(mockedUrl)
  })

  it('should call router.back() when the close button is pressed', async () => {
    await renderWithSafeAreaProvider(<WebViewModal />)

    const closeButton = screen.getByTestId('close-button')

    await fireEvent.press(closeButton)

    expect(router.back).toHaveBeenCalledTimes(1)
  })

  it('should render correctly even if params are undefined', async () => {
    useLocalSearchParams.mockReturnValue({
      title: undefined,
      webViewUrl: undefined,
    })

    await renderWithSafeAreaProvider(<WebViewModal />)

    expect(screen.queryByText(mockedTitle)).toBeNull()

    const webView = screen.getByTestId('mocked-webview')
    expect(webView.props.source.uri).toBeUndefined()
  })
})

describe('WebViewModal Screen Snapshot', () => {
  it('should render the WebViewModal Screen successfully', async () => {
    const { toJSON } = await renderWithSafeAreaProvider(<WebViewModal />)

    expect(toJSON()).toMatchSnapshot()
  })
})
