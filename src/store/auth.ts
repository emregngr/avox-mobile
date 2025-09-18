import { MMKV } from 'react-native-mmkv'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { ENUMS } from '@/enums'
import type { LoginType, RegisterType, SocialType } from '@/types/feature/auth'

const storage = new MMKV()

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
    login: params => {
      set({ loading: true })
      storage.set(ENUMS.API_TOKEN, params.token ?? '')
      set({ isAuthenticated: true, loading: false })
    },
    logout: () => {
      set({ loading: true })
      storage.delete(ENUMS.API_TOKEN)
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
