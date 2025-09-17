import { createElement, Fragment, ReactNode } from 'react'
import { View } from 'react-native'

const mockedRouterFunctions = {
  push: jest.fn(),
  navigate: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  canGoBack: jest.fn(() => true),
  setParams: jest.fn(),
}

let mockedPathname = '/home'

const setMockPathname = (pathname: string) => {
  mockedPathname = pathname
  const usePathnameMock = module.exports.usePathname
  if (usePathnameMock && usePathnameMock.mockReturnValue) {
    usePathnameMock.mockReturnValue(mockedPathname)
  }
}

const clearAllMocks = () => {
  Object.values(mockedRouterFunctions).forEach(fn => {
    if (typeof fn === 'function' && fn.mockClear) {
      fn.mockClear()
    }
  })
}

const MockScreen = ({ children }: { children: ReactNode }) =>
  createElement(Fragment, null, children)

const MockedStack = ({ children }: { children: ReactNode }) =>
  createElement(Fragment, null, children)

const MockedTabs = ({
  children,
  screenOptions,
  ...props
}: {
  children: ReactNode
  screenOptions?: any
  [key: string]: any
}) => (
  <View testID="tabs" data-screen-options={JSON.stringify(screenOptions)} {...props}>
    {children}
  </View>
)

const MockTabScreen = ({ name, ...props }: { name: string; [key: string]: any }) => (
  <View testID={`tab-screen-${name}`} data-name={name} {...props} />
)

module.exports = {
  router: mockedRouterFunctions,
  useRouter: jest.fn(() => mockedRouterFunctions),
  useFocusEffect: jest.fn(),
  useSegments: jest.fn(() => []),
  useSearchParams: jest.fn(() => ({})),
  useLocalSearchParams: jest.fn(() => ({})),
  useGlobalSearchParams: jest.fn(() => ({})),
  usePathname: jest.fn(() => mockedPathname),
  useNavigation: jest.fn(() => ({})),
  Slot: ({ children }: { children: ReactNode }) => <>{children}</>,
  Stack: Object.assign(MockedStack, { Screen: MockScreen }),
  Tabs: Object.assign(MockedTabs, { Screen: MockTabScreen }),
  Link: ({ children, ...props }: { children: ReactNode }) =>
    createElement(Fragment, null, children),
  Redirect: () => null,
  setMockPathname: setMockPathname,
  clearAllMocks: clearAllMocks,
  mockedFunctions: mockedRouterFunctions,
  get mockPathname() {
    return mockedPathname
  },
}
