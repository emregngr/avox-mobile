import { createMMKV } from 'react-native-mmkv'
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

import { ENUMS } from '@/enums'

const storage = createMMKV()

const mmkvStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name)
    return value ?? null
  },
  removeItem: (name: string) => storage.remove(name),
  setItem: (name: string, value: string) => storage.set(name, value),
}

export type UserStateType = {
  isOnboardingSeen: boolean
  loading: boolean
}

export type UserActions = {
  deleteUser: () => void
  setIsOnboardingSeen: (status: boolean) => void
}

const useUserStore = create<UserStateType & UserActions>()(
  devtools(
    persist(
      set => ({
        deleteUser: () => {
          set({ loading: true })
          storage.remove(ENUMS.API_TOKEN)
          set({ loading: false })
        },
        isOnboardingSeen: false,
        loading: false,
        setIsOnboardingSeen: status => {
          set({ isOnboardingSeen: status })
        },
      }),
      {
        name: 'user',
        storage: createJSONStorage(() => mmkvStorage),
      },
    ),
  ),
)

export const { deleteUser, setIsOnboardingSeen } = useUserStore.getState()

export default useUserStore
