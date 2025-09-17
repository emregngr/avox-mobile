import { render } from '@testing-library/react-native'
import React from 'react'
import type { TextProps } from 'react-native'

import type { TypographyType } from '@/components/common/ThemedText'
import { ThemedText } from '@/components/common/ThemedText'

jest.mock('@/utils/common/cn', () => ({
  cn: (...args: (string | undefined | null | boolean)[]) => args.filter(Boolean).join(' '),
}))

describe('ThemedText Component', () => {
  it('should render its children correctly', () => {
    const { getByText } = render(
      <ThemedText color="text-100" type="body1">
        Hello, World!
      </ThemedText>,
    )
    expect(getByText('Hello, World!')).toBeTruthy()
  })

  describe('Typography Types', () => {
    const typographyMap: Record<TypographyType, string> = {
      bigTitle: 'text-[55px] leading-[63px] font-inter-bold',
      title: 'text-[32px] leading-[38px] font-inter-bold',
      h1: 'text-[24px] leading-[29px] font-inter-bold',
      h2: 'text-[20px] leading-[24px] font-inter-bold',
      h3: 'text-[18px] leading-[21px] font-inter-semibold',
      h4: 'text-[16px] leading-[19px] font-inter-semibold',
      body1: 'text-[16px] leading-[19px] font-inter-medium',
      body2: 'text-[14px] leading-[17px] font-inter-medium',
      body3: 'text-[13px] leading-[16px] font-inter-regular',
      body4: 'text-[12px] leading-[15px] font-inter-regular',
      button1: 'text-[16px] leading-[19px] font-inter-bold',
      button2: 'text-[14px] leading-[17px] font-inter-semibold',
      tabBar: 'text-[12px] leading-[14px] tracking-[-0.24px] font-inter-medium',
    }

    it.each(Object.entries(typographyMap))(
      'should apply the correct style for type "%s"',
      (type, expectedClass) => {
        const { getByTestId } = render(
          <ThemedText color="text-100" testID="themed-text" type={type as TypographyType}>
            Styled Text
          </ThemedText>,
        )
        const textElement = getByTestId('themed-text')
        expect(textElement.props.className).toContain(expectedClass)
      },
    )
  })

  describe('Color Application', () => {
    it('should apply the correct class for a single-level color', () => {
      const { getByTestId } = render(
        <ThemedText color="success" testID="themed-text" type="body1">
          Success
        </ThemedText>,
      )
      expect(getByTestId('themed-text').props.className).toContain('text-success')
    })

    it('should apply the correct class for a nested color', () => {
      const { getByTestId } = render(
        <ThemedText color="primary-70" testID="themed-text" type="body1">
          Primary
        </ThemedText>,
      )
      expect(getByTestId('themed-text').props.className).toContain('text-primary-70')
    })

    it('should handle an invalid color gracefully without applying a color class', () => {
      const { getByTestId } = render(
        <ThemedText color="invalid-color" testID="themed-text" type="body1">
          Invalid Color
        </ThemedText>,
      )
      const expectedTypographyClass = 'text-[16px] leading-[19px] font-inter-medium'
      expect(getByTestId('themed-text').props.className).toBe(expectedTypographyClass)
    })
  })

  it('should apply the text-center class when center prop is true', () => {
    const { getByTestId } = render(
      <ThemedText
        color="text-100" testID="themed-text" type="h1"
        center
      >
        Centered
      </ThemedText>,
    )
    expect(getByTestId('themed-text').props.className).toContain('text-center')
  })

  it('should not apply the text-center class when center prop is omitted', () => {
    const { getByTestId } = render(
      <ThemedText color="text-100" testID="themed-text" type="h1">
        Not Centered
      </ThemedText>,
    )
    expect(getByTestId('themed-text').props.className).not.toContain('text-center')
  })

  it('should merge any additional className', () => {
    const customClass = 'mt-4 opacity-75'
    const { getByTestId } = render(
      <ThemedText
        className={customClass} color="text-100" testID="themed-text"
        type="body1"
      >
        Custom Class
      </ThemedText>,
    )
    const textElement = getByTestId('themed-text')
    expect(textElement.props.className).toContain('text-[16px] leading-[19px] font-inter-medium')
    expect(textElement.props.className).toContain('text-text-100')
    expect(textElement.props.className).toContain(customClass)
  })

  it('should pass through other standard TextProps', () => {
    const textProps: TextProps = { numberOfLines: 2, ellipsizeMode: 'tail' }
    const { getByTestId } = render(
      <ThemedText
        color="text-100" testID="themed-text" type="body1"
        {...textProps}
      >
        A very long text that is expected to be truncated after two lines.
      </ThemedText>,
    )
    const textElement = getByTestId('themed-text')
    expect(textElement.props.numberOfLines).toBe(2)
    expect(textElement.props.ellipsizeMode).toBe('tail')
  })

  it('should have allowFontScaling set to false and maxFontSizeMultiplier to 1.0', () => {
    const { getByTestId } = render(
      <ThemedText color="text-100" testID="themed-text" type="body1">
        Fixed Font Size
      </ThemedText>,
    )
    const textElement = getByTestId('themed-text')
    expect(textElement.props.allowFontScaling).toBe(false)
    expect(textElement.props.maxFontSizeMultiplier).toBe(1.0)
  })
})

describe('ThemedText Component Snapshot', () => {
  it('should render the ThemedText Component successfully', () => {
    const { getByTestId } = render(
      <ThemedText color="text-100" testID="themed-text" type="body1">
        Hello, World!
      </ThemedText>,
    )
    expect(getByTestId('themed-text')).toMatchSnapshot()
  })
})
