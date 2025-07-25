import firebase from '@react-native-firebase/app'
import { getAuth } from '@react-native-firebase/auth'
import { Image } from 'expo-image'
import { router, useFocusEffect } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { Alert, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import Settings from '@/assets/icons/settings.svg'
import { Header, ProfileMenuItem, SafeLayout, ThemedText } from '@/components/common'
import { useLogout } from '@/hooks/services/useAuth'
import { useGetUser } from '@/hooks/services/useUser'
import { getLocale, i18nChangeLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

const authInstance = getAuth(firebase.app())

export default function Profile() {
  const { selectedLocale } = useLocaleStore()
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const { mutateAsync: handleLogoutMutation } = useLogout()
  const { data: userProfile } = useGetUser()

  const user = authInstance?.currentUser
  const isPasswordUser = user?.providerData.some(provider => provider?.providerId === 'password')

  useFocusEffect(
    useCallback(() => {
      const changeLanguage = async () => {
        await i18nChangeLocale(selectedLocale)
      }
      changeLanguage()

      return () => {}
    }, [selectedLocale]),
  )

  const handleLogout = useCallback(() => {
    Alert.alert(getLocale('warning'), getLocale('logoutWarning'), [
      {
        style: 'cancel',
        text: getLocale('cancel'),
      },
      {
        onPress: () => {
          handleLogoutMutation()
        },
        style: 'destructive',
        text: getLocale('yes'),
      },
    ])
  }, [handleLogoutMutation])

  const settingsIcon = useMemo(
    () => <Settings color={colors?.onPrimary100} height={24} width={24} />,
    [colors?.onPrimary100],
  )

  const handleSettingsPress = useCallback(() => {
    router.navigate('/settings')
  }, [])

  return (
    <SafeLayout>
      <Header leftIcon={false} rightIcon={settingsIcon} rightIconOnPress={handleSettingsPress} />

      <ScrollView
        className="flex-1 px-4"
        contentContainerClassName="pb-10"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center pt-5">
          <View className="w-24 h-24 rounded-full overflow-hidden border-[3px] border-onPrimary-100 justify-center items-center mb-4">
            <Image
              source={
                userProfile?.photoURL
                  ? { uri: userProfile?.photoURL }
                  : require('@/assets/images/icon-ios.png')
              }
              cachePolicy="memory-disk"
              contentFit="contain"
              style={{ borderRadius: 40, height: 80, width: 80 }}
              transition={0}
            />
          </View>

          {userProfile?.displayName ? (
            <ThemedText color="text-100" type="body2">
              {userProfile?.displayName}
            </ThemedText>
          ) : (
            <ThemedText color="text-100" type="body2">
              {getLocale('avox')}
            </ThemedText>
          )}
        </View>

        <ThemedText className="ml-4 mt-8 mb-2" color="text-70" type="body2">
          {getLocale('profileInformation')}
        </ThemedText>

        <View className="rounded-xl overflow-hidden bg-background-secondary">
          {user ? (
            <>
              <ProfileMenuItem
                onPress={() => router.navigate('/update-profile')}
                title={getLocale('updateProfile')}
              />
              <ProfileMenuItem
                onPress={() => router.navigate('/change-password')}
                title={isPasswordUser ? getLocale('changePassword') : getLocale('addPassword')}
                isLastItem
              />
            </>
          ) : (
            <ProfileMenuItem
              onPress={() => router.replace({ params: { tab: 'profile' }, pathname: '/auth' })}
              title={getLocale('signInOrRegister')}
              isLastItem
            />
          )}
        </View>

        <ThemedText className="ml-4 mt-8 mb-2" color="text-70" type="body2">
          {getLocale('accountTransactions')}
        </ThemedText>

        <View className="rounded-xl overflow-hidden bg-background-secondary">
          <ProfileMenuItem
            onPress={() => router.navigate('/choose-theme')}
            title={getLocale('chooseTheme')}
          />
          <ProfileMenuItem
            isLastItem={user ? false : true}
            onPress={() => router.navigate('/choose-language')}
            title={getLocale('chooseLanguage')}
          />
          {user ? (
            <ProfileMenuItem
              onPress={handleLogout}
              rightIcon={false}
              title={getLocale('logout')}
              isLastItem
            />
          ) : null}
        </View>
      </ScrollView>
    </SafeLayout>
  )
}
