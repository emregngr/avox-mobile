import NetInfo from '@react-native-community/netinfo'
import { useCallback, useEffect, useRef } from 'react'
import { Alert } from 'react-native'

import { getLocale } from '@/locales/i18next'
import useThemeStore from '@/store/theme'
import { Logger } from '@/utils/common/logger'

interface UseConnectionAlertProps {
  isConnected: boolean | null
  onConnectionChange?: (connected: boolean) => void
}

const DELAY = 500

export const useConnectionAlert = ({
  isConnected,
  onConnectionChange,
}: UseConnectionAlertProps) => {
  const { selectedTheme } = useThemeStore()

  const isAlertShowing = useRef<boolean>(false)

  const checkConnection = useCallback(async () => {
    try {
      const state = await NetInfo.fetch()
      const connected = state.isConnected && state.isInternetReachable

      if (onConnectionChange) {
        onConnectionChange(connected ?? false)
      }

      return connected ?? false
    } catch (error) {
      Logger.breadcrumb('Failed to check connection', 'error', error as Error)
      return false
    }
  }, [onConnectionChange])

  const showConnectionAlert = useCallback(() => {
    if (isConnected === false && !isAlertShowing.current) {
      isAlertShowing.current = true

      Alert.alert(
        getLocale('connectionError'),
        getLocale('connectionErrorDescription'),
        [
          {
            onPress: () => {
              isAlertShowing.current = false
            },
            style: 'cancel',
            text: getLocale('cancel'),
          },
          {
            onPress: async () => {
              const connected = await checkConnection()
              if (!connected) {
                setTimeout(() => {
                  isAlertShowing.current = false
                  showConnectionAlert()
                }, DELAY)
              } else {
                isAlertShowing.current = false
              }
            },
            text: getLocale('retry'),
          },
        ],
        {
          cancelable: false,
          onDismiss: () => {
            isAlertShowing.current = false
          },
          userInterfaceStyle: selectedTheme,
        },
      )
    }
  }, [isConnected, checkConnection])

  useEffect(() => {
    showConnectionAlert()
  }, [showConnectionAlert])

  return {
    checkConnection,
    showConnectionAlert,
  }
}
