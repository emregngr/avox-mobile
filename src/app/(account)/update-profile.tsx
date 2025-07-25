import { zodResolver } from '@hookform/resolvers/zod'
import { router } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { TextInput } from 'react-native'
import { Alert, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { z } from 'zod'

import {
  FullScreenLoading,
  Header,
  SafeLayout,
  TextFormField,
  ThemedButton,
} from '@/components/common'
import { useGetUser, useUpdateUser } from '@/hooks/services/useUser'
import { getLocale } from '@/locales/i18next'

export default function UpdateProfile() {
  const { data: userProfile, isLoading: isProfileLoading } = useGetUser()
  const { isPending: isUpdatingProfile, mutateAsync: updateUser } = useUpdateUser()

  const profileUpdateSchema = useMemo(
    () =>
      z.object({
        email: z.string().pipe(z.email(getLocale('invalidEmailMessage'))),
        firstName: z.string().min(2, getLocale('minFirstNameMessage')),
        lastName: z.string().min(2, getLocale('minLastNameMessage')),
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
        email: userProfile.email || '',
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
      })
    }
  }, [userProfile, reset])

  useEffect(() => {
    resetFormData()
  }, [resetFormData])

  const showNoChangesAlert = useCallback(() => {
    Alert.alert(getLocale('information'), getLocale('havenNotMadeChanges'), [
      { text: getLocale('ok') },
    ])
  }, [])

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

  const [hasBeenSubmitted, setHasBeenSubmitted] = useState<boolean>(false)

  const handleFormSubmit = useCallback(() => {
    setHasBeenSubmitted(true)
    handleSubmit(onSubmit)()
  }, [handleSubmit, onSubmit])

  const buttonDisabled = useMemo(() => {
    if (!hasBeenSubmitted) {
      return isLoading
    }

    return !isValid || !isDirty || isLoading
  }, [hasBeenSubmitted, isValid, isDirty, isLoading])

  const handleBackPress = useCallback(() => {
    router.back()
  }, [])

  const headerTitle = useMemo(() => getLocale('updateProfile'), [])

  const updateButtonLabel = useMemo(() => getLocale('update'), [])

  const renderFormField = (fieldConfig: (typeof formLabels)[0], index: number) => {
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
      <TextFormField
        control={control}
        editable={fieldConfig.editable && !isLoading}
        key={fieldConfig.name}
        keyboardType={fieldConfig.keyboardType}
        label={fieldConfig.label}
        name={fieldConfig.name}
        placeholder={fieldConfig.placeholder}
        returnKeyType={fieldConfig.returnKeyType}
        {...(onSubmitEditingHandler && { onSubmitEditing: onSubmitEditingHandler })}
        {...(refHandler && { ref: refHandler })}
      />
    )
  }

  return (
    <SafeLayout>
      {isProfileLoading ? (
        <FullScreenLoading />
      ) : (
        <>
          <Header leftIconOnPress={handleBackPress} title={headerTitle} />
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
                label={updateButtonLabel}
                loading={isLoading}
                onPress={handleFormSubmit}
              />
            </View>
          </KeyboardAwareScrollView>
        </>
      )}
    </SafeLayout>
  )
}
