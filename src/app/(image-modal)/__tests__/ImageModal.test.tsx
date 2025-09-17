import { fireEvent, render } from '@testing-library/react-native'
import { router, useLocalSearchParams } from 'expo-router'
import type React from 'react'
import type { ReactNode } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import ImageModal from '@/app/(image-modal)/image-modal'
import useThemeStore from '@/store/theme'
import { getAirplaneImageSource } from '@/utils/feature/getAirplaneImage'

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

jest.mock('@/assets/icons/close', () => 'Close')

jest.mock('@likashefqet/react-native-image-zoom', () => {
  const { View } = require('react-native')

  return {
    Zoomable: ({ children }: { children: ReactNode }) => <View testID="zoomable">{children}</View>,
  }
})

const mockedUseLocalSearchParams = useLocalSearchParams as jest.MockedFunction<
  typeof useLocalSearchParams
>

jest.mock('@/utils/feature/getAirplaneImage')

const mockedGetAirplaneImageSource = getAirplaneImageSource as jest.MockedFunction<
  typeof getAirplaneImageSource
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
  mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })
})

describe('ImageModal', () => {
  it('should render the title and image correctly', () => {
    const mockedTitle = 'F-16 Fighting Falcon'
    const mockedImageKey = 'f16'
    const mockedImageSource = { uri: 'path/to/f16.jpg' }

    mockedUseLocalSearchParams.mockReturnValue({
      title: mockedTitle,
      selectedImageKey: mockedImageKey,
    })

    mockedGetAirplaneImageSource.mockReturnValue(mockedImageSource as any)

    const { getByText, getByTestId } = renderWithSafeAreaProvider(<ImageModal />)

    expect(getByText(mockedTitle)).toBeTruthy()

    expect(mockedGetAirplaneImageSource).toHaveBeenCalledWith(mockedImageKey)
    const image = getByTestId('mocked-image')
    expect(image.props.source).toEqual(mockedImageSource)
  })

  it('should call router.back when the close button is pressed', () => {
    mockedUseLocalSearchParams.mockReturnValue({
      title: 'Any Title',
      selectedImageKey: 'any-key',
    })
    mockedGetAirplaneImageSource.mockReturnValue({ uri: 'path/to/any.jpg' } as any)

    const { getByTestId } = renderWithSafeAreaProvider(<ImageModal />)

    const closeButton = getByTestId('close-button')

    fireEvent.press(closeButton)

    expect(router.back).toHaveBeenCalledTimes(1)
  })

  it('should render gracefully with a null image source', () => {
    mockedUseLocalSearchParams.mockReturnValue({
      title: 'Title Without Image',
      selectedImageKey: undefined,
    } as any)

    const { getByText, getByTestId } = renderWithSafeAreaProvider(<ImageModal />)

    expect(getByText('Title Without Image')).toBeTruthy()
    const image = getByTestId('mocked-image')
    expect(image.props.source).toBeNull()

    expect(mockedGetAirplaneImageSource).not.toHaveBeenCalled()
  })
})

describe('ImageModal Screen Snapshot', () => {
  it('should render the ImageModal Screen successfully', () => {
    mockedUseLocalSearchParams.mockReturnValue({
      title: 'Any Title',
      selectedImageKey: 'any-key',
    })

    mockedGetAirplaneImageSource.mockReturnValue({ uri: 'path/to/any.jpg' } as any)

    const { toJSON } = renderWithSafeAreaProvider(<ImageModal />)

    expect(toJSON()).toMatchSnapshot()
  })
})
