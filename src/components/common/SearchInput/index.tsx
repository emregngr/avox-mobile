import React, { useMemo, useState } from 'react'
import { TextInput, TouchableOpacity, View } from 'react-native'

import ColoredClear from '@/assets/icons/coloredClear'
import Search from '@/assets/icons/tab/search.svg'
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

  const [isFocused, setIsFocused] = useState<boolean>(false)

  const handleClear = () => {
    onChangeText('')
  }

  return (
    <View
      className={cn(
        'flex-row items-center justify-center px-4 self-center rounded-xl overflow-hidden bg-background-tertiary',
        className,
      )}
      style={{ width: responsive.deviceWidth - 32 }}
    >
      <Search color={colors?.onPrimary100} height={20} width={20} />
      <TextInput
        className={cn(
          'flex-1 py-3 ml-3 text-text-100 placeholder:text-text-50 text-[16px] font-inter-medium',
        )}
        onBlur={() => {
          setIsFocused(false)
        }}
        allowFontScaling={false}
        autoCorrect={false}
        keyboardAppearance={selectedTheme === 'dark' ? 'dark' : 'light'}
        maxFontSizeMultiplier={1.0}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        placeholder={placeholder}
        returnKeyType="search"
        spellCheck={false}
        textAlignVertical="center"
        underlineColorAndroid="transparent"
        value={value}
        enablesReturnKeyAutomatically
      />
      {isFocused && value?.length > 0 ? (
        <TouchableOpacity activeOpacity={0.7} hitSlop={10} onPress={handleClear}>
          <ColoredClear
            height={20}
            primaryColor={colors?.background?.primary}
            secondaryColor={colors?.onPrimary100}
            width={20}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  )
}
