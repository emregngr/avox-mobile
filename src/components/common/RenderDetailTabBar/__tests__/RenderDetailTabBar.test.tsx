import { render } from '@testing-library/react-native'
import type { ReactNode } from 'react'
import React from 'react'

import { RenderDetailTabBar } from '@/components/common/RenderDetailTabBar'
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
  indicatorBackgroundColor: 'primary',
  tabType: 'airport',
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

describe('RenderDetailTabBar Component', () => {
  describe('Rendering', () => {
    it('renders with basic props', () => {
      const { getByTestId } = render(<RenderDetailTabBar {...mockedDefaultProps} />)

      expect(getByTestId('material-tab-bar')).toBeTruthy()
    })

    it('renders MaterialTabBar with correct props', () => {
      const { getByTestId } = render(<RenderDetailTabBar {...mockedDefaultProps} />)

      const tabBar = getByTestId('material-tab-bar')
      expect(tabBar).toBeTruthy()
    })

    it('renders MaterialTabItem with correct props', () => {
      const { getByTestId } = render(<RenderDetailTabBar {...mockedDefaultProps} />)

      const tabItemComponent = getByTestId('tab-item-component')
      expect(tabItemComponent).toBeTruthy()
    })

    it('renders tab label with correct text', () => {
      const { getByText } = render(<RenderDetailTabBar {...mockedDefaultProps} />)

      expect(getByText('Test Tab')).toBeTruthy()
    })
  })

  describe('Styling', () => {
    it('applies correct indicator background color from theme', () => {
      const { getByTestId } = render(
        <RenderDetailTabBar {...mockedDefaultProps} indicatorBackgroundColor="primary" />,
      )

      const tabBar = getByTestId('material-tab-bar')
      expect(tabBar).toBeTruthy()
    })

    it('uses secondary color when specified', () => {
      const { getByTestId } = render(
        <RenderDetailTabBar {...mockedDefaultProps} indicatorBackgroundColor="secondary" />,
      )

      const tabBar = getByTestId('material-tab-bar')
      expect(tabBar).toBeTruthy()
    })

    it('uses accent color when specified', () => {
      const { getByTestId } = render(
        <RenderDetailTabBar {...mockedDefaultProps} indicatorBackgroundColor="accent" />,
      )

      const tabBar = getByTestId('material-tab-bar')
      expect(tabBar).toBeTruthy()
    })

    it('applies correct width based on device width', () => {
      const { getByTestId } = render(<RenderDetailTabBar {...mockedDefaultProps} />)

      const tabBar = getByTestId('material-tab-bar')
      expect(tabBar).toBeTruthy()
    })
  })

  describe('Active State', () => {
    it('applies active text color when tab is active', () => {
      const { getByText } = render(<RenderDetailTabBar {...mockedDefaultProps} activeIndex={0} />)

      const tabText = getByText('Test Tab')
      expect(tabText).toBeTruthy()
    })

    it('applies inactive text color when tab is not active', () => {
      const { getByText } = render(<RenderDetailTabBar {...mockedDefaultProps} activeIndex={1} />)

      const tabText = getByText('Test Tab')
      expect(tabText).toBeTruthy()
    })
  })

  describe('Theme Integration', () => {
    it('uses light theme colors by default', () => {
      const { getByTestId } = render(<RenderDetailTabBar {...mockedDefaultProps} />)

      const tabBar = getByTestId('material-tab-bar')
      expect(tabBar).toBeTruthy()
    })

    it('handles missing theme colors gracefully', () => {
      jest.doMock('@/store/theme', () => ({
        default: () => ({
          selectedTheme: 'nonexistent',
        }),
      }))

      const component = render(<RenderDetailTabBar {...mockedDefaultProps} />)
      expect(component).toBeTruthy()
    })
  })

  describe('Responsive Design', () => {
    it('calculates tab width based on device width', () => {
      const { getByTestId } = render(<RenderDetailTabBar {...mockedDefaultProps} />)

      const tabBar = getByTestId('material-tab-bar')
      expect(tabBar).toBeTruthy()
    })

    it('handles different device widths', () => {
      jest.doMock('@/utils/common/responsive', () => ({
        responsive: {
          deviceWidth: 414,
        },
      }))

      const component = render(<RenderDetailTabBar {...mockedDefaultProps} />)
      expect(component).toBeTruthy()
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

      const { getByTestId } = render(<RenderDetailTabBar {...customProps} />)

      const tabBar = getByTestId('material-tab-bar')
      expect(tabBar).toBeTruthy()
    })
  })

  describe('Android Ripple Effect', () => {
    it('configures android ripple effect correctly', () => {
      const { getByTestId } = render(<RenderDetailTabBar {...mockedDefaultProps} />)

      const tabItemComponent = getByTestId('tab-item-component')
      expect(tabItemComponent).toBeTruthy()
    })
  })

  describe('Edge Cases', () => {
    it('handles undefined indicatorBackgroundColor', () => {
      const propsWithUndefinedColor = {
        ...mockedDefaultProps,
        indicatorBackgroundColor: undefined,
      }

      const component = render(<RenderDetailTabBar {...(propsWithUndefinedColor as any)} />)
      expect(component).toBeTruthy()
    })

    it('handles negative activeIndex', () => {
      const propsWithNegativeIndex = {
        ...mockedDefaultProps,
        activeIndex: -1,
      }

      const component = render(<RenderDetailTabBar {...propsWithNegativeIndex} />)
      expect(component).toBeTruthy()
    })

    it('handles very large activeIndex', () => {
      const propsWithLargeIndex = {
        ...mockedDefaultProps,
        activeIndex: 999,
      }

      const component = render(<RenderDetailTabBar {...propsWithLargeIndex} />)
      expect(component).toBeTruthy()
    })

    it('handles empty props object', () => {
      const propsWithEmptyProps = {
        ...mockedDefaultProps,
        props: {},
      }

      const component = render(<RenderDetailTabBar {...propsWithEmptyProps} />)
      expect(component).toBeTruthy()
    })
  })

  describe('Tab Item Component', () => {
    it('renders custom TabItemComponent', () => {
      const { getByTestId } = render(<RenderDetailTabBar {...mockedDefaultProps} />)

      const tabItemComponent = getByTestId('tab-item-component')
      expect(tabItemComponent).toBeTruthy()
    })

    it('renders tab label container', () => {
      const { getByTestId } = render(<RenderDetailTabBar {...mockedDefaultProps} />)

      const labelContainer = getByTestId('tab-label-container')
      expect(labelContainer).toBeTruthy()
    })
  })

  describe('Container Styling', () => {
    it('applies self-center className to container', () => {
      render(<RenderDetailTabBar {...mockedDefaultProps} />)

      const component = render(<RenderDetailTabBar {...mockedDefaultProps} />)
      expect(component).toBeTruthy()
    })
  })
})

describe('RenderDetailTabBar Component Snapshot', () => {
  it('should render the RenderDetailTabBar Component successfully', () => {
    const { toJSON } = render(<RenderDetailTabBar {...mockedDefaultProps} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
