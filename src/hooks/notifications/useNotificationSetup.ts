import { getApp } from '@react-native-firebase/app'
import {
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging'
import { router } from 'expo-router'
import { useCallback, useEffect } from 'react'

const app = getApp()
const messaging = getMessaging(app)

export const useNotificationSetup = () => {
  const handleNotificationNavigation = useCallback((type: string, id: string) => {
    if (type === 'airline') {
      router.replace({
        params: { airlineId: id },
        pathname: '/airline-detail',
      })
    } else if (type === 'airport') {
      router.replace({
        params: { airportId: id },
        pathname: '/airport-detail',
      })
    }
  }, [])

  const setupNotifications = useCallback(() => {
    try {
      setBackgroundMessageHandler(messaging, async remoteMessage => {
        console.log('Message handled in the background!', remoteMessage)
      })

      const unsubscribeMessage = onMessage(messaging, async remoteMessage => {
        console.log('Push Notification received:', remoteMessage)
      })

      const unsubscribeNotificationOpened = onNotificationOpenedApp(messaging, remoteMessage => {
        console.log('App opened from background:', remoteMessage)
        const type = remoteMessage?.data?.type as string
        const id = remoteMessage?.data?.id?.toString()

        if (type && id) {
          handleNotificationNavigation(type, id)
        }
      })

      return () => {
        unsubscribeMessage?.()
        unsubscribeNotificationOpened?.()
      }
    } catch (error) {
      return () => {}
    }
  }, [handleNotificationNavigation])

  useEffect(() => setupNotifications(), [setupNotifications])
}
