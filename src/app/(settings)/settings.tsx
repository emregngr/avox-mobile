import { getApp } from '@react-native-firebase/app'
import { getAuth } from '@react-native-firebase/auth'
import { router } from 'expo-router'
import * as StoreReview from 'expo-store-review'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, AppState, Linking, Switch, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { checkNotifications, openSettings } from 'react-native-permissions'

import Close from '@/assets/icons/close'
import Instagram from '@/assets/icons/instagram.svg'
import Tiktok from '@/assets/icons/tiktok.svg'
import { Header, ProfileMenuItem, SafeLayout, ThemedText } from '@/components/common'
import { useDeleteUser } from '@/hooks/services/useUser'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import { Logger } from '@/utils/common/logger'
import { getStringValue } from '@/utils/common/remoteConfig'

const app = getApp()
const authInstance = getAuth(app)

export default function Settings() {
  const { selectedLocale } = useLocaleStore()
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const user = useMemo(() => authInstance.currentUser, [authInstance.currentUser])

  const { mutateAsync: deleteUserAccount } = useDeleteUser()

  const [notificationStatus, setNotificationStatus] = useState<boolean>(false)
  const [tikTokLink, setTikTokLink] = useState<string | undefined>('')
  const [instagramLink, setInstagramLink] = useState<string | undefined>('')

  const getTikTokLink = useCallback(() => {
    try {
      return getStringValue('TIKTOK_LINK')
    } catch (error) {
      Logger.breadcrumb('getTikTokLinkError', 'error', error as Error)
      return ''
    }
  }, [])

  const getInstagramLink = useCallback(() => {
    try {
      return getStringValue('INSTAGRAM_LINK')
    } catch (error) {
      Logger.breadcrumb('getInstagramLinkError', 'error', error as Error)
      return ''
    }
  }, [])

  useEffect(() => {
    const tikTokLinkValue = getTikTokLink()
    const instagramLinkValue = getInstagramLink()

    setTikTokLink(tikTokLinkValue)
    setInstagramLink(instagramLinkValue)
  }, [getTikTokLink, getInstagramLink])

  const checkNotificationPermission = useCallback(async (): Promise<string> => {
    try {
      const { status } = await checkNotifications()
      setNotificationStatus(status !== 'granted' ? false : true)
      return status
    } catch (error) {
      Logger.breadcrumb('checkNotificationPermissionError', 'error', error as Error)
      return 'unavailable'
    }
  }, [])

  const handleAppStateChange = useCallback(
    (nextAppState: string) => {
      if (nextAppState === 'active') {
        checkNotificationPermission()
      }
    },
    [checkNotificationPermission],
  )

  useEffect(() => {
    const subscription = AppState?.addEventListener('change', handleAppStateChange)

    return () => {
      subscription?.remove()
    }
  }, [handleAppStateChange])

  useEffect(() => {
    checkNotificationPermission()
  }, [checkNotificationPermission])

  const requestReview = useCallback(async () => {
    if (await StoreReview.isAvailableAsync()) {
      try {
        await StoreReview.requestReview()
      } catch (error) {
        Logger.breadcrumb('requestReviewError', 'error', error as Error)
      }
    } else {
      Alert.alert(getLocale('error'), getLocale('ratingRequestNotSupported'), [
        { text: getLocale('ok') },
      ],
        {
          userInterfaceStyle: selectedTheme,
        })
    }
  }, [selectedTheme])

  const openTiktok = useCallback(async () => {
    try {
      await Linking.openURL(tikTokLink ?? '')
    } catch (error) {
      Logger.breadcrumb('openTiktokError', 'error', error as Error)
    }
  }, [tikTokLink])

  const openInstagram = useCallback(async () => {
    try {
      await Linking.openURL(instagramLink ?? '')
    } catch (error) {
      Logger.breadcrumb('openInstagramError', 'error', error as Error)
    }
  }, [instagramLink])

  const handleDeleteAccountPress = useCallback(() => {
    Alert.alert(getLocale('deleteAccount'), getLocale('deleteAccountConfirmation'), [
      {
        style: 'cancel',
        text: getLocale('cancel'),
      },
      {
        onPress: () => deleteUserAccount(),
        style: 'destructive',
        text: getLocale('delete'),
      },
     ],
      {
      userInterfaceStyle: selectedTheme,
    })
  }, [selectedTheme])

  const handleBackPress = useCallback(() => {
    router.back()
  }, [])

  const handleSettingsPress = useCallback(() => {
    openSettings()
  }, [])

  const handleTermsPress = useCallback(() => {
    router.navigate('/settings-terms-of-use')
  }, [])

  const handlePrivacyPress = useCallback(() => {
    router.navigate('/settings-privacy-policy')
  }, [])

  const handleFaqPress = useCallback(() => {
    router.navigate('/faq')
  }, [])

  const switchTrackColor = useMemo(
    () => ({
      false: colors?.background?.quaternary,
      true: colors?.primary100,
    }),
    [colors?.primary100, colors?.background?.quaternary],
  )

  const rightIcon = useMemo(
    () => (
      <Close
        height={24}
        primaryColor={colors?.background?.quaternary}
        secondaryColor={colors?.onPrimary100}
        width={24}
      />
    ),
    [colors?.background?.quaternary, colors?.onPrimary100],
  )

  const tikTokIcon = useMemo(() => <Tiktok height={24} width={24} />, [])

  const instagramIcon = useMemo(() => <Instagram height={24} width={24} />, [])

  const localeStrings = useMemo(
    () => ({
      deleteAccount: getLocale('deleteAccount'),
      faq: getLocale('faq'),
      general: getLocale('general'),
      instagram: getLocale('instagram'),
      notification: getLocale('notification'),
      privacyPolicy: getLocale('privacyPolicy'),
      rateApp: getLocale('rateApp'),
      settings: getLocale('settings'),
      socialMediaAccounts: getLocale('socialMediaAccounts'),
      termsOfUse: getLocale('termsOfUse'),
      tikTok: getLocale('tikTok'),
    }),
    [selectedLocale],
  )

  return (
    <SafeLayout>
      <Header
        backIcon={false}
        rightIcon={rightIcon}
        rightIconOnPress={handleBackPress}
        title={localeStrings.settings}
      />

      <ScrollView contentContainerClassName="px-4 pb-10" showsVerticalScrollIndicator={false}>
        <ThemedText className="ml-4 mt-8 mb-2" color="text-70" type="body2">
          {localeStrings.general}
        </ThemedText>

        <View className="rounded-xl overflow-hidden bg-background-secondary">
          <View className="h-14 flex-row justify-between items-center p-4 bg-background-secondary">
            <ThemedText color="text-100" type="body1">
              {localeStrings.notification}
            </ThemedText>
            <Switch
              ios_backgroundColor={colors?.background?.quaternary}
              onValueChange={handleSettingsPress}
              thumbColor={colors?.onPrimary100}
              trackColor={switchTrackColor}
              value={notificationStatus}
            />
          </View>

          <View className="border-b border-solid border-background-quaternary ml-4" />

          <ProfileMenuItem onPress={requestReview} title={localeStrings.rateApp} />
          <ProfileMenuItem onPress={handlePrivacyPress} title={localeStrings.privacyPolicy} />
          <ProfileMenuItem onPress={handleTermsPress} title={localeStrings.termsOfUse} />
          <ProfileMenuItem
            isLastItem={user ? false : true}
            onPress={handleFaqPress}
            title={localeStrings.faq}
          />
          {user ? (
            <ProfileMenuItem
              onPress={handleDeleteAccountPress}
              rightIcon={false}
              title={localeStrings.deleteAccount}
              isLastItem
            />
          ) : null}
        </View>

        <ThemedText className="ml-4 mt-8 mb-2" color="text-70" type="body2">
          {localeStrings.socialMediaAccounts}
        </ThemedText>

        <View className="rounded-xl overflow-hidden bg-background-secondary">
          <ProfileMenuItem
            leftIcon={tikTokIcon}
            onPress={openTiktok}
            rightIcon={false}
            title={localeStrings.tikTok}
          />
          <ProfileMenuItem
            leftIcon={instagramIcon}
            onPress={openInstagram}
            rightIcon={false}
            title={localeStrings.instagram}
            isLastItem
          />
        </View>
      </ScrollView>
    </SafeLayout>
  )
}
