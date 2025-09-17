import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { SwitchFilter } from '@/components/feature/FilterModal/SwitchFilter'
import useThemeStore from '@/store/theme'

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

const mockedOnToggle = jest.fn()

const mockedDefaultProps = {
  filterKey: 'test-filter',
  onToggle: mockedOnToggle,
  title: 'Enable Test Filter',
  value: false,
}

beforeEach(() => {
  mockedUseThemeStore.mockReturnValue({
    selectedTheme: 'light',
  })
})

describe('SwitchFilter', () => {
  it('should render the title and switch in the "off" state', () => {
    const { getByText, getByRole } = render(<SwitchFilter {...mockedDefaultProps} />)
    expect(getByText('Enable Test Filter')).toBeTruthy()
    const switchComponent = getByRole('switch')
    expect(switchComponent.props.value).toBe(false)
  })

  it('should render the switch in the "on" state when value is true', () => {
    const { getByRole } = render(<SwitchFilter {...mockedDefaultProps} value />)
    const switchComponent = getByRole('switch')
    expect(switchComponent.props.value).toBe(true)
  })

  it('should call onToggle with the correct filterKey when pressed', () => {
    const { getByRole } = render(<SwitchFilter {...mockedDefaultProps} />)
    const switchComponent = getByRole('switch')
    fireEvent(switchComponent, 'valueChange', true)
    expect(mockedOnToggle).toHaveBeenCalledTimes(1)
    expect(mockedOnToggle).toHaveBeenCalledWith('test-filter')
  })

  it('should match snapshot', () => {
    const { toJSON } = render(<SwitchFilter {...mockedDefaultProps} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
