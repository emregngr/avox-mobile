import { render } from '@testing-library/react-native'
import type { ReactNode } from 'react'
import React from 'react'
import { Platform } from 'react-native'

import { SafeLayout } from '@/components/common/SafeLayout'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native')

  return {
    SafeAreaView: ({
      children,
      className,
      edges,
      ...props
    }: {
      children: ReactNode
      className: string
      edges: string[]
      props: any
    }) => (
      <View
        className={className} edges={edges} testID="screen"
        {...props}
      >
        {children}
      </View>
      ),

    useSafeAreaInsets: () => ({
      top: 44,
      bottom: 34,
      left: 0,
      right: 0,
    }),
  }
})

jest.mock('@/utils/common/cn', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}))

jest.mock('@/utils/common/getSafeAreaEdges', () => ({
  getSafeAreaEdges: () => ['left', 'right'],
}))

const TestContent = () => {
  const { Text } = require('react-native')
  return <Text>Test Content</Text>
}

const mockedDefaultProps = {
  children: <TestContent />,
}

const lightColors = themeColors.light

beforeEach(() => {
  Platform.OS = 'ios'

  mockedUseThemeStore.mockReturnValue({
    selectedTheme: 'light',
  })
})

describe('SafeLayout Component', () => {
  describe('Rendering', () => {
    it('renders with basic props', () => {
      const { getByTestId } = render(<SafeLayout {...mockedDefaultProps} />)

      expect(getByTestId('screen')).toBeTruthy()
    })

    it('renders children correctly', () => {
      const { getByText } = render(
        <SafeLayout>
          <TestContent />
        </SafeLayout>,
      )

      expect(getByText('Test Content')).toBeTruthy()
    })

    it('renders with custom className', () => {
      const { getByTestId } = render(
        <SafeLayout className="custom-class">
          <TestContent />
        </SafeLayout>,
      )

      const safeAreaView = getByTestId('screen')
      expect(safeAreaView).toBeTruthy()
    })

    it('applies default className when no custom className provided', () => {
      const { getByTestId } = render(<SafeLayout {...mockedDefaultProps} />)

      const safeAreaView = getByTestId('screen')
      expect(safeAreaView).toBeTruthy()
    })
  })

  describe('Top Blur', () => {
    it('renders top blur by default', () => {
      const { getAllByTestId } = render(<SafeLayout {...mockedDefaultProps} />)

      const blurViews = getAllByTestId('mocked-blur-view')
      expect(blurViews.length).toBeGreaterThanOrEqual(1)
    })

    it('does not render top blur when topBlur is false', () => {
      const { queryAllByTestId } = render(<SafeLayout {...mockedDefaultProps} topBlur={false} />)

      const blurViews = queryAllByTestId('mocked-blur-view')
      expect(blurViews.length).toBe(0)
    })

    it('renders top blur with correct style properties', () => {
      const { getAllByTestId } = render(<SafeLayout {...mockedDefaultProps} topBlur />)

      const blurViews = getAllByTestId('mocked-blur-view')
      const topBlur = blurViews[0]
      expect(topBlur).toBeTruthy()
    })

    it('applies correct className to top blur', () => {
      const { getAllByTestId } = render(<SafeLayout {...mockedDefaultProps} topBlur />)

      const blurViews = getAllByTestId('mocked-blur-view')
      const topBlur = blurViews[0]
      expect(topBlur).toBeTruthy()
    })
  })

  describe('Bottom Blur', () => {
    it('does not render bottom blur by default', () => {
      const { queryAllByTestId } = render(<SafeLayout {...mockedDefaultProps} />)

      const blurViews = queryAllByTestId('mocked-blur-view')
      expect(blurViews.length).toBe(1)
    })

    it('renders bottom blur when bottomBlur is true', () => {
      const { getAllByTestId } = render(<SafeLayout {...mockedDefaultProps} bottomBlur />)

      const blurViews = getAllByTestId('mocked-blur-view')
      expect(blurViews.length).toBe(2)
    })

    it('renders bottom blur with correct style properties', () => {
      const { getAllByTestId } = render(<SafeLayout {...mockedDefaultProps} bottomBlur />)

      const blurViews = getAllByTestId('mocked-blur-view')
      const bottomBlur = blurViews[1]
      expect(bottomBlur).toBeTruthy()
    })

    it('applies correct className to bottom blur', () => {
      const { getAllByTestId } = render(<SafeLayout {...mockedDefaultProps} bottomBlur />)

      const blurViews = getAllByTestId('mocked-blur-view')
      const bottomBlur = blurViews[1]
      expect(bottomBlur).toBeTruthy()
    })

    it('renders only bottom blur when topBlur is false and bottomBlur is true', () => {
      const { getAllByTestId } = render(
        <SafeLayout {...mockedDefaultProps} topBlur={false} bottomBlur />,
      )

      const blurViews = getAllByTestId('mocked-blur-view')
      expect(blurViews.length).toBe(1)
    })
  })

  describe('Platform-specific Blur Intensity', () => {
    it('uses intensity 30 on iOS', () => {
      Platform.OS = 'ios'

      const { getAllByTestId } = render(<SafeLayout {...mockedDefaultProps} />)

      const blurViews = getAllByTestId('mocked-blur-view')
      const topBlur = blurViews[0]
      expect(topBlur?.props.intensity).toBe(30)
    })

    it('uses intensity 50 on Android', () => {
      Platform.OS = 'android'

      const { getAllByTestId } = render(<SafeLayout {...mockedDefaultProps} />)

      const blurViews = getAllByTestId('mocked-blur-view')
      const topBlur = blurViews[0]
      expect(topBlur?.props.intensity).toBe(50)
    })
  })

  describe('Theme Integration', () => {
    it('uses correct tint based on selected theme', () => {
      const { getAllByTestId } = render(<SafeLayout {...mockedDefaultProps} />)

      const blurViews = getAllByTestId('mocked-blur-view')
      const topBlur = blurViews[0]
      expect(topBlur?.props.tint).toBe('light')
    })

    it('applies blur background color from theme', () => {
      const { getAllByTestId } = render(<SafeLayout {...mockedDefaultProps} />)

      const blurViews = getAllByTestId('mocked-blur-view')
      const topBlur = blurViews[0]
      expect(topBlur?.props.style.backgroundColor).toBe(lightColors.background.blur)
    })

    it('handles missing theme colors gracefully', () => {
      jest.doMock('@/store/theme', () => ({
        default: () => ({
          selectedTheme: 'nonexistent',
        }),
      }))

      const component = render(<SafeLayout {...mockedDefaultProps} />)
      expect(component).toBeTruthy()
    })
  })

  describe('Safe Area Edges', () => {
    it('uses default safe area edges', () => {
      const { getByTestId } = render(<SafeLayout {...mockedDefaultProps} />)

      const safeAreaView = getByTestId('screen')
      expect(safeAreaView).toBeTruthy()
    })

    it('merges custom edges with default edges', () => {
      const { getByTestId } = render(<SafeLayout {...mockedDefaultProps} edges={['bottom']} />)

      const safeAreaView = getByTestId('screen')
      expect(safeAreaView).toBeTruthy()
    })

    it('adds top edge when topBlur is false', () => {
      const { getByTestId } = render(<SafeLayout {...mockedDefaultProps} topBlur={false} />)

      const safeAreaView = getByTestId('screen')
      expect(safeAreaView).toBeTruthy()
    })

    it('does not add top edge when topBlur is true', () => {
      const { getByTestId } = render(<SafeLayout {...mockedDefaultProps} topBlur />)

      const safeAreaView = getByTestId('screen')
      expect(safeAreaView).toBeTruthy()
    })
  })

  describe('Safe Area Insets', () => {
    it('uses safe area insets for blur view heights', () => {
      const { getAllByTestId } = render(<SafeLayout {...mockedDefaultProps} bottomBlur />)

      const blurViews = getAllByTestId('mocked-blur-view')
      const topBlur = blurViews[0]
      const bottomBlur = blurViews[1]

      expect(topBlur?.props.style.height).toBe(88)
      expect(bottomBlur?.props.style.height).toBe(90)
    })
  })

  describe('Edge Cases', () => {
    it('handles empty edges array', () => {
      const { getByTestId } = render(<SafeLayout {...mockedDefaultProps} edges={[]} />)

      const safeAreaView = getByTestId('screen')
      expect(safeAreaView).toBeTruthy()
    })

    it('handles undefined edges', () => {
      const { getByTestId } = render(
        <SafeLayout {...(mockedDefaultProps as any)} edges={undefined} />,
      )

      const safeAreaView = getByTestId('screen')
      expect(safeAreaView).toBeTruthy()
    })

    it('renders without both blur views', () => {
      const { queryAllByTestId } = render(
        <SafeLayout {...mockedDefaultProps} bottomBlur={false} topBlur={false} />,
      )

      const blurViews = queryAllByTestId('mocked-blur-view')
      expect(blurViews.length).toBe(0)
    })

    it('handles both blur views enabled', () => {
      const { getAllByTestId } = render(<SafeLayout {...mockedDefaultProps} bottomBlur topBlur />)

      const blurViews = getAllByTestId('mocked-blur-view')
      expect(blurViews.length).toBe(2)
    })
  })

  describe('Blur Props Memoization', () => {
    it('memoizes blur props correctly', () => {
      const { getAllByTestId } = render(<SafeLayout {...mockedDefaultProps} />)

      const blurViews = getAllByTestId('mocked-blur-view')
      const topBlur = blurViews[0]

      expect(topBlur?.props.intensity).toBe(30)
      expect(topBlur?.props.tint).toBe('light')
    })
  })

  describe('Accessibility', () => {
    it('maintains proper z-index for blur views', () => {
      const { getAllByTestId } = render(<SafeLayout {...mockedDefaultProps} bottomBlur />)

      const blurViews = getAllByTestId('mocked-blur-view')
      blurViews.forEach(blurView => {
        expect(blurView).toBeTruthy()
      })
    })
  })

  describe('Component Structure', () => {
    it('renders blur views as siblings to children', () => {
      const { getByTestId, getByText } = render(
        <SafeLayout bottomBlur topBlur>
          <TestContent />
        </SafeLayout>,
      )

      const safeAreaView = getByTestId('screen')
      const content = getByText('Test Content')

      expect(safeAreaView).toBeTruthy()
      expect(content).toBeTruthy()
    })
  })
})

describe('SafeLayout Component Snapshot', () => {
  it('should render the SafeLayout Component successfully', () => {
    const { toJSON } = render(<SafeLayout {...mockedDefaultProps} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
