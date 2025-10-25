import { createMMKV } from 'react-native-mmkv'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { ENUMS } from '@/enums'
import type { LoginType, RegisterType, SocialType } from '@/types/feature/auth'

const storage = createMMKV()

export type AuthStateType = {
  isAuthenticated: boolean
  loading: boolean
}

export type AuthActions = {
  login: ({ email, password, token }: LoginType) => void
  logout: () => void
  register: ({ email, firstName, lastName, password, token }: RegisterType) => void
  setIsAuthenticated: (value: boolean) => void
  social: ({ provider, token }: SocialType) => void
}

const useAuthStore = create<AuthStateType & AuthActions>()(
  devtools(set => ({
    isAuthenticated: false,
    loading: false,
    login: params => {
      set({ loading: true })
      storage.set(ENUMS.API_TOKEN, params.token ?? '')
      set({ isAuthenticated: true, loading: false })
    },
    logout: () => {
      set({ loading: true })
      storage.remove(ENUMS.API_TOKEN)
      set({ isAuthenticated: false, loading: false })
    },
    register: params => {
      set({ loading: true })
      storage.set(ENUMS.API_TOKEN, params.token ?? '')
      set({ isAuthenticated: true, loading: false })
    },
    setIsAuthenticated: value => {
      set({ isAuthenticated: value })
    },
    social: params => {
      set({ loading: true })
      storage.set(ENUMS.API_TOKEN, params.token ?? '')
      set({ isAuthenticated: true, loading: false })
    },
  })),
)

export const { login, logout, register, setIsAuthenticated, social } = useAuthStore.getState()

export default useAuthStore
