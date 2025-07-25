import { Ionicons } from '@expo/vector-icons'
import type { ReactElement, Ref } from 'react'
import React, { forwardRef, useMemo, useState } from 'react'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import type { KeyboardTypeOptions } from 'react-native'
import { TextInput, TouchableOpacity, View } from 'react-native'

import ColoredClear from '@/assets/icons/coloredClear'
import { ThemedText } from '@/components/common/ThemedText'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import { cn } from '@/utils/common/cn'

type AutoCapitalizeType = 'none' | 'sentences' | 'words' | 'characters'
type ReturnKeyType = 'done' | 'go' | 'next' | 'search' | 'send'
type TextContentType =
  | 'none'
  | 'emailAddress'
  | 'password'
  | 'newPassword'
  | 'givenName'
  | 'familyName'
  | 'name'
  | 'username'
type AutoCompleteType =
  | 'off'
  | 'email'
  | 'password'
  | 'given-name'
  | 'family-name'
  | 'name'
  | 'username'
type SubmitBehavior = 'submit' | 'blurAndSubmit' | 'newline'

interface TextFormFieldProps<T extends FieldValues> {
  autoCapitalize?: AutoCapitalizeType
  autoCorrect?: boolean
  clearTextOnFocus?: boolean
  control: Control<T>
  editable?: boolean
  keyboardType?: KeyboardTypeOptions
  label: string
  name: Path<T>
  onSubmitEditing?: () => void
  placeholder: string
  returnKeyType?: ReturnKeyType
  secureTextEntry?: boolean
  showToggle?: boolean
  submitBehavior?: SubmitBehavior
  textContentType?: TextContentType
}

const TextFormFieldComponent = <T extends FieldValues>(
  {
    autoCapitalize = 'none',
    autoCorrect = false,
    clearTextOnFocus = false,
    control,
    editable = true,
    keyboardType = 'default',
    label,
    name,
    onSubmitEditing,
    placeholder,
    returnKeyType = 'next',
    secureTextEntry = false,
    showToggle = false,
    submitBehavior = 'blurAndSubmit',
    textContentType,
  }: TextFormFieldProps<T>,
  ref: Ref<TextInput>,
) => {
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
  const [isFocused, setIsFocused] = useState<boolean>(false)

  const getAutoCompleteType = (): AutoCompleteType => {
    const fieldName = name.toLowerCase()
    if (fieldName.includes('email')) return 'email'
    if (fieldName.includes('password')) return 'password'
    if (fieldName.includes('firstname') || fieldName.includes('givenname')) return 'given-name'
    if (fieldName.includes('lastname') || fieldName.includes('familyname')) return 'family-name'
    if (fieldName.includes('name')) return 'name'
    if (fieldName.includes('username')) return 'username'
    return 'off'
  }

  const getTextContentType = (): TextContentType => {
    if (textContentType) return textContentType

    const fieldName = name.toLowerCase()
    if (fieldName.includes('email')) return 'emailAddress'
    if (fieldName.includes('password')) return secureTextEntry ? 'password' : 'none'
    if (fieldName.includes('firstname') || fieldName.includes('givenname')) return 'givenName'
    if (fieldName.includes('lastname') || fieldName.includes('familyname')) return 'familyName'
    if (fieldName.includes('name')) return 'name'
    if (fieldName.includes('username')) return 'username'
    return 'none'
  }

  return (
    <Controller
      render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
        <View className="w-full">
          <ThemedText className="my-1.5 px-1" color="text-70" type="body1">
            {label}
          </ThemedText>
          <View
            className={cn(
              'flex-row items-center justify-center px-4 rounded-xl overflow-hidden bg-background-tertiary border',
              error ? 'border-error' : 'border-transparent',
            )}
          >
            <TextInput
              className={cn(
                'flex-1 py-3 text-text-100 placeholder:text-text-50 text-[16px] font-inter-medium',
              )}
              onBlur={() => {
                setIsFocused(false)
                onBlur()
              }}
              passwordRules={
                secureTextEntry
                  ? 'minlength: 6; required: lower; required: upper; required: digit;'
                  : undefined
              }
              allowFontScaling={false}
              autoCapitalize={autoCapitalize}
              autoComplete={getAutoCompleteType()}
              autoCorrect={autoCorrect}
              clearTextOnFocus={clearTextOnFocus}
              editable={editable}
              keyboardAppearance={selectedTheme === 'dark' ? 'dark' : 'light'}
              keyboardType={keyboardType}
              maxFontSizeMultiplier={1.0}
              onChangeText={onChange}
              onFocus={() => setIsFocused(true)}
              onSubmitEditing={onSubmitEditing}
              placeholder={placeholder}
              ref={ref}
              returnKeyType={returnKeyType}
              secureTextEntry={secureTextEntry && !isPasswordVisible}
              spellCheck={false}
              submitBehavior={submitBehavior}
              textAlignVertical="center"
              textContentType={getTextContentType()}
              underlineColorAndroid="transparent"
              value={value}
              enablesReturnKeyAutomatically
            />
            {secureTextEntry && showToggle ? (
              <TouchableOpacity
                activeOpacity={0.7}
                className={isFocused && value?.length > 0 ? 'mr-3' : ''}
                hitSlop={10}
                onPress={() => setIsPasswordVisible(prev => !prev)}
              >
                <Ionicons
                  color={colors?.onPrimary100}
                  name={isPasswordVisible ? 'eye-off' : 'eye'}
                  size={20}
                />
              </TouchableOpacity>
            ) : null}
            {isFocused && value?.length > 0 ? (
              <TouchableOpacity activeOpacity={0.7} hitSlop={10} onPress={() => onChange('')}>
                <ColoredClear
                  height={20}
                  primaryColor={colors?.background?.primary}
                  secondaryColor={colors?.onPrimary100}
                  width={20}
                />
              </TouchableOpacity>
            ) : null}
          </View>
          {error ? (
            <ThemedText className="my-1.5 px-1" color="error" type="body2">
              {error?.message}
            </ThemedText>
          ) : null}
        </View>
      )}
      control={control}
      name={name}
    />
  )
}

export const TextFormField = forwardRef(TextFormFieldComponent) as <T extends FieldValues>(
  props: TextFormFieldProps<T> & { ref?: Ref<TextInput> },
) => ReactElement
