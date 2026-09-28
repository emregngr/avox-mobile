import { Image, ScrollView, Text, View } from 'react-native'

function noop() {}
function identity(val: any) {
  return val
}

const AnimatedView = View
const AnimatedText = Text
const AnimatedScrollView = ScrollView
const AnimatedImage = Image

const baseDefault = {
  View: AnimatedView,
  Text: AnimatedText,
  ScrollView: AnimatedScrollView,
  Image: AnimatedImage,
  call: noop,
  createAnimatedComponent: (component: any) => component,
  interpolate: () => 1,
  interpolateColor: () => 'transparent',
}

const defaultExport = new Proxy(baseDefault, {
  get(target, prop) {
    if (prop in target) return (target as any)[prop]
    return noop
  },
})

const Reanimated: any = new Proxy(
  {
    default: defaultExport,
    ReanimatedLogLevel: { error: 0, warn: 1, trace: 2 },
    configureReanimatedLogger: jest.fn(),
    useSharedValue: jest.fn((val: any) => ({ value: val })),
    useDerivedValue: jest.fn((cb: any) => ({ value: cb() })),
    useAnimatedStyle: jest.fn((cb: any) => cb()),
    useAnimatedRef: jest.fn(() => ({ current: null })),
    useAnimatedScrollHandler: jest.fn(() => () => {}),
    useAnimatedGestureHandler: jest.fn(() => () => {}),
    withSpring: jest.fn(identity),
    withTiming: jest.fn(identity),
    withDelay: jest.fn((_delay: any, val: any) => val),
    withSequence: jest.fn((...vals: any[]) => vals[vals.length - 1]),
    withRepeat: jest.fn(identity),
    runOnJS: jest.fn((fn: any) => fn),
    runOnUI: jest.fn((fn: any) => fn),
    cancelAnimation: jest.fn(),
    Extrapolation: { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' },
    Extrapolate: { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' },
    Easing: {
      linear: identity,
      ease: identity,
      bezier: () => identity,
      out: identity,
      in: identity,
      inOut: identity,
    },
    FadeIn: { duration: () => ({}) },
    FadeOut: { duration: () => ({}) },
    Layout: {},
  },
  {
    get(target, prop) {
      if (prop in target) return (target as any)[prop]
      if (prop === '__esModule') return true
      return noop
    },
  },
)

module.exports = Reanimated
