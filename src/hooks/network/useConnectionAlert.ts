import NetInfo from '@react-native-community/netinfo'
import { useCallback, useEffect, useRef } from 'react'
import { Alert } from 'react-native'

import { getLocale } from '@/locales/i18next'

interface UseConnectionAlertProps {
  isConnected: boolean | null
  onConnectionChange?: (connected: boolean) => void
}

export const useConnectionAlert = ({
  isConnected,
  onConnectionChange,
}: UseConnectionAlertProps) => {
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
                }, 500)
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
