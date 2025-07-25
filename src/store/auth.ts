import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { ENUMS } from '@/enums'
import type { LoginType, RegisterType, SocialType } from '@/types/feature/auth'

export type AuthStateType = {
  isAuthenticated: boolean
  loading: boolean
}

export type AuthActions = {
  login: ({ email, password, token }: LoginType) => Promise<void>
  logout: () => Promise<void>
  register: ({ email, firstName, lastName, password, token }: RegisterType) => Promise<void>
  setIsAuthenticated: (value: boolean) => void
  social: ({ provider, token }: SocialType) => Promise<void>
}

const useAuthStore = create<AuthStateType & AuthActions>()(
  devtools(set => ({
    isAuthenticated: false,
    loading: false,
    login: async params => {
      set({ loading: false })
      set({ isAuthenticated: true, loading: false })
      await AsyncStorage.setItem(ENUMS.API_TOKEN, params?.token)
    },
    logout: async () => {
      set({ loading: true })
      set({ isAuthenticated: false, loading: false })
      await AsyncStorage.removeItem(ENUMS.API_TOKEN)
    },
    register: async params => {
      set({ loading: true })
      set({ isAuthenticated: true, loading: false })
      await AsyncStorage.setItem(ENUMS.API_TOKEN, params?.token)
    },
    setIsAuthenticated: value => {
      set({ isAuthenticated: value })
    },
    social: async params => {
      set({ loading: true })
      set({ isAuthenticated: true, loading: false })
      await AsyncStorage.setItem(ENUMS.API_TOKEN, params?.token)
    },
  })),
)

export const { login, logout, register, setIsAuthenticated, social } = useAuthStore.getState()

export default useAuthStore
