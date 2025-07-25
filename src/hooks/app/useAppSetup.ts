import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-community/netinfo'
import { getAuth } from '@react-native-firebase/auth'
import crashlytics from '@react-native-firebase/crashlytics'
import messaging from '@react-native-firebase/messaging'
import dayjs from 'dayjs'
import {
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
} from 'expo-tracking-transparency'
import { useCallback, useEffect, useState } from 'react'
import { AppState, InteractionManager, PermissionsAndroid, Platform } from 'react-native'

import { ENUMS } from '@/enums'
import { useUserSession } from '@/hooks/app/useUserSession'
import { i18nChangeLocale } from '@/locales/i18next'
import { setIsAuthenticated } from '@/store/auth'

interface AppStateType {
  isConnected: boolean | null
  isReady: boolean
  splashDelayComplete: boolean
}

export const useAppSetup = (selectedLocale: string) => {
  const [appState, setAppState] = useState<AppStateType>({
    isConnected: true,
    isReady: false,
    splashDelayComplete: false,
  })

  const setupApp = useCallback(async () => {
    try {
      dayjs.locale(selectedLocale)
      await i18nChangeLocale(selectedLocale)

      if (Platform.OS === 'ios') {
        const { status } = await getTrackingPermissionsAsync()
        if (status === 'undetermined') {
          const appStateSub = AppState.addEventListener('change', async state => {
            if (state === 'active') {
              await requestTrackingPermissionsAsync()
              appStateSub.remove()
            }
          })
        }
      }

      await messaging().requestPermission()
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
      }

      const [token, hasValidSession] = await Promise.all([
        AsyncStorage.getItem(ENUMS.API_TOKEN),
        useUserSession(),
      ])

      if (token && hasValidSession) {
        setIsAuthenticated(true)
      } else {
        await getAuth().signOut()
        setIsAuthenticated(false)
      }
    } catch (error) {
      setIsAuthenticated(false)
      if (!__DEV__) crashlytics().recordError(error as Error)
    }
  }, [selectedLocale])

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      const unsubscribeNetInfo = NetInfo?.addEventListener(state => {
        setAppState(prev => ({ ...prev, isConnected: state?.isConnected }))
      })

      setupApp()

      return () => unsubscribeNetInfo?.()
    })
  }, [setupApp])

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setAppState(prev => ({ ...prev, splashDelayComplete: true }))
    }, 2000)

    return () => clearTimeout(splashTimer)
  }, [])

  return { appState, setAppState }
}
