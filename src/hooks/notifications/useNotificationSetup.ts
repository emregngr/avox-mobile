import crashlytics from '@react-native-firebase/crashlytics'
import messaging from '@react-native-firebase/messaging'
import { useCallback, useEffect } from 'react'
import { InteractionManager } from 'react-native'
import { Notifications } from 'react-native-notifications'

export const useNotificationSetup = () => {
  const setupNotifications = useCallback(() => {
    const unsubscribeMessage = messaging().onMessage(async remoteMessage => {
      console.log('Push Notification received:', remoteMessage)
    })

    const unsubscribeNotificationOpened = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('App opened from background:', remoteMessage)
    })

    InteractionManager.runAfterInteractions(() => {
      Notifications.getInitialNotification()
        .then(remoteMessage => {
          if (remoteMessage) {
            console.log('App opened from quit state:', remoteMessage)
          }
        })
        .catch(error => crashlytics().recordError(error as Error))
    })

    return () => {
      unsubscribeMessage?.()
      unsubscribeNotificationOpened?.()
    }
  }, [])

  useEffect(() => setupNotifications(), [setupNotifications])
}
