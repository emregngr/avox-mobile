export const getCrashlytics = jest.fn(() => ({
  log: jest.fn(),
  recordError: jest.fn(),
  setCustomKey: jest.fn(),
  setUserId: jest.fn(),
  setAttribute: jest.fn(),
  setAttributes: jest.fn(),
  crash: jest.fn(),
}))

export const log = jest.fn()

export const recordError = jest.fn()
