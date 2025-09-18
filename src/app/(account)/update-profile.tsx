import { zodResolver } from '@hookform/resolvers/zod'
import { router } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import type { TextInput } from 'react-native'
import { Alert, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { z } from 'zod'

import {
  FullScreenLoading,
  Header,
  SafeLayout,
  TextInputField,
  ThemedGradientButton,
} from '@/components/common'
import { useGetUser, useUpdateUser } from '@/hooks/services/useUser'
import { getLocale } from '@/locales/i18next'
import useThemeStore from '@/store/theme'

export default function UpdateProfile() {
  const { bottom, top } = useSafeAreaInsets()

  const { selectedTheme } = useThemeStore()

  const { data: userProfile, isLoading: isProfileLoading } = useGetUser()
  const { isPending: isUpdatingProfile, mutateAsync: updateUser } = useUpdateUser()

  const profileUpdateSchema = useMemo(
    () =>
      z.object({
        email: z.string().pipe(z.email(getLocale('invalidEmail'))),
        firstName: z.string().min(2, getLocale('minFirstName')),
        lastName: z.string().min(2, getLocale('minLastName')),
      }),
    [],
  )

  type ProfileUpdateFormValues = z.infer<typeof profileUpdateSchema>

  const defaultValues = useMemo(
    () => ({
      email: '',
      firstName: '',
      lastName: '',
    }),
    [],
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
      },
      {
        editable: true,
        keyboardType: 'default' as const,
        label: getLocale('lastName'),
        name: 'lastName' as const,
        placeholder: getLocale('lastNamePlaceholder'),
        returnKeyType: 'done' as const,
      },
      {
        editable: false,
        keyboardType: 'email-address' as const,
        label: getLocale('email'),
        name: 'email' as const,
        placeholder: getLocale('emailPlaceholder'),
        returnKeyType: 'done' as const,
      },
    ],
    [],
  )

  const {
    control,
    formState: { isDirty, isValid },
    handleSubmit,
    reset,
  } = useForm<ProfileUpdateFormValues>({
    defaultValues,
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(profileUpdateSchema),
  })

  const resetFormData = useCallback(() => {
    if (userProfile) {
      reset({
        email: userProfile.email ?? '',
        firstName: userProfile.firstName ?? '',
        lastName: userProfile.lastName ?? '',
      })
    }
  }, [userProfile, reset])

  useEffect(() => {
    resetFormData()
  }, [resetFormData])

  const showNoChangesAlert = useCallback(() => {
    Alert.alert(
      getLocale('information'),
      getLocale('havenNotMadeChanges'),
      [{ text: getLocale('ok') }],
      {
        userInterfaceStyle: selectedTheme,
      },
    )
  }, [selectedTheme])

  const onSubmit = useCallback(
    (data: ProfileUpdateFormValues) => {
      const isProfileInfoChanged =
        data?.firstName !== userProfile?.firstName || data?.lastName !== userProfile?.lastName

      if (!isProfileInfoChanged) {
        return showNoChangesAlert()
      }

      updateUser({ email: data.email, firstName: data.firstName, lastName: data.lastName })
    },
    [userProfile, updateUser, showNoChangesAlert],
  )

  const isLoading = useMemo(() => isUpdatingProfile, [isUpdatingProfile])

  const firstNameRef = useRef<TextInput>(null)
  const lastNameRef = useRef<TextInput>(null)

  const focusLastName = useCallback(() => {
    lastNameRef?.current?.focus()
  }, [])

  const handleFormSubmit = useCallback(() => {
    handleSubmit(onSubmit)()
  }, [handleSubmit, onSubmit])

  const buttonDisabled = useMemo(
    () => !isValid || !isDirty || isLoading,
    [isValid, isDirty, isLoading],
  )

  const handleBackPress = useCallback(() => {
    router.back()
  }, [])

  const renderFormField = (fieldConfig: (typeof formLabels)[0]) => {
    const getRef = () => {
      if (fieldConfig.name === 'firstName') return firstNameRef
      if (fieldConfig.name === 'lastName') return lastNameRef
      return undefined
    }

    const getOnSubmitEditing = () => {
      if (fieldConfig.name === 'firstName') return focusLastName
      if (fieldConfig.name === 'lastName') return handleFormSubmit
      return undefined
    }

    const refHandler = getRef()
    const onSubmitEditingHandler = getOnSubmitEditing()

    return (
      <TextInputField
        control={control}
        editable={fieldConfig.editable && !isLoading}
        key={fieldConfig.name}
        keyboardType={fieldConfig.keyboardType}
        label={fieldConfig.label}
        name={fieldConfig.name}
        placeholder={fieldConfig.placeholder}
        returnKeyType={fieldConfig.returnKeyType}
        testID={fieldConfig.name}
        {...(onSubmitEditingHandler && { onSubmitEditing: onSubmitEditingHandler })}
        {...(refHandler && { ref: refHandler })}
      />
    )
  }

  if (isProfileLoading) {
    return <FullScreenLoading />
  }

  return (
    <SafeLayout testID="update-profile-screen">
      <Header
        backIconOnPress={handleBackPress}
        containerClassName="absolute left-0 right-0 bg-transparent z-50"
        style={{ top }}
        title={getLocale('updateProfile')}
      />
      <KeyboardAwareScrollView
        bottomOffset={50}
        contentContainerClassName="px-4"
        contentContainerStyle={{ paddingBottom: bottom + 20, paddingTop: top + 64 }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-y-2">
          {formLabels?.map(fieldConfig => renderFormField(fieldConfig))}
        </View>

        <View className="mt-6">
          <ThemedGradientButton
            disabled={buttonDisabled}
            label={getLocale('update')}
            loading={isLoading}
            onPress={handleFormSubmit}
            testID="update-submit-button"
            type="secondary"
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeLayout>
  )
}
