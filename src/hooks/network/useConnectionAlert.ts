import NetInfo from '@react-native-community/netinfo'
import { useCallback, useEffect } from 'react'
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
    if (isConnected === false) {
      Alert.alert(
        getLocale('connectionError'),
        getLocale('connectionErrorDescription'),
        [
          {
            style: 'cancel',
            text: getLocale('cancel'),
          },
          {
            onPress: async () => {
              const connected = await checkConnection()
              if (!connected) {
                setTimeout(() => showConnectionAlert(), 500)
              }
            },
            text: getLocale('retry'),
          },
        ],
        { cancelable: false },
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
