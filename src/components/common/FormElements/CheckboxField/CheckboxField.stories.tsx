import type { Meta, StoryObj } from '@storybook/react-native'
import { useForm } from 'react-hook-form'
import { Alert, View } from 'react-native'

import { CheckboxField } from '@/components/common/FormElements/CheckboxField'

interface FormData {
  termsAccepted: boolean
  marketingEmails: boolean
  dataProcessing: boolean
  newsletter: boolean
}

const meta: Meta<typeof CheckboxField> = {
  title: 'Components/Forms/CheckboxField',
  component: CheckboxField,
  parameters: {
    docs: {
      description: {
        component: 'Checkbox field component with form validation support using react-hook-form.',
      },
    },
  },
  decorators: [
    Story => (
      <View className="p-4 bg-background-primary flex-1">
        <Story />
      </View>
    ),
  ],
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the checkbox interaction',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message to display',
    },
    labelKey: {
      control: { type: 'text' },
      description: 'Translation key for the label',
    },
    name: {
      control: { type: 'text' },
      description: 'Form field name',
    },
    testID: {
      control: { type: 'text' },
      description: 'Test identifier',
    },
  },
}

export default meta

type Story = StoryObj<typeof CheckboxField>

const FormWrapper = ({
  name = 'termsAccepted',
  labelKey = 'I agree to the terms and conditions',
  error,
  disabled = false,
  onPressLabel,
  testID,
}: {
  name?: keyof FormData
  labelKey?: string
  error?: string
  disabled?: boolean
  onPressLabel?: () => void
  testID?: string
}) => {
  const { control } = useForm<FormData>({
    defaultValues: {
      termsAccepted: false,
      marketingEmails: true,
      dataProcessing: false,
      newsletter: false,
    },
  })

  return (
    <CheckboxField
      control={control}
      name={name}
      labelKey={labelKey}
      disabled={disabled}
      {...(error && { error })}
      {...(onPressLabel && { onPressLabel })}
      {...(testID && { testID })}
    />
  )
}

export const Default: Story = {
  render: () => <FormWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Basic checkbox field with form integration.',
      },
    },
  },
}

export const Checked: Story = {
  render: () => <FormWrapper name="marketingEmails" labelKey="Subscribe to marketing emails" />,
  parameters: {
    docs: {
      description: {
        story: 'Checkbox field in checked state (default value is true).',
      },
    },
  },
}

export const WithError: Story = {
  render: () => (
    <FormWrapper
      labelKey="I agree to the privacy policy"
      error="You must accept the privacy policy to continue"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Checkbox field with validation error message.',
      },
    },
  },
}

export const Disabled: Story = {
  render: () => <FormWrapper labelKey="This option is currently unavailable" disabled={true} />,
  parameters: {
    docs: {
      description: {
        story: 'Disabled checkbox field that cannot be interacted with.',
      },
    },
  },
}

export const LongLabel: Story = {
  render: () => (
    <FormWrapper labelKey="I agree to the very long terms and conditions that may span multiple lines and test the text wrapping behavior of the component" />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Checkbox field with long label text to test wrapping.',
      },
    },
  },
}

export const ClickableLabel: Story = {
  render: () => (
    <FormWrapper
      labelKey="Click this label to open terms"
      onPressLabel={() => Alert.alert('Label Clicked', 'Terms and conditions would open here')}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Checkbox field with clickable label that triggers an action.',
      },
    },
  },
}

export const MultipleCheckboxes: Story = {
  render: () => {
    const { control } = useForm<FormData>({
      defaultValues: {
        termsAccepted: false,
        marketingEmails: true,
        dataProcessing: false,
        newsletter: false,
      },
    })

    const checkboxes = [
      {
        name: 'termsAccepted' as keyof FormData,
        labelKey: 'I agree to the terms and conditions',
      },
      {
        name: 'marketingEmails' as keyof FormData,
        labelKey: 'Send me marketing emails',
      },
      {
        name: 'dataProcessing' as keyof FormData,
        labelKey: 'Allow data processing for analytics',
        error: 'This field is required for service functionality',
      },
      {
        name: 'newsletter' as keyof FormData,
        labelKey: 'Subscribe to weekly newsletter',
      },
    ]

    return (
      <View className="gap-4">
        {checkboxes.map((checkbox, index) => {
          const onPressLabel =
            checkbox.name === 'termsAccepted'
              ? () => Alert.alert('Terms', 'Would open terms and conditions')
              : undefined

          return (
            <CheckboxField
              key={checkbox.name}
              control={control}
              name={checkbox.name}
              labelKey={checkbox.labelKey}
              testID={`checkbox-${index}`}
              {...(checkbox.error && { error: checkbox.error })}
              {...(onPressLabel && { onPressLabel })}
            />
          )
        })}
      </View>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Multiple checkbox fields in a form with various states and errors.',
      },
    },
  },
}

export const AllStates: Story = {
  render: () => {
    const { control } = useForm({
      defaultValues: {
        normal: false,
        checked: true,
        error: false,
        disabled: false,
      },
    })

    return (
      <View className="gap-4">
        <View>
          <CheckboxField control={control} name="normal" labelKey="Normal unchecked state" />
        </View>

        <View>
          <CheckboxField control={control} name="checked" labelKey="Checked state" />
        </View>

        <View>
          <CheckboxField
            control={control}
            name="error"
            labelKey="With error state"
            error="This field has an error"
          />
        </View>

        <View>
          <CheckboxField
            control={control}
            name="disabled"
            labelKey="Disabled state"
            disabled={true}
          />
        </View>
      </View>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'All possible states of the checkbox field in one view.',
      },
    },
  },
}

export const Playground: Story = {
  render: (args: any) => {
    const { name, labelKey, disabled, testID, error, onPressLabel } = args
    return (
      <FormWrapper
        name={name as keyof FormData}
        labelKey={labelKey}
        disabled={disabled}
        {...(error && { error })}
        {...(onPressLabel && { onPressLabel })}
        {...(testID && { testID })}
      />
    )
  },
  args: {
    name: 'termsAccepted',
    labelKey: 'I agree to the terms and conditions',
    disabled: false,
    error: '',
    testID: 'playground-checkbox',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all props and configurations.',
      },
    },
  },
}
