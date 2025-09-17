import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { FaqItem } from '@/components/common/FaqItem'
import useThemeStore from '@/store/theme'

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

const mockedToggle = jest.fn()

const mockedItem = {
  id: '1',
  title: 'Test Question?',
  description: 'Test Answer',
}

beforeEach(() => {
  mockedUseThemeStore.mockReturnValue({
    selectedTheme: 'light',
  })
})

describe('FaqItem Component', () => {
  it('renders the title correctly', () => {
    const { getByText } = render(
      <FaqItem
        index={0} isExpanded={false} item={mockedItem}
        toggleExpanded={mockedToggle}
      />,
    )

    expect(getByText('Test Question?')).toBeTruthy()
  })

  it('renders the description but keeps it collapsed when isExpanded = false', () => {
    const { getByText } = render(
      <FaqItem
        index={0} isExpanded={false} item={mockedItem}
        toggleExpanded={mockedToggle}
      />,
    )

    expect(getByText('Test Answer')).toBeTruthy()
  })

  it('calls toggleExpanded when the toggle button is pressed', () => {
    const { getByTestId } = render(
      <FaqItem
        index={1} isExpanded={false} item={mockedItem}
        toggleExpanded={mockedToggle}
      />,
    )

    fireEvent.press(getByTestId('faq-1'))
    expect(mockedToggle).toHaveBeenCalledWith(1)
  })

  it('shows the description when isExpanded = true', () => {
    const { getByText } = render(
      <FaqItem
        index={0} item={mockedItem} toggleExpanded={mockedToggle}
        isExpanded
      />,
    )

    expect(getByText('Test Answer')).toBeTruthy()
  })
})

describe('FaqItem Component Snapshot', () => {
  it('should render the FaqItem Component successfully', () => {
    const { toJSON } = render(
      <FaqItem
        index={0} isExpanded={false} item={mockedItem}
        toggleExpanded={mockedToggle}
      />,
    )

    expect(toJSON()).toMatchSnapshot()
  })
})
