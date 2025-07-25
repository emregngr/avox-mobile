import firebase from '@react-native-firebase/app'
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
import { deleteUser } from '@/store/user'
import type { AddPasswordCredentials, ChangePasswordCredentials } from '@/types/feature/password'
import type { ProfileData } from '@/types/feature/user'

const auth = getAuth(firebase.app())

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

  return useMutation<any, Error, ProfileData, { previousProfile: any }>({
    mutationFn: (profileData: ProfileData) => updateUser(profileData),
    onError: (error, newProfileData, context) => {
      queryClient.setQueryData(['userProfile', userId], context?.previousProfile)
      Alert.alert(getLocale('error'), getLocale('profileUpdateFailed'), [
        {
          text: getLocale('ok'),
        },
      ])
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

export const useChangePassword = () =>
  useMutation({
    mutationFn: (credentials: ChangePasswordCredentials) => changeUserPassword(credentials),
    onError: () => {
      Alert.alert(getLocale('error'), getLocale('passwordChangeFailed'), [
        {
          text: getLocale('ok'),
        },
      ])
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

export const useAddPassword = () =>
  useMutation({
    mutationFn: (credentials: AddPasswordCredentials) => addUserPassword(credentials),
    onError: () => {
      Alert.alert(getLocale('error'), getLocale('passwordAddFailed'), [
        {
          text: getLocale('ok'),
        },
      ])
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
    onSuccess: () => {
      deleteUser()
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
    mutationFn: registerDevice,
  })

export const useRegisterDeviceToUser = () =>
  useMutation({
    mutationFn: registerDeviceToUser,
  })
