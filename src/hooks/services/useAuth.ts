import { getApp } from '@react-native-firebase/app'
import type { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { getAuth, getIdToken, onAuthStateChanged } from '@react-native-firebase/auth'
import type { QueryClient } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { Alert } from 'react-native'
import Toast from 'react-native-toast-message'

import { getLocale } from '@/locales/i18next'
import {
  handleLogout,
  sendPasswordResetLink,
  signInWithApple,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from '@/services/authService'
import { login, logout, register, social } from '@/store/auth'
import type { AuthCredentials } from '@/types/feature/auth'

const app = getApp()
const auth = getAuth(app)

const handleAuthSuccess = async <T extends AuthCredentials>(
  userCredential: FirebaseAuthTypes.UserCredential,
  authFunction: (data: T & { token: string }) => Promise<void>,
  authData: T,
  queryClient: QueryClient,
) => {
  try {
    const token = await getIdToken(userCredential.user, true)
    await authFunction({ ...authData, token })
    queryClient.invalidateQueries({ queryKey: ['user'] })
  } catch (error) {}
}

export const useUser = () =>
  useQuery({
    queryFn: () =>
      new Promise(resolve => {
        const unsubscribe = onAuthStateChanged(auth, userState => {
          unsubscribe()
          resolve(userState)
        })
      }),
    queryKey: ['user'],
    staleTime: Infinity,
  })

export const useEmailRegister = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: signUpWithEmail,
    onError: () =>
      Alert.alert(getLocale('error'), getLocale('emailRegisterFailed'), [
        {
          text: getLocale('ok'),
        },
      ]),
    onSuccess: async (userCredential, variables) => {
      await handleAuthSuccess(
        userCredential,
        register,
        {
          email: variables.email,
          firstName: variables.firstName,
          lastName: variables.lastName,
          password: variables.password,
          token: '',
        },
        queryClient,
      )
    },
  })
}

export const useEmailLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: signInWithEmail,
    onError: () =>
      Alert.alert(getLocale('error'), getLocale('emailLoginFailed'), [
        {
          text: getLocale('ok'),
        },
      ]),
    onSuccess: async (userCredential, variables) => {
      await handleAuthSuccess(
        userCredential,
        login,
        {
          email: variables.email,
          password: variables.password,
        },
        queryClient,
      )
    },
  })
}

const useSocialLogin = (
  signInMethod: () => Promise<FirebaseAuthTypes.UserCredential>,
  provider: 'google' | 'apple',
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: signInMethod,
    onError: () =>
      Alert.alert(getLocale('error'), getLocale('socialLoginFailed'), [
        {
          text: getLocale('ok'),
        },
      ]),
    onSuccess: async userCredential => {
      await handleAuthSuccess(userCredential, social, { provider }, queryClient)
    },
  })
}

export const useGoogleLogin = () => useSocialLogin(signInWithGoogle, 'google')

export const useAppleLogin = () => useSocialLogin(signInWithApple, 'apple')

export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: handleLogout,
    onError: () => {
      Alert.alert(getLocale('error'), getLocale('logoutFailed'), [
        {
          text: getLocale('ok'),
        },
      ])
    },
    onSuccess: () => {
      logout()
      queryClient.setQueryData(['user'], null)
      queryClient.removeQueries()
    },
  })
}

export const useForgotPassword = () =>
  useMutation({
    mutationFn: sendPasswordResetLink,
    onError: () =>
      Alert.alert(getLocale('error'), getLocale('passwordResetLinkSentMessageFailed'), [
        {
          text: getLocale('ok'),
        },
      ]),
    onSuccess: () => {
      Toast.show({
        text1: getLocale('successful'),
        text2: getLocale('passwordResetLinkSentMessage'),
        type: 'success',
      })
      router.back()
    },
  })
