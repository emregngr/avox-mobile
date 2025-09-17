import { ReactNode } from 'react'

export const mockedShowActionSheet = jest.fn((_, callback) => {
  if (callback) {
  }
})

export const useActionSheet = () => ({
  showActionSheetWithOptions: mockedShowActionSheet,
  dismiss: jest.fn(),
  getVisible: jest.fn(() => false),
  getButtonIndex: jest.fn(() => 0),
  getSelectedIndex: jest.fn(() => 0),
  getSelectedOption: jest.fn(() => 'Cancel'),
})

export const ActionSheetProvider = ({ children }: { children: ReactNode }) => <>{children}</>
