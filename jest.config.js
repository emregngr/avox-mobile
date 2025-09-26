module.exports = {
  preset: 'jest-expo',

  setupFilesAfterEnv: ['<rootDir>/jest/index.ts', '@testing-library/jest-native/extend-expect'],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.ts',

    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.ts',

    '\\.svg$': '<rootDir>/__mocks__/svgMock.tsx',

    '\\.(lottie)$': '<rootDir>/jest/__mocks__/lottieMock.ts',

    '^expo/src/winter/(.*)$': '<rootDir>/__mocks__/expoWinterMock.ts',
  },

  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|expo/.*|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@tanstack|axios|@react-native-firebase/.*|react-native-css-interop|nativewind)',
  ],

  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.(test|spec).{js,jsx,ts,tsx}',
  ],

  testPathIgnorePatterns: ['/node_modules/', '/e2e/', '/android/', '/ios/'],

  moduleDirectories: ['node_modules', '<rootDir>'],

  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  verbose: true,

  maxWorkers: '50%',

  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
    '!src/**/*.stories.*',
    '!src/**/index.{js,jsx,ts,tsx}',
  ],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },

  testTimeout: 120000,
}
