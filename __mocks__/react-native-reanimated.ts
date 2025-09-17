const Reanimated = require('react-native-reanimated/mock')

Reanimated.ReanimatedLogLevel = {
  error: 0,
  warn: 1,
  trace: 2,
}

Reanimated.configureReanimatedLogger = jest.fn()

Reanimated.default.call = () => {}
Reanimated.default.createAnimatedComponent = (component: any) => component
Reanimated.default.interpolate = () => 1
Reanimated.useSharedValue = (val: any) => ({ value: val })
Reanimated.useAnimatedStyle = (cb: any) => ({})
Reanimated.useAnimatedScrollHandler = () => () => {}
Reanimated.withSpring = (val: any) => val
Reanimated.withTiming = (val: any) => val
Reanimated.Extrapolation = { CLAMP: 'clamp' }

module.exports = Reanimated
