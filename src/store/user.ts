import { MMKV } from 'react-native-mmkv'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { ENUMS } from '@/enums'

const storage = new MMKV()

export type UserStateType = {
  isOnboardingSeen: boolean
  loading: boolean
}

export type UserActions = {
  deleteUser: () => Promise<void>
  setIsOnboardingSeen: (status: boolean) => Promise<void>
}

const useUserStore = create<UserStateType & UserActions>()(
  devtools(set => ({
    deleteUser: () => {
      set({ loading: true })
      storage.delete(ENUMS.API_TOKEN)
      set({ loading: false })
    },
    isOnboardingSeen: false,
    loading: false,
    setIsOnboardingSeen: async status => {
      storage.set(ENUMS.IS_ONBOARDING_SEEN, status ? 'true' : 'false')
    },
  })),
)

export const { deleteUser, setIsOnboardingSeen } = useUserStore.getState()

export default useUserStore
