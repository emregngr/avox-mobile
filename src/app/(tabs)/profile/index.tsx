import { getApp } from '@react-native-firebase/app'
import { getAuth } from '@react-native-firebase/auth'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { Alert, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Settings from '@/assets/icons/settings.svg'
import { Header, ProfileItem, SafeLayout, ThemedText } from '@/components/common'
import { useLogout } from '@/hooks/services/useAuth'
import { useGetUser } from '@/hooks/services/useUser'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

const app = getApp()
const auth = getAuth(app)

const Icon = require('@/assets/images/icon-ios.png')

const STATIC_STYLES = {
  profilePhoto: {
    borderRadius: 40,
    height: 80,
    width: 80,
  },
}

export default function Profile() {
  const { bottom, top } = useSafeAreaInsets()

  const { selectedLocale } = useLocaleStore()
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const { mutateAsync: handleLogoutMutation } = useLogout()
  const { data: userProfile } = useGetUser()

  const user = useMemo(() => auth.currentUser, [auth.currentUser])
  const isPasswordUser = user?.providerData.some(provider => provider?.providerId === 'password')

  const handleLogout = useCallback(() => {
    Alert.alert(
      getLocale('warning'),
      getLocale('logoutWarning'),
      [
        {
          style: 'cancel',
          text: getLocale('cancel'),
        },
        {
          onPress: () => handleLogoutMutation(),
          style: 'destructive',
          text: getLocale('yes'),
        },
      ],
      {
        userInterfaceStyle: selectedTheme,
      },
    )
  }, [handleLogoutMutation, selectedTheme])

  const settingsIcon = useMemo(
    () => <Settings color={colors?.onPrimary100} height={24} width={24} />,
    [colors?.onPrimary100],
  )

  const handleSettingsPress = useCallback(() => {
    router.navigate('/settings')
  }, [])

  const localeStrings = useMemo(
    () => ({
      accountTransactions: getLocale('accountTransactions'),
      addPassword: getLocale('addPassword'),
      avox: getLocale('avox'),
      changePassword: getLocale('changePassword'),
      chooseLanguage: getLocale('chooseLanguage'),
      chooseTheme: getLocale('chooseTheme'),
      logout: getLocale('logout'),
      profileInformation: getLocale('profileInformation'),
      signInOrRegister: getLocale('signInOrRegister'),
      updateProfile: getLocale('updateProfile'),
    }),
    [selectedLocale],
  )

  return (
    <SafeLayout testID="profile-screen">
      <Header
        backIcon={false}
        containerClassName="absolute left-0 right-0 bg-transparent z-50"
        rightIcon={settingsIcon}
        rightIconOnPress={handleSettingsPress}
        style={{ top }}
      />

      <ScrollView
        contentContainerClassName="px-4"
        contentContainerStyle={{ paddingBottom: bottom + 40, paddingTop: top + 44 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mt-5">
          <View className="w-24 h-24 rounded-full overflow-hidden border-[3px] border-onPrimary-100 justify-center items-center mb-4">
            <Image
              cachePolicy="memory-disk"
              contentFit="contain"
              source={userProfile?.photoURL ? { uri: userProfile?.photoURL } : Icon}
              style={STATIC_STYLES.profilePhoto}
              transition={0}
            />
          </View>

          {userProfile?.displayName ? (
            <ThemedText color="text-100" type="body2">
              {userProfile?.displayName}
            </ThemedText>
          ) : (
            <ThemedText color="text-100" type="body2">
              {localeStrings.avox}
            </ThemedText>
          )}
        </View>

        <ThemedText className="ml-4 mt-8 mb-2" color="text-70" type="body2">
          {localeStrings.profileInformation}
        </ThemedText>

        <View className="rounded-xl overflow-hidden bg-background-secondary">
          {user ? (
            <>
              <ProfileItem
                label={localeStrings.updateProfile}
                leftIcon="account-circle-outline"
                onPress={() => router.navigate('/update-profile')}
                testID="update-profile-button"
              />
              <ProfileItem
                label={isPasswordUser ? localeStrings.changePassword : localeStrings.addPassword}
                leftIcon="lock-reset"
                onPress={() => router.navigate('/password')}
                testID="password-button"
                isLastItem
              />
            </>
          ) : (
            <ProfileItem
              label={localeStrings.signInOrRegister}
              leftIcon="account-circle-outline"
              onPress={() => router.replace({ params: { tab: 'profile' }, pathname: '/auth' })}
              testID="auth-button"
              isLastItem
            />
          )}
        </View>

        <ThemedText className="ml-4 mt-8 mb-2" color="text-70" type="body2">
          {localeStrings.accountTransactions}
        </ThemedText>

        <View className="rounded-xl overflow-hidden bg-background-secondary">
          <ProfileItem
            label={localeStrings.chooseTheme}
            leftIcon="theme-light-dark"
            onPress={() => router.navigate('/choose-theme')}
            testID="choose-theme-button"
          />
          <ProfileItem
            isLastItem={user ? false : true}
            label={localeStrings.chooseLanguage}
            leftIcon="translate"
            onPress={() => router.navigate('/choose-language')}
            testID="choose-language-button"
          />
          {user ? (
            <ProfileItem
              label={localeStrings.logout}
              leftIcon="logout"
              onPress={handleLogout}
              rightIcon={false}
              testID="logout-button"
              danger
              isLastItem
            />
          ) : null}
        </View>
      </ScrollView>
    </SafeLayout>
  )
}
