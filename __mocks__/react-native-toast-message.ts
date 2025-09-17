import type { FC } from 'react'

type ToastMockType = FC & {
  show: jest.Mock
  hide: jest.Mock
  success: jest.Mock
  error: jest.Mock
  info: jest.Mock
  warning: jest.Mock
}

const mockedToast = jest.fn(() => null) as unknown as ToastMockType

mockedToast.show = jest.fn()
mockedToast.hide = jest.fn()
mockedToast.success = jest.fn()
mockedToast.error = jest.fn()
mockedToast.info = jest.fn()
mockedToast.warning = jest.fn()

export default mockedToast
