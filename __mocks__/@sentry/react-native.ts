import type { ComponentType } from 'react'

const mockedSentry = {
  init: jest.fn(),
  wrap: <T extends ComponentType<any>>(Component: T): T => Component,
  withScope: jest.fn((callback: (scope: any) => void) =>
    callback({
      setTag: jest.fn(),
      setLevel: jest.fn(),
      setUser: jest.fn(),
      setContext: jest.fn(),
    }),
  ),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  addBreadcrumb: jest.fn(),
  configureScope: jest.fn(),
  setUser: jest.fn(),
  setTag: jest.fn(),
  setContext: jest.fn(),
  setRelease: jest.fn(),
  setDist: jest.fn(),
  setEnvironment: jest.fn(),
  close: jest.fn(() => Promise.resolve(true)),
  flush: jest.fn(() => Promise.resolve(true)),
}

module.exports = mockedSentry

export type mockedSentryType = typeof mockedSentry
