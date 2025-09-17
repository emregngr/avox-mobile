import { render } from '@testing-library/react-native'
import React from 'react'

import { cn } from '@/utils/common/cn'

import { SafetyHeader } from '../SafetyHeader'

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

jest.mock('@/utils/common/cn')

const mockedCn = cn as jest.Mock

const mockedProps = {
  title: 'Safety & Environment',
  iconName: 'shield-check' as const,
  iconColor: '#3498db',
}

describe('SafetyHeader', () => {
  it('should render the title text correctly', () => {
    const { getByText } = render(<SafetyHeader {...mockedProps} />)

    expect(getByText(mockedProps.title)).toBeTruthy()
  })

  it('should render the icon with the correct name, color, and size', () => {
    const { getByTestId } = render(<SafetyHeader {...mockedProps} />)

    const icon = getByTestId('mocked-material-community-icon')

    expect(icon.props.name).toBe(mockedProps.iconName)
    expect(icon.props.color).toBe(mockedProps.iconColor)
    expect(icon.props.size).toBe(20)
  })

  it('should use the default className when none is provided', () => {
    render(<SafetyHeader {...mockedProps} />)

    expect(mockedCn).toHaveBeenCalledWith('flex-row items-center', 'mb-4')
  })

  it('should override the default className when a custom one is provided', () => {
    const customClassName = 'p-4 border-b'
    render(<SafetyHeader {...mockedProps} className={customClassName} />)

    expect(mockedCn).toHaveBeenCalledWith('flex-row items-center', customClassName)
  })
})

describe('SafetyHeader Component Snapshot', () => {
  it('should render the SafetyHeader Component successfully', () => {
    const { toJSON } = render(<SafetyHeader {...mockedProps} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
