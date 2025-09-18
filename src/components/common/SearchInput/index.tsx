import { MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useMemo, useRef, useState } from 'react'
import { TextInput, TouchableOpacity, View } from 'react-native'

import Close from '@/assets/icons/close'
import { ThemedButtonText } from '@/components/common/ThemedButtonText'
import { getLocale } from '@/locales/i18next'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import { cn } from '@/utils/common/cn'
import { responsive } from '@/utils/common/responsive'

interface SearchInputProps {
  className?: string
  onChangeText: (text: string) => void
  placeholder: string
  value: string
}

export const SearchInput = ({ className, onChangeText, placeholder, value }: SearchInputProps) => {
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const textInputRef = useRef<TextInput>(null)

  const [isFocused, setIsFocused] = useState<boolean>(false)

  const handleClear = () => {
    onChangeText('')
  }

  const handleCancel = () => {
    onChangeText('')
    setIsFocused(false)
    textInputRef.current?.blur()
  }

  return (
    <View
      style={{
        width: responsive.deviceWidth - 32,
      }}
      className={cn('flex-row items-center self-center', className)}
    >
      <View
        className={cn(
          'flex-row items-center px-4 rounded-xl overflow-hidden bg-background-tertiary transition-all duration-300',
          isFocused ? 'flex-1' : '',
        )}
      >
        <MaterialCommunityIcons color={colors?.onPrimary100} name="magnify" size={20} />
        <TextInput
          onBlur={() => {
            setIsFocused(false)
          }}
          allowFontScaling={false}
          autoCorrect={false}
          className="flex-1 py-3 ml-3 text-text-100 placeholder:text-text-50 text-[16px] font-inter-medium"
          keyboardAppearance={selectedTheme}
          maxFontSizeMultiplier={1.0}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          ref={textInputRef}
          returnKeyType="search"
          spellCheck={false}
          testID="search-input"
          textAlignVertical="center"
          underlineColorAndroid="transparent"
          value={value}
          enablesReturnKeyAutomatically
        />
        {isFocused && value?.length > 0 ? (
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={10}
            onPress={handleClear}
            testID="search-clear-button"
          >
            <Close
              height={20}
              primaryColor={colors?.background?.primary}
              secondaryColor={colors?.onPrimary100}
              width={20}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {isFocused ? (
        <ThemedButtonText
          containerStyle="ml-2"
          hitSlop={10}
          label={getLocale('cancel')}
          onPress={handleCancel}
          testID="search-cancel-button"
          textColor="text-100"
          type="body1"
        />
      ) : null}
    </View>
  )
}
