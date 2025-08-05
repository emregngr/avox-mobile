import { zodResolver } from '@hookform/resolvers/zod'
import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { TextInput } from 'react-native'
import { View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { z } from 'zod'

import {
  CheckboxField,
  Header,
  SafeLayout,
  TextFormField,
  ThemedButton,
  ThemedButtonText,
  ThemedText,
} from '@/components/common'
import { useEmailRegister } from '@/hooks/services/useAuth'
import { getLocale } from '@/locales/i18next'
import useFormStore from '@/store/form'
import useLocaleStore from '@/store/locale'

const Icon = require('@/assets/images/icon-ios.png')

const STATIC_STYLES = {
  icon: {
    borderRadius: 50,
    height: 100,
    width: 100,
  },
}

export default function Register() {
  const { selectedLocale } = useLocaleStore()

  const { isLoginParam, privacyPolicyParam, termsOfUseParam } = useLocalSearchParams()

  const { isPending, mutateAsync: registerWithEmail } = useEmailRegister()

  const registerSchema = useMemo(
    () =>
      z.object({
        email: z.string().pipe(z.email(getLocale('invalidEmailMessage'))),
        firstName: z.string().min(2, getLocale('minFirstNameMessage')),
        lastName: z.string().min(2, getLocale('minLastNameMessage')),
        password: z
          .string()
          .min(6, getLocale('minPasswordMessage'))
          .max(50, getLocale('maxPasswordMessage')),
        privacyPolicy: z.boolean().refine(value => value === true, {
          message: getLocale('privacyPolicyMessage'),
        }),
        termsOfUse: z.boolean().refine(value => value === true, {
          message: getLocale('termsOfUseMessage'),
        }),
      }),
    [],
  )

  type RegisterFormValues = z.infer<typeof registerSchema>

  const isParamTrue = useCallback(
    (param: string | string[] | undefined): boolean => param === 'true',
    [],
  )

  const { clearForm, formValues, setFormValues } = useFormStore()

  const defaultValues = useMemo(
    () => ({
      email: formValues.email ?? '',
      firstName: formValues.firstName ?? '',
      lastName: formValues.lastName ?? '',
      password: formValues.password ?? '',
      privacyPolicy: formValues.privacyPolicy ?? isParamTrue(privacyPolicyParam),
      termsOfUse: formValues.termsOfUse ?? isParamTrue(termsOfUseParam),
    }),
    [formValues, isParamTrue, privacyPolicyParam, termsOfUseParam],
  )

  const formLabels = useMemo(
    () => [
      {
        editable: true,
        keyboardType: 'default' as const,
        label: getLocale('firstName'),
        name: 'firstName' as const,
        placeholder: getLocale('firstNamePlaceholder'),
        returnKeyType: 'next' as const,
        secureTextEntry: false,
        showToggle: false,
      },
      {
        editable: true,
        keyboardType: 'default' as const,
        label: getLocale('lastName'),
        name: 'lastName' as const,
        placeholder: getLocale('lastNamePlaceholder'),
        returnKeyType: 'next' as const,
        secureTextEntry: false,
        showToggle: false,
      },
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
    formState: { errors, isValid },
    getValues,
    handleSubmit,
    reset,
    setValue,
    trigger,
  } = useForm<RegisterFormValues>({
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(registerSchema),
  })

  const firstNameRef = useRef<TextInput>(null)
  const lastNameRef = useRef<TextInput>(null)
  const emailRef = useRef<TextInput>(null)
  const passwordRef = useRef<TextInput>(null)

  useEffect(() => {
    if (isParamTrue(privacyPolicyParam)) {
      setValue('privacyPolicy', true)
      trigger('privacyPolicy')
    }
  }, [privacyPolicyParam, setValue, isParamTrue, trigger])

  useEffect(() => {
    if (isParamTrue(termsOfUseParam)) {
      setValue('termsOfUse', true)
      trigger('termsOfUse')
    }
  }, [termsOfUseParam, setValue, isParamTrue, trigger])

  const onSubmit = useCallback(
    (data: RegisterFormValues) => {
      registerWithEmail(data)
      clearForm()
    },
    [registerWithEmail, clearForm],
  )

  const handleLoginPress = useCallback(() => {
    reset()
    clearForm()
    router.navigate({
      params: {
        isRegisterParam: 'true',
      },
      pathname: '/login',
    })
  }, [reset, clearForm])

  const handleBackPress = useCallback(() => {
    reset()
    clearForm()
    isParamTrue(isLoginParam) ? router.navigate('/login') : router.replace('/auth')
  }, [reset, clearForm, isParamTrue, isLoginParam])

  const handlePrivacyPolicyPress = useCallback(() => {
    setFormValues(getValues())
    const privacyPolicyParam = getValues('privacyPolicy')
    const termsOfUseParam = getValues('termsOfUse')

    const currentParams = {
      privacyPolicyParam,
      termsOfUseParam,
    }

    router.navigate({
      params: currentParams as any,
      pathname: '/privacy-policy',
    })
  }, [setFormValues, getValues])

  const handleTermsOfUsePress = useCallback(() => {
    setFormValues(getValues())
    const privacyPolicyParam = getValues('privacyPolicy')
    const termsOfUseParam = getValues('termsOfUse')

    const currentParams = {
      privacyPolicyParam,
      termsOfUseParam,
    }

    router.navigate({
      params: currentParams as any,
      pathname: '/terms-of-use',
    })
  }, [setFormValues, getValues])

  const focusLastName = useCallback(() => {
    lastNameRef?.current?.focus()
  }, [])

  const focusEmail = useCallback(() => {
    emailRef?.current?.focus()
  }, [])

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

  const renderFormField = useCallback(
    (fieldConfig: (typeof formLabels)[0], index: number) => {
      const getRef = () => {
        if (fieldConfig.name === 'firstName') return firstNameRef
        if (fieldConfig.name === 'lastName') return lastNameRef
        if (fieldConfig.name === 'email') return emailRef
        if (fieldConfig.name === 'password') return passwordRef
        return undefined
      }

      const getOnSubmitEditing = () => {
        if (fieldConfig.name === 'firstName') return focusLastName
        if (fieldConfig.name === 'lastName') return focusEmail
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
    [control, isPending, focusLastName, focusEmail, focusPassword, handleFormSubmit],
  )

  const localeStrings = useMemo(
    () => ({
      alreadyHaveAccount: getLocale('alreadyHaveAccount'),
      login: getLocale('login'),
      register: getLocale('register'),
    }),
    [selectedLocale],
  )

  return (
    <SafeLayout>
      <Header backIconOnPress={handleBackPress} title={localeStrings.register} />

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
            source={Icon}
            style={STATIC_STYLES.icon}
            transition={0}
          />
        </View>

        <View className="gap-y-2">
          {formLabels.map((fieldConfig, index) => renderFormField(fieldConfig, index))}
        </View>

        <View className="mt-6 gap-y-2">
          <CheckboxField
            control={control}
            disabled={isPending}
            error={errors?.privacyPolicy?.message as string}
            labelKey="privacyPolicy"
            name="privacyPolicy"
            onPressLabel={handlePrivacyPolicyPress}
          />

          <CheckboxField
            control={control}
            disabled={isPending}
            error={errors?.termsOfUse?.message as string}
            labelKey="termsOfUse"
            name="termsOfUse"
            onPressLabel={handleTermsOfUsePress}
          />
        </View>

        <View className="mt-6">
          <ThemedButton
            disabled={buttonDisabled}
            label={localeStrings.register}
            loading={isPending}
            onPress={handleFormSubmit}
            type="border"
          />

          <View className="flex-row justify-center items-center mt-6">
            <ThemedText color="text-70" type="body2">
              {localeStrings.alreadyHaveAccount}
            </ThemedText>
            <ThemedButtonText
              disabled={isPending}
              hitSlop={10}
              label={localeStrings.login}
              onPress={handleLoginPress}
              textColor="text-100"
              textStyle="ml-1"
              type="body2"
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeLayout>
  )
}
