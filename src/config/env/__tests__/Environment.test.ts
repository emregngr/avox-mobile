beforeEach(() => {
  jest.resetModules()
})

describe('config module', () => {
  describe('config object', () => {
    it('should export config with correct default values', () => {
      const config = require('@/config/env/environment').default

      expect(config).toEqual({
        apiUrl: 'https://api.test.com',
        environment: 'staging',
        googleWebClientId: 'test-google-client-id',
        sentryDsn: 'https://test-sentry-dsn.com',
      })
    })

    it('should have correct TypeScript interface structure', () => {
      const config = require('@/config/env/environment').default

      expect(config).toHaveProperty('apiUrl')
      expect(config).toHaveProperty('environment')
      expect(config).toHaveProperty('googleWebClientId')
      expect(config).toHaveProperty('sentryDsn')

      expect(typeof config.apiUrl).toBe('string')
      expect(typeof config.environment).toBe('string')
      expect(typeof config.googleWebClientId).toBe('string')
      expect(typeof config.sentryDsn).toBe('string')
    })

    it('should have valid environment values', () => {
      const config = require('@/config/env/environment').default

      expect(['staging', 'production']).toContain(config.environment)
    })
  })

  describe('fallback values', () => {
    beforeEach(() => {
      jest.doMock('expo-constants', () => ({
        expoConfig: {
          extra: {
            apiUrl: undefined,
            environment: undefined,
            googleWebClientId: null,
            sentryDsn: '',
          },
        },
      }))
    })

    it('should use fallback values when expo config values are missing', () => {
      const config = require('@/config/env/environment').default

      expect(config.apiUrl).toBe('')
      expect(config.environment).toBe('staging')
      expect(config.googleWebClientId).toBe('')
      expect(config.sentryDsn).toBe('')
    })
  })

  describe('missing expo config', () => {
    beforeEach(() => {
      jest.doMock('expo-constants', () => ({
        expoConfig: null,
      }))
    })

    it('should handle missing expoConfig gracefully', () => {
      const config = require('@/config/env/environment').default

      expect(config.apiUrl).toBe('')
      expect(config.environment).toBe('staging')
      expect(config.googleWebClientId).toBe('')
      expect(config.sentryDsn).toBe('')
    })
  })

  describe('missing extra object', () => {
    beforeEach(() => {
      jest.doMock('expo-constants', () => ({
        expoConfig: {
          extra: undefined,
        },
      }))
    })

    it('should handle missing extra object gracefully', () => {
      const config = require('@/config/env/environment').default

      expect(config.apiUrl).toBe('')
      expect(config.environment).toBe('staging')
      expect(config.googleWebClientId).toBe('')
      expect(config.sentryDsn).toBe('')
    })
  })

  describe('environment helper functions', () => {
    describe('with staging environment', () => {
      beforeEach(() => {
        jest.doMock('expo-constants', () => ({
          expoConfig: {
            extra: {
              apiUrl: 'https://staging-api.com',
              environment: 'staging',
              googleWebClientId: 'staging-client-id',
              sentryDsn: 'https://staging-sentry.com',
            },
          },
        }))
      })

      it('should return true for isStaging()', () => {
        const { isStaging, isProduction } = require('@/config/env/environment')

        expect(isStaging()).toBe(true)
        expect(isProduction()).toBe(false)
      })
    })

    describe('with production environment', () => {
      beforeEach(() => {
        jest.doMock('expo-constants', () => ({
          expoConfig: {
            extra: {
              apiUrl: 'https://production-api.com',
              environment: 'production',
              googleWebClientId: 'production-client-id',
              sentryDsn: 'https://production-sentry.com',
            },
          },
        }))
      })

      it('should return true for isProduction()', () => {
        const { isStaging, isProduction } = require('@/config/env/environment')

        expect(isStaging()).toBe(false)
        expect(isProduction()).toBe(true)
      })
    })

    describe('with fallback environment', () => {
      beforeEach(() => {
        jest.doMock('expo-constants', () => ({
          expoConfig: {
            extra: {
              environment: undefined,
            },
          },
        }))
      })

      it('should default to staging when environment is undefined', () => {
        const { isStaging, isProduction } = require('@/config/env/environment')

        expect(isStaging()).toBe(true)
        expect(isProduction()).toBe(false)
      })
    })
  })

  describe('real-world scenarios', () => {
    it('should handle production configuration', () => {
      jest.resetModules()
      jest.doMock('expo-constants', () => ({
        expoConfig: {
          extra: {
            apiUrl: 'https://api.myapp.com',
            environment: 'production',
            googleWebClientId: '123456789-abcdef.apps.googleusercontent.com',
            sentryDsn: 'https://abcd1234@o123456.ingest.sentry.io/789',
          },
        },
      }))

      const config = require('@/config/env/environment').default
      const { isStaging, isProduction } = require('@/config/env/environment')

      expect(config.apiUrl).toBe('https://api.myapp.com')
      expect(config.environment).toBe('production')
      expect(config.googleWebClientId).toBe('123456789-abcdef.apps.googleusercontent.com')
      expect(config.sentryDsn).toBe('https://abcd1234@o123456.ingest.sentry.io/789')
      expect(isProduction()).toBe(true)
      expect(isStaging()).toBe(false)
    })

    it('should handle staging configuration', () => {
      jest.resetModules()
      jest.doMock('expo-constants', () => ({
        expoConfig: {
          extra: {
            apiUrl: 'https://staging-api.myapp.com',
            environment: 'staging',
            googleWebClientId: 'staging-123456789-abcdef.apps.googleusercontent.com',
            sentryDsn: 'https://staging-abcd1234@o123456.ingest.sentry.io/789',
          },
        },
      }))

      const config = require('@/config/env/environment').default
      const { isStaging, isProduction } = require('@/config/env/environment')

      expect(config.apiUrl).toBe('https://staging-api.myapp.com')
      expect(config.environment).toBe('staging')
      expect(config.googleWebClientId).toBe('staging-123456789-abcdef.apps.googleusercontent.com')
      expect(config.sentryDsn).toBe('https://staging-abcd1234@o123456.ingest.sentry.io/789')
      expect(isStaging()).toBe(true)
      expect(isProduction()).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should handle empty string values', () => {
      jest.resetModules()
      jest.doMock('expo-constants', () => ({
        expoConfig: {
          extra: {
            apiUrl: '',
            environment: '',
            googleWebClientId: '',
            sentryDsn: '',
          },
        },
      }))

      const config = require('@/config/env/environment').default

      expect(config.apiUrl).toBe('')
      expect(config.environment).toBe('')
      expect(config.googleWebClientId).toBe('')
      expect(config.sentryDsn).toBe('')
    })

    it('should handle null values', () => {
      jest.resetModules()
      jest.doMock('expo-constants', () => ({
        expoConfig: {
          extra: {
            apiUrl: null,
            environment: null,
            googleWebClientId: null,
            sentryDsn: null,
          },
        },
      }))

      const config = require('@/config/env/environment').default

      expect(config.apiUrl).toBe('')
      expect(config.environment).toBe('staging')
      expect(config.googleWebClientId).toBe('')
      expect(config.sentryDsn).toBe('')
    })

    it('should handle undefined values', () => {
      jest.resetModules()
      jest.doMock('expo-constants', () => ({
        expoConfig: {
          extra: {
            apiUrl: undefined,
            environment: undefined,
            googleWebClientId: undefined,
            sentryDsn: undefined,
          },
        },
      }))

      const config = require('@/config/env/environment').default

      expect(config.apiUrl).toBe('')
      expect(config.environment).toBe('staging')
      expect(config.googleWebClientId).toBe('')
      expect(config.sentryDsn).toBe('')
    })

    it('should handle completely missing Constants', () => {
      jest.resetModules()
      jest.doMock('expo-constants', () => ({}))

      const config = require('@/config/env/environment').default

      expect(config.apiUrl).toBe('')
      expect(config.environment).toBe('staging')
      expect(config.googleWebClientId).toBe('')
      expect(config.sentryDsn).toBe('')
    })
  })
})

describe('function consistency', () => {
  it('should have consistent results between multiple calls', () => {
    jest.doMock('expo-constants', () => ({
      expoConfig: {
        extra: {
          environment: 'production',
        },
      },
    }))

    const { isStaging, isProduction } = require('@/config/env/environment')

    expect(isProduction()).toBe(true)
    expect(isProduction()).toBe(true)
    expect(isStaging()).toBe(false)
    expect(isStaging()).toBe(false)
  })

  it('should be mutually exclusive', () => {
    jest.doMock('expo-constants', () => ({
      expoConfig: {
        extra: {
          environment: 'production',
        },
      },
    }))

    const { isStaging, isProduction } = require('@/config/env/environment')

    expect(isStaging() && isProduction()).toBe(false)
    expect(isStaging() || isProduction()).toBe(true)
  })
})
