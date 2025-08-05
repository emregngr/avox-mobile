import { getApp } from '@react-native-firebase/app'
import { getAuth } from '@react-native-firebase/auth'
import { router } from 'expo-router'
import React, { useCallback, useMemo } from 'react'

import { Header, SafeLayout } from '@/components/common'
import { AddPassword, ChangePassword } from '@/components/feature'
import { getLocale } from '@/locales/i18next'

const app = getApp()
const authInstance = getAuth(app)

export default function Password() {
  const user = useMemo(() => authInstance.currentUser, [authInstance.currentUser])

  const isPasswordUser = useMemo(
    () => user?.providerData.some(provider => provider?.providerId === 'password'),
    [user],
  )

  const handleBackPress = useCallback(() => {
    router.back()
  }, [])

  const headerTitle = useMemo(
    () => (isPasswordUser ? getLocale('changePassword') : getLocale('addPassword')),
    [isPasswordUser],
  )

  return (
    <SafeLayout>
      <Header backIconOnPress={handleBackPress} title={headerTitle} />
      {isPasswordUser ? <ChangePassword /> : <AddPassword />}
    </SafeLayout>
  )
}
