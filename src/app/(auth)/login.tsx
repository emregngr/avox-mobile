import { zodResolver } from '@hookform/resolvers/zod'
import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { TextInput } from 'react-native'
import { Pressable, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { z } from 'zod'

import { Header, SafeLayout, TextFormField, ThemedButton, ThemedText } from '@/components/common'
import { useEmailLogin } from '@/hooks/services/useAuth'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'

export default function Login() {
  const { selectedLocale } = useLocaleStore()

  const params = useLocalSearchParams()
  const { isRegisterParam } = params

  const { isPending, mutateAsync: loginWithEmail } = useEmailLogin()

  const loginSchema = useMemo(
    () =>
      z.object({
        email: z.string().pipe(z.email(getLocale('invalidEmailMessage'))),
        password: z
          .string()
          .min(6, getLocale('minPasswordMessage'))
          .max(50, getLocale('maxPasswordMessage')),
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

  const imageStyle = useMemo(
    () => ({
      borderRadius: 50,
      height: 100,
      width: 100,
    }),
    [],
  )

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
    (fieldConfig: (typeof formLabels)[0], index: number) => {
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
        <TextFormField
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
          {...(onSubmitEditingHandler && { onSubmitEditing: onSubmitEditingHandler })}
          {...(refHandler && { ref: refHandler })}
        />
      )
    },
    [control, isPending, focusPassword, handleFormSubmit],
  )

  return (
    <SafeLayout>
      <Header backIconOnPress={handleBackPress} title={localeStrings.login} />

      <KeyboardAwareScrollView
        bottomOffset={50}
        contentContainerClassName="my-5 pb-24 px-4"
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center my-8">
          <Image
            cachePolicy="memory-disk"
            contentFit="contain"
            source={require('@/assets/images/icon-ios.png')}
            style={imageStyle}
            transition={0}
          />
        </View>

        <View className="gap-y-2">
          {formLabels.map((fieldConfig, index) => renderFormField(fieldConfig, index))}
        </View>

        <Pressable
          className="self-end px-4 my-6"
          disabled={isPending}
          hitSlop={10}
          onPress={handleForgotPasswordPress}
        >
          <ThemedText color="text-100" type="body2">
            {localeStrings.forgotPassword}
          </ThemedText>
        </Pressable>

        <ThemedButton
          disabled={buttonDisabled}
          label={getLocale('login')}
          loading={isPending}
          onPress={handleFormSubmit}
          type="border"
        />

        <View className="flex-row justify-center items-center mt-6">
          <ThemedText color="text-70" type="body2">
            {localeStrings.dontHaveAccount}
          </ThemedText>
          <Pressable disabled={isPending} hitSlop={10} onPress={handleRegisterPress}>
            <ThemedText className="ml-1" color="text-100" type="body2">
              {localeStrings.createAccount}
            </ThemedText>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </SafeLayout>
  )
}
