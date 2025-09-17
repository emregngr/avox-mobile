module.exports = {
  expoConfig: {
    name: 'Test App',
    slug: 'test-app',
    version: '1.0.0',
    platforms: ['ios', 'android'],
    extra: {
      apiUrl: 'https://api.test.com',
      environment: 'staging',
      googleWebClientId: 'test-google-client-id',
      sentryDsn: 'https://test-sentry-dsn.com',
    },
  },
  manifest: {
    name: 'Test App',
    version: '1.0.0',
  },
  statusBarHeight: 20,
  deviceYearClass: 2020,
  platform: {
    ios: {
      platform: 'ios',
      model: 'iPhone',
    },
  },
}
