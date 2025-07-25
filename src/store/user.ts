import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { ENUMS } from '@/enums'

export type UserStateType = {
  isOnBoardingSeen: boolean
  loading: boolean
}

export type UserActions = {
  deleteUser: () => Promise<void>
  setIsOnBoardingSeen: (status: boolean) => Promise<void>
}

const useUserStore = create<UserStateType & UserActions>()(
  devtools(set => ({
    deleteUser: async () => {
      set({ loading: true })
      await AsyncStorage.removeItem(ENUMS.API_TOKEN)
      set({ loading: false })
    },
    isOnBoardingSeen: false,
    loading: false,
    setIsOnBoardingSeen: async status => {
      await AsyncStorage.setItem(ENUMS.IS_ONBOARDING_SEEN, status ? 'true' : 'false')
    },
  })),
)

export const { deleteUser, setIsOnBoardingSeen } = useUserStore.getState()

export default useUserStore
