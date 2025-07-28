import { zodResolver } from '@hookform/resolvers/zod'
import { getApp } from '@react-native-firebase/app'
import { getAuth } from '@react-native-firebase/auth'
import { router } from 'expo-router'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { TextInput } from 'react-native'
import { View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { z } from 'zod'

import { Header, SafeLayout, TextFormField, ThemedButton } from '@/components/common'
import { useAddPassword, useChangePassword } from '@/hooks/services/useUser'
import { getLocale } from '@/locales/i18next'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

const app = getApp()
const authInstance = getAuth(app)

const ChangePasswordForm = () => {
  const { isPending, mutateAsync: changePassword } = useChangePassword()

  const changePasswordSchema = useMemo(
    () =>
      z
        .object({
          confirmPassword: z.string().min(6, getLocale('minPasswordMessage')),
          currentPassword: z.string().min(6, getLocale('minPasswordMessage')),
          newPassword: z.string().min(6, getLocale('minPasswordMessage')),
        })
        .refine(data => data.newPassword === data.confirmPassword, {
          message: getLocale('passwordsDoNotMatch'),
          path: ['confirmPassword'],
        })
        .refine(data => data.currentPassword !== data.newPassword, {
          message: getLocale('newPasswordCannotBeSame'),
          path: ['newPassword'],
        }),
    [],
  )

  type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

  const defaultValues = useMemo(
    () => ({
      confirmPassword: '',
      currentPassword: '',
      newPassword: '',
    }),
    [],
  )

  const formLabels = useMemo(
    () => [
      {
        label: getLocale('currentPassword'),
        name: 'currentPassword' as const,
        placeholder: getLocale('currentPasswordPlaceholder'),
        returnKeyType: 'next' as const,
        secureTextEntry: true,
        showToggle: true,
      },
      {
        label: getLocale('newPassword'),
        name: 'newPassword' as const,
        placeholder: getLocale('newPasswordPlaceholder'),
        returnKeyType: 'next' as const,
        secureTextEntry: true,
        showToggle: true,
      },
      {
        label: getLocale('confirmNewPassword'),
        name: 'confirmPassword' as const,
        placeholder: getLocale('confirmNewPasswordPlaceholder'),
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
  } = useForm<ChangePasswordFormValues>({
    defaultValues,
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(changePasswordSchema),
  })

  const onSubmit = useCallback(
    (data: ChangePasswordFormValues) => {
      changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword })
    },
    [changePassword],
  )

  const currentPasswordRef = useRef<TextInput>(null)
  const newPasswordRef = useRef<TextInput>(null)
  const confirmPasswordRef = useRef<TextInput>(null)

  const focusNewPassword = useCallback(() => {
    newPasswordRef?.current?.focus()
  }, [])

  const focusConfirmPassword = useCallback(() => {
    confirmPasswordRef?.current?.focus()
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

  const renderFormField = (fieldConfig: (typeof formLabels)[0], index: number) => {
    const getRef = () => {
      if (fieldConfig.name === 'currentPassword') return currentPasswordRef
      if (fieldConfig.name === 'newPassword') return newPasswordRef
      if (fieldConfig.name === 'confirmPassword') return confirmPasswordRef
      return undefined
    }

    const getOnSubmitEditing = () => {
      if (fieldConfig.name === 'currentPassword') return focusNewPassword
      if (fieldConfig.name === 'newPassword') return focusConfirmPassword
      if (fieldConfig.name === 'confirmPassword') return handleFormSubmit
      return undefined
    }

    const refHandler = getRef()
    const onSubmitEditingHandler = getOnSubmitEditing()

    return (
      <TextFormField
        control={control}
        editable={!isPending}
        key={fieldConfig.name}
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
  }

  return (
    <KeyboardAwareScrollView
      bottomOffset={50}
      contentContainerClassName="my-5 pb-24 px-4"
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-y-2">
        {formLabels?.map((fieldConfig, index) => renderFormField(fieldConfig, index))}
      </View>

      <View className="mt-6">
        <ThemedButton
          disabled={buttonDisabled}
          label={getLocale('change')}
          loading={isPending}
          onPress={handleFormSubmit}
        />
      </View>
    </KeyboardAwareScrollView>
  )
}

const AddPasswordForm = () => {
  const { isPending, mutateAsync: addPassword } = useAddPassword()

  const addPasswordSchema = useMemo(
    () =>
      z
        .object({
          confirmPassword: z.string().min(6, getLocale('minPasswordMessage')),
          newPassword: z.string().min(6, getLocale('minPasswordMessage')),
        })
        .refine(data => data.newPassword === data.confirmPassword, {
          message: getLocale('passwordsDoNotMatch'),
          path: ['confirmPassword'],
        }),
    [],
  )

  type AddPasswordFormValues = z.infer<typeof addPasswordSchema>

  const defaultValues = useMemo(
    () => ({
      confirmPassword: '',
      newPassword: '',
    }),
    [],
  )

  const formLabels = useMemo(
    () => [
      {
        label: getLocale('newPassword'),
        name: 'newPassword' as const,
        placeholder: getLocale('newPasswordPlaceholder'),
        returnKeyType: 'next' as const,
        secureTextEntry: true,
        showToggle: true,
      },
      {
        label: getLocale('confirmNewPassword'),
        name: 'confirmPassword' as const,
        placeholder: getLocale('confirmNewPasswordPlaceholder'),
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
  } = useForm<AddPasswordFormValues>({
    defaultValues,
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(addPasswordSchema),
  })

  const onSubmit = useCallback(
    (data: AddPasswordFormValues) => {
      addPassword({ newPassword: data.newPassword })
    },
    [addPassword],
  )

  const newPasswordRef = useRef<TextInput>(null)
  const confirmPasswordRef = useRef<TextInput>(null)

  const focusConfirmPassword = useCallback(() => {
    confirmPasswordRef?.current?.focus()
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

  const renderFormField = (fieldConfig: (typeof formLabels)[0], index: number) => {
    const getRef = () => {
      if (fieldConfig.name === 'newPassword') return newPasswordRef
      if (fieldConfig.name === 'confirmPassword') return confirmPasswordRef
      return undefined
    }

    const getOnSubmitEditing = () => {
      if (fieldConfig.name === 'newPassword') return focusConfirmPassword
      if (fieldConfig.name === 'confirmPassword') return handleFormSubmit
      return undefined
    }

    const refHandler = getRef()
    const onSubmitEditingHandler = getOnSubmitEditing()

    return (
      <TextFormField
        control={control}
        editable={!isPending}
        key={fieldConfig.name}
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
  }

  return (
    <KeyboardAwareScrollView
      bottomOffset={50}
      contentContainerClassName="my-5 pb-24 px-4"
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-y-2">
        {formLabels?.map((fieldConfig, index) => renderFormField(fieldConfig, index))}
      </View>

      <View className="mt-6">
        <ThemedButton
          disabled={buttonDisabled}
          label={getLocale('add')}
          loading={isPending}
          onPress={handleFormSubmit}
        />
      </View>
    </KeyboardAwareScrollView>
  )
}

export default function ChangePassword() {
  const { selectedTheme } = useThemeStore()
  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const user = authInstance.currentUser

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
      {isPasswordUser ? <ChangePasswordForm /> : <AddPasswordForm />}
    </SafeLayout>
  )
}
