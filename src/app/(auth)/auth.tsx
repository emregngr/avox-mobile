import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { Platform, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Apple from '@/assets/icons/apple.svg'
import Close from '@/assets/icons/close'
import Google from '@/assets/icons/google.svg'
import {
  Header,
  SafeLayout,
  ThemedButton,
  ThemedGradientButton,
  ThemedText,
} from '@/components/common'
import { useAppleLogin, useGoogleLogin } from '@/hooks/services/useAuth'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

const Icon = require('@/assets/images/icon-ios.png')

const STATIC_STYLES = {
  icon: {
    borderRadius: 75,
    height: 150,
    width: 150,
  },
}

export default function Auth() {
  const { tab } = useLocalSearchParams()

  const { bottom, top } = useSafeAreaInsets()

  const { selectedLocale } = useLocaleStore()
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const { isPending: isLoggingInWithGoogle, mutateAsync: loginWithGoogle } = useGoogleLogin()
  const { isPending: isLoggingInWithApple, mutateAsync: loginWithApple } = useAppleLogin()

  const isPending = useMemo(
    () => isLoggingInWithGoogle || isLoggingInWithApple,
    [isLoggingInWithGoogle, isLoggingInWithApple],
  )

  const route = tab === 'profile' ? '/profile' : '/home'

  const handleBackPress = useCallback(() => {
    router.replace(route)
  }, [])

  const handleGoogleLogin = useCallback(() => {
    loginWithGoogle()
  }, [loginWithGoogle])

  const handleAppleLogin = useCallback(() => {
    loginWithApple()
  }, [loginWithApple])

  const handleLoginPress = useCallback(() => {
    router.navigate('/login')
  }, [])

  const handleRegisterPress = useCallback(() => {
    router.navigate('/register')
  }, [])

  const closeIcon = useMemo(
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

  const googleIcon = useMemo(() => <Google height={24} width={24} />, [])

  const appleIcon = useMemo(
    () => <Apple color={colors?.background?.primary} height={24} width={24} />,
    [colors?.background?.primary],
  )

  const localeStrings = useMemo(
    () => ({
      acceptText: getLocale('acceptText'),
      avox: getLocale('avox'),
      login: getLocale('login'),
      or: getLocale('or'),
      register: getLocale('register'),
      signInWithApple: getLocale('signInWithApple'),
      signInWithGoogle: getLocale('signInWithGoogle'),
      welcomeText: getLocale('welcomeText'),
    }),
    [selectedLocale],
  )

  return (
    <SafeLayout testID="auth-screen">
      <Header
        backIcon={false}
        containerClassName="absolute left-0 right-0 bg-transparent z-50"
        rightIcon={closeIcon}
        rightIconOnPress={handleBackPress}
        style={{ top }}
        testID="auth-screen-header"
      />

      <ScrollView
        contentContainerClassName="px-4"
        contentContainerStyle={{ paddingBottom: bottom + 20, paddingTop: top + 84 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center items-center">
          <Image
            cachePolicy="memory-disk"
            contentFit="contain"
            source={Icon}
            style={STATIC_STYLES.icon}
            transition={0}
          />
          <View className="items-center gap-y-4 mt-6">
            <ThemedText color="text-100" type="title">
              {localeStrings.avox}
            </ThemedText>
            <ThemedText color="text-90" type="h1">
              {localeStrings.welcomeText}
            </ThemedText>
          </View>
        </View>

        <View className="mt-8">
          <View className="gap-y-4">
            <ThemedGradientButton
              disabled={isPending}
              label={localeStrings.login}
              onPress={handleLoginPress}
              testID="login-button"
            />

            <ThemedGradientButton
              disabled={isPending}
              label={localeStrings.register}
              onPress={handleRegisterPress}
              testID="register-button"
            />
          </View>

          <View className="flex-row justify-between items-center my-4">
            <View className="bg-onPrimary-70 h-0.5 w-2/5" />
            <ThemedText color="text-90" type="body2">
              {localeStrings.or}
            </ThemedText>
            <View className="bg-onPrimary-70 h-0.5 w-2/5" />
          </View>

          <View className="gap-y-4">
            <ThemedButton
              disabled={isPending}
              icon={googleIcon}
              label={localeStrings.signInWithGoogle}
              loading={isLoggingInWithGoogle}
              onPress={handleGoogleLogin}
              testID="google-signin-button"
              type="social"
            />

            {Platform.OS === 'ios' ? (
              <ThemedButton
                disabled={isPending}
                icon={appleIcon}
                label={localeStrings.signInWithApple}
                loading={isLoggingInWithApple}
                onPress={handleAppleLogin}
                testID="apple-signin-button"
                type="social"
              />
            ) : null}
          </View>

          <ThemedText
            className="mt-6" color="text-70" type="body2"
            center
          >
            {localeStrings.acceptText}
          </ThemedText>
        </View>
      </ScrollView>
    </SafeLayout>
  )
}
