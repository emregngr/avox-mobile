import { zodResolver } from '@hookform/resolvers/zod'
import { router } from 'expo-router'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { TextInput } from 'react-native'
import { View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { z } from 'zod'

import { Header, SafeLayout, TextFormField, ThemedButton } from '@/components/common'
import { useForgotPassword } from '@/hooks/services/useAuth'
import { getLocale } from '@/locales/i18next'

export default function ForgotPassword() {
  const { isPending, mutateAsync: forgotPassword } = useForgotPassword()

  const forgotPasswordSchema = useMemo(
    () =>
      z.object({
        email: z.string().pipe(z.email(getLocale('invalidEmailMessage'))),
      }),
    [],
  )

  type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

  const defaultValues = useMemo(
    () => ({
      email: '',
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
        returnKeyType: 'done' as const,
      },
    ],
    [],
  )

  const {
    control,
    formState: { isValid },
    handleSubmit,
    reset,
  } = useForm<ForgotPasswordFormValues>({
    defaultValues,
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = useCallback(
    async (data: ForgotPasswordFormValues) => {
      forgotPassword(data.email)
      reset()
    },
    [forgotPassword, reset],
  )

  const emailRef = useRef<TextInput>(null)

  const handleBackPress = useCallback(() => {
    router.back()
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

  const headerTitle = useMemo(() => getLocale('forgotPassword'), [])
  const buttonLabel = useMemo(() => getLocale('sendResetLink'), [])

  const renderFormField = useCallback(
    (fieldConfig: (typeof formLabels)[0], index: number) => {
      const getRef = () => {
        if (fieldConfig.name === 'email') return emailRef
        return undefined
      }

      const getOnSubmitEditing = () => {
        if (fieldConfig.name === 'email') return handleFormSubmit
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
          {...(onSubmitEditingHandler && { onSubmitEditing: onSubmitEditingHandler })}
          {...(refHandler && { ref: refHandler })}
        />
      )
    },
    [control, isPending, handleFormSubmit],
  )

  return (
    <SafeLayout>
      <Header leftIconOnPress={handleBackPress} title={headerTitle} />

      <KeyboardAwareScrollView
        bottomOffset={50}
        contentContainerClassName="my-5 pb-24 px-4"
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-y-2">
          {formLabels.map((fieldConfig, index) => renderFormField(fieldConfig, index))}
        </View>

        <View className="mt-6">
          <ThemedButton
            disabled={buttonDisabled}
            label={buttonLabel}
            loading={isPending}
            onPress={handleFormSubmit}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeLayout>
  )
}
