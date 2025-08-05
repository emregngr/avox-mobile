import { getApp } from '@react-native-firebase/app'
import { getAuth } from '@react-native-firebase/auth'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { Alert, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import Settings from '@/assets/icons/settings.svg'
import { Header, ProfileMenuItem, SafeLayout, ThemedText } from '@/components/common'
import { useLogout } from '@/hooks/services/useAuth'
import { useGetUser } from '@/hooks/services/useUser'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

const app = getApp()
const authInstance = getAuth(app)

const Icon = require('@/assets/images/icon-ios.png')

const STATIC_STYLES = {
  profilePhoto: {
    borderRadius: 40,
    height: 80,
    width: 80,
  },
}

export default function Profile() {
  const { selectedLocale } = useLocaleStore()
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const { mutateAsync: handleLogoutMutation } = useLogout()
  const { data: userProfile } = useGetUser()

  const user = useMemo(() => authInstance.currentUser, [authInstance.currentUser])
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
    <SafeLayout>
      <Header backIcon={false} rightIcon={settingsIcon} rightIconOnPress={handleSettingsPress} />

      <ScrollView contentContainerClassName="pb-10 px-4" showsVerticalScrollIndicator={false}>
        <View className="items-center pt-5">
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
              <ProfileMenuItem
                onPress={() => router.navigate('/update-profile')}
                title={localeStrings.updateProfile}
              />
              <ProfileMenuItem
                onPress={() => router.navigate('/change-password')}
                title={isPasswordUser ? localeStrings.changePassword : localeStrings.addPassword}
                isLastItem
              />
            </>
          ) : (
            <ProfileMenuItem
              onPress={() => router.replace({ params: { tab: 'profile' }, pathname: '/auth' })}
              title={localeStrings.signInOrRegister}
              isLastItem
            />
          )}
        </View>

        <ThemedText className="ml-4 mt-8 mb-2" color="text-70" type="body2">
          {localeStrings.accountTransactions}
        </ThemedText>

        <View className="rounded-xl overflow-hidden bg-background-secondary">
          <ProfileMenuItem
            onPress={() => router.navigate('/choose-theme')}
            title={localeStrings.chooseTheme}
          />
          <ProfileMenuItem
            isLastItem={user ? false : true}
            onPress={() => router.navigate('/choose-language')}
            title={localeStrings.chooseLanguage}
          />
          {user ? (
            <ProfileMenuItem
              onPress={handleLogout}
              rightIcon={false}
              title={localeStrings.logout}
              isLastItem
            />
          ) : null}
        </View>
      </ScrollView>
    </SafeLayout>
  )
}
