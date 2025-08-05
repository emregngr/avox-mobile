import { getApp } from '@react-native-firebase/app'
import { getAuth } from '@react-native-firebase/auth'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { Alert } from 'react-native'
import Toast from 'react-native-toast-message'

import { getLocale } from '@/locales/i18next'
import {
  addUserPassword,
  changeUserPassword,
  deleteUserAccount,
  getUser,
  registerDevice,
  registerDeviceToUser,
  updateUser,
} from '@/services/userService'
import { setIsAuthenticated } from '@/store/auth'
import useThemeStore from '@/store/theme'
import { deleteUser } from '@/store/user'
import type { AddPasswordCredentials, ChangePasswordCredentials } from '@/types/feature/password'
import type { ProfileData } from '@/types/feature/user'

const app = getApp()
const auth = getAuth(app)

export const useGetUser = () => {
  const userId = auth?.currentUser?.uid
  return useQuery({
    enabled: !!userId,
    queryFn: getUser,
    queryKey: ['userProfile', userId],
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  const userId = auth?.currentUser?.uid
  const { selectedTheme } = useThemeStore()

  return useMutation<any, Error, ProfileData, { previousProfile: any }>({
    mutationFn: async (profileData: ProfileData) => await updateUser(profileData),
    onError: (error, newProfileData, context) => {
      queryClient.setQueryData(['userProfile', userId], context?.previousProfile)
      Alert.alert(
        getLocale('error'),
        getLocale('profileUpdateFailed'),
        [
          {
            text: getLocale('ok'),
          },
        ],
        {
          userInterfaceStyle: selectedTheme,
        },
      )
    },
    onMutate: async newProfileData => {
      await queryClient.cancelQueries({ queryKey: ['userProfile', userId] })
      const previousProfile = queryClient.getQueryData(['userProfile', userId])
      queryClient.setQueryData(['userProfile', userId], (oldData: any) => ({
        ...oldData,
        ...newProfileData,
        displayName: `${newProfileData?.firstName} ${newProfileData?.lastName}`,
      }))
      return { previousProfile }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] })
    },
    onSuccess: () => {
      Toast.show({
        text1: getLocale('successful'),
        text2: getLocale('profileUpdatedSuccessfully'),
        type: 'success',
      })
      router.back()
    },
  })
}

export const useChangePassword = () => {
  const { selectedTheme } = useThemeStore()

  return useMutation({
    mutationFn: async (credentials: ChangePasswordCredentials) =>
      await changeUserPassword(credentials),
    onError: () => {
      Alert.alert(
        getLocale('error'),
        getLocale('passwordChangeFailed'),
        [
          {
            text: getLocale('ok'),
          },
        ],
        {
          userInterfaceStyle: selectedTheme,
        },
      )
    },
    onSuccess: () => {
      Toast.show({
        text1: getLocale('successful'),
        text2: getLocale('passwordChangedSuccessfully'),
        type: 'success',
      })
      router.back()
    },
  })
}

export const useAddPassword = () => {
  const { selectedTheme } = useThemeStore()

  return useMutation({
    mutationFn: async (credentials: AddPasswordCredentials) => await addUserPassword(credentials),
    onError: () => {
      Alert.alert(
        getLocale('error'),
        getLocale('passwordAddFailed'),
        [
          {
            text: getLocale('ok'),
          },
        ],
        {
          userInterfaceStyle: selectedTheme,
        },
      )
    },
    onSuccess: () => {
      Toast.show({
        text1: getLocale('successful'),
        text2: getLocale('passwordAddedSuccessfully'),
        type: 'success',
      })
      router.back()
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUserAccount,
    onError: () => {
      Alert.alert(getLocale('error'), getLocale('accountDeleteFailed'), [
        {
          text: getLocale('ok'),
        },
      ])
    },
    onSuccess: async () => {
      await deleteUser()
      setIsAuthenticated(false)
      queryClient.clear()
      Toast.show({
        text1: getLocale('successful'),
        text2: getLocale('accountDeletedSuccessfully'),
        type: 'success',
      })
    },
  })
}

export const useRegisterDevice = () =>
  useMutation({
    mutationFn: async () => await registerDevice(),
  })

export const useRegisterDeviceToUser = () =>
  useMutation({
    mutationFn: async () => await registerDeviceToUser(),
  })
