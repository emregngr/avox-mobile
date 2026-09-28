import { createMMKV } from 'react-native-mmkv'
import { view } from './storybook.requires'

const storage = createMMKV()

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: (key: string) => Promise.resolve(storage.getString(key) ?? null),
    setItem: (key: string, value: string) => {
      storage.set(key, value)
      return Promise.resolve()
    },
  },
})

export default StorybookUIRoot
