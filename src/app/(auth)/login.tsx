import { zodResolver } from '@hookform/resolvers/zod'
import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { TextInput } from 'react-native'
import { View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { z } from 'zod'

import {
  Header,
  SafeLayout,
  TextInputField,
  ThemedButtonText,
  ThemedGradientButton,
  ThemedText,
} from '@/components/common'
import { useEmailLogin } from '@/hooks/services/useAuth'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'

const Icon = require('@/assets/images/icon-ios.png')

const STATIC_STYLES = {
  icon: {
    borderRadius: 50,
    height: 100,
    width: 100,
  },
}

export default function Login() {
  const { bottom, top } = useSafeAreaInsets()

  const { selectedLocale } = useLocaleStore()

  const { isRegisterParam } = useLocalSearchParams()

  const { isPending, mutateAsync: loginWithEmail } = useEmailLogin()

  const loginSchema = useMemo(
    () =>
      z.object({
        email: z.string().pipe(z.email(getLocale('invalidEmail'))),
        password: z.string().min(6, getLocale('minPassword')).max(50, getLocale('maxPassword')),
      }),
    [],
  )

  type LoginFormValues = z.infer<typeof loginSchema>

  const isParamTrue = useCallback(
    (param: string | string[] | undefined): boolean => param === 'true',
    [],
  )

  const defaultValues = useMemo(
    () => ({
      email: '',
      password: '',
    }),
    [],
  )

  const formLabels = useMemo(
    () => [
      {
        editable: true,
        keyboardType: 'email-address' as const,
        label: getLocale('email'),
        name: 'email' as const,
        placeholder: getLocale('emailPlaceholder'),
        returnKeyType: 'next' as const,
        secureTextEntry: false,
        showToggle: false,
      },
      {
        editable: true,
        keyboardType: 'default' as const,
        label: getLocale('password'),
        name: 'password' as const,
        placeholder: getLocale('passwordPlaceholder'),
        returnKeyType: 'done' as const,
        secureTextEntry: true,
        showToggle: true,
      },
    ],
    [],
  )

  const {
    control,
    formState: { isValid },
    handleSubmit,
    reset,
  } = useForm<LoginFormValues>({
    defaultValues,
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = useCallback(
    (data: LoginFormValues) => {
      loginWithEmail(data)
    },
    [loginWithEmail],
  )

  const handleForgotPasswordPress = useCallback(() => {
    reset()
    router.navigate('/forgot-password')
  }, [reset])

  const handleRegisterPress = useCallback(() => {
    reset()
    router.navigate({
      params: {
        isLoginParam: 'true',
      },
      pathname: '/register',
    })
  }, [reset])

  const handleBackPress = useCallback(() => {
    reset()
    isParamTrue(isRegisterParam) ? router.navigate('/register') : router.replace('/auth')
  }, [reset, isParamTrue, isRegisterParam])

  const emailRef = useRef<TextInput>(null)
  const passwordRef = useRef<TextInput>(null)

  const focusPassword = useCallback(() => {
    passwordRef?.current?.focus()
  }, [])

  const [hasBeenSubmitted, setHasBeenSubmitted] = useState<boolean>(false)

  const handleFormSubmit = useCallback(() => {
    setHasBeenSubmitted(true)
    handleSubmit(onSubmit)()
  }, [handleSubmit, onSubmit])

  const buttonDisabled = useMemo(() => {
    if (!hasBeenSubmitted) {
      return isPending
    }

    return !isValid || isPending
  }, [hasBeenSubmitted, isValid, isPending])

  const localeStrings = useMemo(
    () => ({
      createAccount: getLocale('createAccount'),
      dontHaveAccount: getLocale('dontHaveAccount'),
      forgotPassword: getLocale('forgotPassword'),
      login: getLocale('login'),
    }),
    [selectedLocale],
  )

  const renderFormField = useCallback(
    (fieldConfig: (typeof formLabels)[0]) => {
      const getRef = () => {
        if (fieldConfig.name === 'email') return emailRef
        if (fieldConfig.name === 'password') return passwordRef
        return undefined
      }

      const getOnSubmitEditing = () => {
        if (fieldConfig.name === 'email') return focusPassword
        if (fieldConfig.name === 'password') return handleFormSubmit
        return undefined
      }

      const refHandler = getRef()
      const onSubmitEditingHandler = getOnSubmitEditing()

      return (
        <TextInputField
          control={control}
          editable={fieldConfig.editable && !isPending}
          key={fieldConfig.name}
          keyboardType={fieldConfig.keyboardType}
          label={fieldConfig.label}
          name={fieldConfig.name}
          placeholder={fieldConfig.placeholder}
          returnKeyType={fieldConfig.returnKeyType}
          secureTextEntry={fieldConfig.secureTextEntry}
          showToggle={fieldConfig.showToggle}
          testID={fieldConfig.name}
          {...(onSubmitEditingHandler && { onSubmitEditing: onSubmitEditingHandler })}
          {...(refHandler && { ref: refHandler })}
        />
      )
    },
    [control, isPending, focusPassword, handleFormSubmit],
  )

  return (
    <SafeLayout testID="login-screen">
      <Header
        backIconOnPress={handleBackPress}
        containerClassName="absolute left-0 right-0 bg-transparent z-50"
        style={{ top }}
        testID="login-screen-header"
        title={localeStrings.login}
      />

      <KeyboardAwareScrollView
        bottomOffset={50}
        contentContainerClassName="px-4"
        contentContainerStyle={{ paddingBottom: bottom + 20, paddingTop: top + 64 }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center my-8">
          <Image
            cachePolicy="memory-disk"
            contentFit="contain"
            source={Icon}
            style={STATIC_STYLES.icon}
            transition={0}
          />
        </View>
        <View className="gap-y-2">
          {formLabels.map(fieldConfig => renderFormField(fieldConfig))}
        </View>
        <ThemedButtonText
          containerStyle="self-end my-6"
          disabled={isPending}
          hitSlop={10}
          label={localeStrings.forgotPassword}
          onPress={handleForgotPasswordPress}
          testID="forgot-password-button"
          textColor="text-100"
          type="body2"
        />

        <ThemedGradientButton
          disabled={buttonDisabled}
          label={getLocale('login')}
          loading={isPending}
          onPress={handleFormSubmit}
          testID="login-submit-button"
        />

        <View className="flex-row justify-center items-center mt-6">
          <ThemedText color="text-70" type="body2">
            {localeStrings.dontHaveAccount}
          </ThemedText>
          <ThemedButtonText
            disabled={isPending}
            hitSlop={10}
            label={localeStrings.createAccount}
            onPress={handleRegisterPress}
            testID="create-account-button"
            textColor="text-100"
            textStyle="ml-1"
            type="body2"
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeLayout>
  )
}
