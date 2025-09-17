import { ReactNode } from 'react'
import { ScrollView } from 'react-native'

module.exports = {
  KeyboardProvider: ({ children }: { children: ReactNode }) => children,
  KeyboardAwareScrollView: ScrollView,
  useKeyboardAnimation: () => ({
    height: { value: 0 },
    progress: { value: 0 },
  }),
  useKeyboardHandler: jest.fn(),
}
