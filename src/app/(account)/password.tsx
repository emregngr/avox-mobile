import { getApp } from '@react-native-firebase/app'
import { getAuth } from '@react-native-firebase/auth'
import { router } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Header, SafeLayout } from '@/components/common'
import { AddPassword, ChangePassword } from '@/components/feature'
import { getLocale } from '@/locales/i18next'

const app = getApp()
const auth = getAuth(app)

export default function Password() {
  const { top } = useSafeAreaInsets()

  const user = useMemo(() => auth.currentUser, [auth.currentUser])

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
    <SafeLayout testID="password-screen">
      <Header
        backIconOnPress={handleBackPress}
        containerClassName="absolute left-0 right-0 bg-transparent z-50"
        style={{ top }}
        title={headerTitle}
      />
      {isPasswordUser ? <ChangePassword /> : <AddPassword />}
    </SafeLayout>
  )
}
