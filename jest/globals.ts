// jest/index.ts
import { TextDecoder, TextEncoder } from 'util'

global.__ExpoImportMetaRegistry = {}
global.TextDecoder = TextDecoder as any
global.TextEncoder = TextEncoder as any

global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
}

global._ReactNativeCSSInterop = {
  StyleSheet: {
    create: jest.fn(styles => styles),
    compose: jest.fn(),
  },
  remapProps: jest.fn(),
}

if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj: any) => {
    if (obj === null || typeof obj !== 'object') return obj
    try {
      return JSON.parse(JSON.stringify(obj))
    } catch {
      return obj
    }
  }
}

jest.mock('expo/src/winter/runtime.native.ts', () => ({}))

jest.mock('expo/src/winter/installGlobal.ts', () => ({
  installGlobal: jest.fn(),
  getValue: jest.fn(),
}))
