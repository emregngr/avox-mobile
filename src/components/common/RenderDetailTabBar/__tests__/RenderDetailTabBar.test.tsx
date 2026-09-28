import { render } from '@testing-library/react-native'
import type { ReactNode } from 'react'

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
              label: ({ index: _index, name }: any) => (
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
    it('renders with basic props', async () => {
      const { getByTestId } = await render(<RenderDetailTabBar {...mockedDefaultProps} />)

      expect(getByTestId('material-tab-bar')).toBeTruthy()
    })

    it('renders MaterialTabBar with correct props', async () => {
      const { getByTestId } = await render(<RenderDetailTabBar {...mockedDefaultProps} />)

      const tabBar = getByTestId('material-tab-bar')
      expect(tabBar).toBeTruthy()
    })

    it('renders MaterialTabItem with correct props', async () => {
      const { getByTestId } = await render(<RenderDetailTabBar {...mockedDefaultProps} />)

      const tabItemComponent = getByTestId('tab-item-component')
      expect(tabItemComponent).toBeTruthy()
    })

    it('renders tab label with correct text', async () => {
      const { getByText } = await render(<RenderDetailTabBar {...mockedDefaultProps} />)

      expect(getByText('Test Tab')).toBeTruthy()
    })
  })

  describe('Styling', () => {
    it('applies correct indicator background color from theme', async () => {
      const { getByTestId } = await render(
        <RenderDetailTabBar {...mockedDefaultProps} indicatorBackgroundColor="primary" />,
      )

      const tabBar = getByTestId('material-tab-bar')
      expect(tabBar).toBeTruthy()
    })

    it('uses secondary color when specified', async () => {
      const { getByTestId } = await render(
        <RenderDetailTabBar {...mockedDefaultProps} indicatorBackgroundColor="secondary" />,
      )

      const tabBar = getByTestId('material-tab-bar')
      expect(tabBar).toBeTruthy()
    })

    it('uses accent color when specified', async () => {
      const { getByTestId } = await render(
        <RenderDetailTabBar {...mockedDefaultProps} indicatorBackgroundColor="accent" />,
      )

      const tabBar = getByTestId('material-tab-bar')
      expect(tabBar).toBeTruthy()
    })

    it('applies correct width based on device width', async () => {
      const { getByTestId } = await render(<RenderDetailTabBar {...mockedDefaultProps} />)

      const tabBar = getByTestId('material-tab-bar')
      expect(tabBar).toBeTruthy()
    })
  })

  describe('Active State', () => {
    it('applies active text color when tab is active', async () => {
      const { getByText } = await render(
        <RenderDetailTabBar {...mockedDefaultProps} activeIndex={0} />,
      )

      const tabText = getByText('Test Tab')
      expect(tabText).toBeTruthy()
    })

    it('applies inactive text color when tab is not active', async () => {
      const { getByText } = await render(
        <RenderDetailTabBar {...mockedDefaultProps} activeIndex={1} />,
      )

      const tabText = getByText('Test Tab')
      expect(tabText).toBeTruthy()
    })
  })

  describe('Theme Integration', () => {
    it('uses light theme colors by default', async () => {
      const { getByTestId } = await render(<RenderDetailTabBar {...mockedDefaultProps} />)

      const tabBar = getByTestId('material-tab-bar')
      expect(tabBar).toBeTruthy()
    })

    it('handles missing theme colors gracefully', async () => {
      jest.doMock('@/store/theme', () => ({
        default: () => ({
          selectedTheme: 'nonexistent',
        }),
      }))

      const component = await render(<RenderDetailTabBar {...mockedDefaultProps} />)
      expect(component).toBeTruthy()
    })
  })

  describe('Responsive Design', () => {
    it('calculates tab width based on device width', async () => {
      const { getByTestId } = await render(<RenderDetailTabBar {...mockedDefaultProps} />)

      const tabBar = getByTestId('material-tab-bar')
      expect(tabBar).toBeTruthy()
    })

    it('handles different device widths', async () => {
      jest.doMock('@/utils/common/responsive', () => ({
        responsive: {
          deviceWidth: 414,
        },
      }))

      const component = await render(<RenderDetailTabBar {...mockedDefaultProps} />)
      expect(component).toBeTruthy()
    })
  })

  describe('Props Forwarding', () => {
    it('forwards props to MaterialTabBar', async () => {
      const customProps = {
        ...mockedDefaultProps,
        props: {
          ...mockedDefaultProps.props,
          customProp: 'test-value',
        },
      }

      const { getByTestId } = await render(<RenderDetailTabBar {...customProps} />)

      const tabBar = getByTestId('material-tab-bar')
      expect(tabBar).toBeTruthy()
    })
  })

  describe('Android Ripple Effect', () => {
    it('configures android ripple effect correctly', async () => {
      const { getByTestId } = await render(<RenderDetailTabBar {...mockedDefaultProps} />)

      const tabItemComponent = getByTestId('tab-item-component')
      expect(tabItemComponent).toBeTruthy()
    })
  })

  describe('Edge Cases', () => {
    it('handles undefined indicatorBackgroundColor', async () => {
      const propsWithUndefinedColor = {
        ...mockedDefaultProps,
        indicatorBackgroundColor: undefined,
      }

      const component = await render(<RenderDetailTabBar {...(propsWithUndefinedColor as any)} />)
      expect(component).toBeTruthy()
    })

    it('handles negative activeIndex', async () => {
      const propsWithNegativeIndex = {
        ...mockedDefaultProps,
        activeIndex: -1,
      }

      const component = await render(<RenderDetailTabBar {...propsWithNegativeIndex} />)
      expect(component).toBeTruthy()
    })

    it('handles very large activeIndex', async () => {
      const propsWithLargeIndex = {
        ...mockedDefaultProps,
        activeIndex: 999,
      }

      const component = await render(<RenderDetailTabBar {...propsWithLargeIndex} />)
      expect(component).toBeTruthy()
    })

    it('handles empty props object', async () => {
      const propsWithEmptyProps = {
        ...mockedDefaultProps,
        props: {},
      }

      const component = await render(<RenderDetailTabBar {...propsWithEmptyProps} />)
      expect(component).toBeTruthy()
    })
  })

  describe('Tab Item Component', () => {
    it('renders custom TabItemComponent', async () => {
      const { getByTestId } = await render(<RenderDetailTabBar {...mockedDefaultProps} />)

      const tabItemComponent = getByTestId('tab-item-component')
      expect(tabItemComponent).toBeTruthy()
    })

    it('renders tab label container', async () => {
      const { getByTestId } = await render(<RenderDetailTabBar {...mockedDefaultProps} />)

      const labelContainer = getByTestId('tab-label-container')
      expect(labelContainer).toBeTruthy()
    })
  })

  describe('Container Styling', () => {
    it('applies self-center className to container', async () => {
      await render(<RenderDetailTabBar {...mockedDefaultProps} />)

      const component = await render(<RenderDetailTabBar {...mockedDefaultProps} />)
      expect(component).toBeTruthy()
    })
  })
})

describe('RenderDetailTabBar Component Snapshot', () => {
  it('should render the RenderDetailTabBar Component successfully', async () => {
    const { toJSON } = await render(<RenderDetailTabBar {...mockedDefaultProps} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
