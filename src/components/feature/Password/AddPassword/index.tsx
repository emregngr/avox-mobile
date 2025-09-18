import { zodResolver } from '@hookform/resolvers/zod'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { TextInput } from 'react-native'
import { View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { z } from 'zod'

import { TextInputField } from '@/components/common/FormElements'
import { ThemedGradientButton } from '@/components/common/ThemedGradientButton'
import { useAddPassword } from '@/hooks/services/useUser'
import { getLocale } from '@/locales/i18next'

export const AddPassword = () => {
  const { bottom, top } = useSafeAreaInsets()

  const { isPending, mutateAsync: addPassword } = useAddPassword()

  const addPasswordSchema = useMemo(
    () =>
      z
        .object({
          confirmPassword: z.string().min(6, getLocale('minPassword')),
          newPassword: z.string().min(6, getLocale('minPassword')),
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

  const renderFormField = (fieldConfig: (typeof formLabels)[0]) => {
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
      <TextInputField
        control={control}
        editable={!isPending}
        key={fieldConfig.name}
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
  }

  return (
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
          label={getLocale('add')}
          loading={isPending}
          onPress={handleFormSubmit}
          testID="add-password-submit-button"
          type="secondary"
        />
      </View>
    </KeyboardAwareScrollView>
  )
}
