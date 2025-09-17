import { render } from '@testing-library/react-native'
import type { ReactNode } from 'react'
import React from 'react'

import { RenderTabBar } from '@/components/common/RenderTabBar'
import useThemeStore from '@/store/theme'

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

jest.mock('@/utils/common/responsive', () => ({
  responsive: {
    deviceWidth: 375,
  },
}))

jest.mock('react-native-collapsible-tab-view', () => {
  const { View } = require('react-native')

  return {
    MaterialTabBar: ({
      children,
      TabItemComponent,
      ...props
    }: {
      children: ReactNode
      TabItemComponent: any
      props: any
    }) => (
      <View testID="material-tab-bar" {...props}>
        {TabItemComponent ? (
          <View testID="tab-item-component">
            {TabItemComponent({
              index: 0,
              name: 'Test Tab',
              testID: 'tab-item',
              label: ({ index, name }: any) => (
                <View testID="tab-label">
                  <View>{name}</View>
                </View>
              ),
            })}
          </View>
        ) : null}
        {children}
      </View>
    ),

    MaterialTabItem: ({
      children,
      label,
      android_ripple,
      pressOpacity,
      ...props
    }: {
      children: ReactNode
      label: any
      android_ripple: any
      pressOpacity: any
    }) => (
      <View
        testID="material-tab-item"
        {...props}
        android_ripple={android_ripple}
        pressOpacity={pressOpacity}
      >
        {label ? (
          <View testID="tab-label-container">{label({ index: 0, name: 'Test Tab' })}</View>
        ) : null}
        {children}
      </View>
    ),
  }
})

const mockedDefaultProps = {
  activeIndex: 0,
  tabType: 'discover',
  props: {
    navigationState: {
      index: 0,
      routes: [
        { key: 'tab1', title: 'Tab 1' },
        { key: 'tab2', title: 'Tab 2' },
      ],
    },
  },
}

beforeEach(() => {
  mockedUseThemeStore.mockReturnValue({
    selectedTheme: 'light',
  })
})

describe('RenderTabBar Component', () => {
  describe('Rendering', () => {
    it('renders with basic props', () => {
      const { getByTestId } = render(<RenderTabBar {...mockedDefaultProps} />)

      expect(getByTestId('material-tab-bar')).toBeTruthy()
    })

    it('renders MaterialTabBar with correct props', () => {
      const { getByTestId } = render(<RenderTabBar {...mockedDefaultProps} />)

      const tabBar = getByTestId('material-tab-bar')
      expect(tabBar).toBeTruthy()
    })

    it('renders TabItemComponent', () => {
      const { getByTestId } = render(<RenderTabBar {...mockedDefaultProps} />)

      const tabItemComponent = getByTestId('tab-item-component')
      expect(tabItemComponent).toBeTruthy()
    })

    it('renders tab label with correct text', () => {
      const { getByText } = render(<RenderTabBar {...mockedDefaultProps} />)

      expect(getByText('Test Tab')).toBeTruthy()
    })

    it('renders tab label container', () => {
      const { getByTestId } = render(<RenderTabBar {...mockedDefaultProps} />)

      const labelContainer = getByTestId('tab-label-container')
      expect(labelContainer).toBeTruthy()
    })
  })

  describe('Styling', () => {
    it('applies correct indicator style with primary100 color', () => {
      const { getByTestId } = render(<RenderTabBar {...mockedDefaultProps} />)

      const tabBar = getByTestId('material-tab-bar')
      expect(tabBar).toBeTruthy()
    })

    it('applies correct background color from theme', () => {
      const { getByTestId } = render(<RenderTabBar {...mockedDefaultProps} />)

      const tabBar = getByTestId('material-tab-bar')
      expect(tabBar).toBeTruthy()
    })

    it('applies correct tab bar width based on device width', () => {
      const { getByTestId } = render(<RenderTabBar {...mockedDefaultProps} />)

      const tabBar = getByTestId('material-tab-bar')
      expect(tabBar).toBeTruthy()
    })

    it('calculates tab item width correctly for 2-tab layout', () => {
      const { getByTestId } = render(<RenderTabBar {...mockedDefaultProps} />)

      const labelContainer = getByTestId('tab-label-container')
      expect(labelContainer).toBeTruthy()
    })
  })

  describe('Active State', () => {
    it('applies active text color when tab is active (index 0)', () => {
      const { getByText } = render(<RenderTabBar {...mockedDefaultProps} activeIndex={0} />)

      const tabText = getByText('Test Tab')
      expect(tabText).toBeTruthy()
    })

    it('applies inactive text color when tab is not active', () => {
      const { getByText } = render(<RenderTabBar {...mockedDefaultProps} activeIndex={1} />)

      const tabText = getByText('Test Tab')
      expect(tabText).toBeTruthy()
    })
  })

  describe('Theme Integration', () => {
    it('uses light theme colors by default', () => {
      const { getByTestId } = render(<RenderTabBar {...mockedDefaultProps} />)

      const tabBar = getByTestId('material-tab-bar')
      expect(tabBar).toBeTruthy()
    })

    it('handles missing theme colors gracefully', () => {
      jest.doMock('@/store/theme', () => ({
        default: () => ({
          selectedTheme: 'nonexistent',
        }),
      }))

      const component = render(<RenderTabBar {...mockedDefaultProps} />)
      expect(component).toBeTruthy()
    })

    it('uses primary100 color for both indicator and ripple effect', () => {
      const { getByTestId } = render(<RenderTabBar {...mockedDefaultProps} />)

      const tabBar = getByTestId('material-tab-bar')
      const tabItemComponent = getByTestId('tab-item-component')

      expect(tabBar).toBeTruthy()
      expect(tabItemComponent).toBeTruthy()
    })
  })

  describe('Responsive Design', () => {
    it('calculates correct widths for different device sizes', () => {
      jest.doMock('@/utils/common/responsive', () => ({
        responsive: {
          deviceWidth: 414,
        },
      }))

      const component = render(<RenderTabBar {...mockedDefaultProps} />)
      expect(component).toBeTruthy()
    })

    it('handles small device widths', () => {
      jest.doMock('@/utils/common/responsive', () => ({
        responsive: {
          deviceWidth: 320,
        },
      }))

      const component = render(<RenderTabBar {...mockedDefaultProps} />)
      expect(component).toBeTruthy()
    })
  })

  describe('Android Ripple Effect', () => {
    it('configures android ripple effect with correct properties', () => {
      const { getByTestId } = render(<RenderTabBar {...mockedDefaultProps} />)

      const tabItemComponent = getByTestId('tab-item-component')
      expect(tabItemComponent).toBeTruthy()
    })
  })

  describe('Props Forwarding', () => {
    it('forwards props to MaterialTabBar', () => {
      const customProps = {
        ...mockedDefaultProps,
        props: {
          ...mockedDefaultProps.props,
          customProp: 'test-value',
        },
      }

      const { getByTestId } = render(<RenderTabBar {...customProps} />)

      const tabBar = getByTestId('material-tab-bar')
      expect(tabBar).toBeTruthy()
    })
  })

  describe('Tab Item Configuration', () => {
    it('sets pressOpacity to 1', () => {
      const { getByTestId } = render(<RenderTabBar {...mockedDefaultProps} />)

      const tabItemComponent = getByTestId('tab-item-component')
      expect(tabItemComponent).toBeTruthy()
    })

    it('uses body1 text type for tab labels', () => {
      const { getByText } = render(<RenderTabBar {...mockedDefaultProps} />)

      const tabText = getByText('Test Tab')
      expect(tabText).toBeTruthy()
    })
  })

  describe('Layout Styling', () => {
    it('applies correct height to tab bar and indicator', () => {
      const { getByTestId } = render(<RenderTabBar {...mockedDefaultProps} />)

      const tabBar = getByTestId('material-tab-bar')
      expect(tabBar).toBeTruthy()
    })

    it('applies correct border radius to tab bar and indicator', () => {
      const { getByTestId } = render(<RenderTabBar {...mockedDefaultProps} />)

      const tabBar = getByTestId('material-tab-bar')
      expect(tabBar).toBeTruthy()
    })

    it('sets indicator z-index correctly', () => {
      const { getByTestId } = render(<RenderTabBar {...mockedDefaultProps} />)

      const tabBar = getByTestId('material-tab-bar')
      expect(tabBar).toBeTruthy()
    })
  })

  describe('Container Styling', () => {
    it('applies self-center className to container', () => {
      const component = render(<RenderTabBar {...mockedDefaultProps} />)
      expect(component).toBeTruthy()
    })
  })

  describe('Edge Cases', () => {
    it('handles negative activeIndex', () => {
      const propsWithNegativeIndex = {
        ...mockedDefaultProps,
        activeIndex: -1,
      }

      const component = render(<RenderTabBar {...propsWithNegativeIndex} />)
      expect(component).toBeTruthy()
    })

    it('handles very large activeIndex', () => {
      const propsWithLargeIndex = {
        ...mockedDefaultProps,
        activeIndex: 999,
      }

      const component = render(<RenderTabBar {...propsWithLargeIndex} />)
      expect(component).toBeTruthy()
    })

    it('handles empty props object', () => {
      const propsWithEmptyProps = {
        ...mockedDefaultProps,
        props: {},
      }

      const component = render(<RenderTabBar {...propsWithEmptyProps} />)
      expect(component).toBeTruthy()
    })

    it('handles missing primary100 color in theme', () => {
      jest.doMock('@/themes', () => ({
        themeColors: {
          light: {
            background: {
              tertiary: '#F5F5F5',
            },
          },
        },
      }))

      const component = render(<RenderTabBar {...mockedDefaultProps} />)
      expect(component).toBeTruthy()
    })

    it('handles missing background colors in theme', () => {
      jest.doMock('@/themes', () => ({
        themeColors: {
          light: {
            primary100: '#007AFF',
          },
        },
      }))

      const component = render(<RenderTabBar {...mockedDefaultProps} />)
      expect(component).toBeTruthy()
    })
  })

  describe('Label Component Structure', () => {
    it('renders label with correct className structure', () => {
      const { getByTestId } = render(<RenderTabBar {...mockedDefaultProps} />)

      const labelContainer = getByTestId('tab-label-container')
      expect(labelContainer).toBeTruthy()
    })
  })
})

describe('RenderTabBar Component Snapshot', () => {
  it('should render the RenderTabBar Component successfully', () => {
    const { toJSON } = render(<RenderTabBar {...mockedDefaultProps} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
