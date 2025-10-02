const { getDefaultConfig } = require('@expo/metro-config')
const withStorybook = require('@storybook/react-native/metro/withStorybook')
const { withRozenite } = require('@rozenite/metro')
const { getSentryExpoConfig } = require('@sentry/react-native/metro')
const { withNativeWind } = require('nativewind/metro')

const projectRoot = __dirname

const defaultConfig = getDefaultConfig(projectRoot)

const sentryConfig = getSentryExpoConfig(projectRoot)

const svgConfig = {
  transformer: {
    ...sentryConfig.transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    ...sentryConfig.resolver,
    assetExts: sentryConfig.resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sentryConfig.resolver.sourceExts, 'svg'],
  },
}

const mergedConfig = {
  ...defaultConfig,
  ...sentryConfig,
  transformer: {
    ...defaultConfig.transformer,
    ...sentryConfig.transformer,
    ...svgConfig.transformer,
  },
  resolver: {
    ...defaultConfig.resolver,
    ...sentryConfig.resolver,
    ...svgConfig.resolver,
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === 'tty' || moduleName === 'os') {
        return {
          type: 'empty',
        }
      }

      return context.resolveRequest(context, moduleName, platform)
    },
  },
}

const configWithNativeWind = withNativeWind(mergedConfig, {
  input: './src/global.css',
})

const configWithStorybook = withStorybook(configWithNativeWind)

module.exports = withRozenite(configWithStorybook, {
  include: [
    '@rozenite/expo-atlas-plugin',
    '@rozenite/mmkv-plugin',
    '@rozenite/network-activity-plugin',
    '@rozenite/performance-monitor-plugin',
    '@rozenite/tanstack-query-plugin',
  ],
})
