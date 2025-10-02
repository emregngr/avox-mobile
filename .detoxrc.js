module.exports = {
  skipLegacyWorkersInjection: true,
  testRunner: {
    args: {
      config: 'e2e/detox/config.json',
      maxWorkers: 1,
      testTimeout: 300000,
    },
  },
  apps: {
    'avox.ios': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Staging-iphonesimulator/Avox.app',
      build:
        'xcodebuild -workspace ios/Avox.xcworkspace -scheme "Avox Staging" -configuration Staging -sdk iphonesimulator -derivedDataPath ios/build',
    },
    'avox.android': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/staging/debug/app-staging-debug.apk',
      build:
        'cd android && ./gradlew assembleStagingDebug assembleStagingDebugAndroidTest -DtestBuildType=debug && cd ..',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 17 Pro Max',
      },
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_9_Pro_XL',
      },
    },
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'avox.ios',
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'avox.android',
    },
  },
}
