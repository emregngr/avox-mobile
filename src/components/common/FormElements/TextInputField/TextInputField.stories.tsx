import type { Meta, StoryObj } from '@storybook/react-native'
import { useForm } from 'react-hook-form'
import { Alert, View } from 'react-native'

import { TextInputField } from '@/components/common/FormElements/TextInputField'
import { useEffect } from 'react'

interface FormData {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber: string
  username: string
  confirmPassword: string
  description: string
}

const meta: Meta<typeof TextInputField> = {
  title: 'Components/Forms/TextInputField',
  component: TextInputField,
  parameters: {
    docs: {
      description: {
        component: 'Text input field component with form validation support using react-hook-form.',
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
    label: {
      control: { type: 'text' },
      description: 'Label text displayed above the input',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text shown when input is empty',
    },
    name: {
      control: { type: 'text' },
      description: 'Form field name',
    },
    keyboardType: {
      control: { type: 'select' },
      options: ['default', 'email-address', 'numeric', 'phone-pad', 'number-pad'],
      description: 'Keyboard type to display',
    },
    autoCapitalize: {
      control: { type: 'select' },
      options: ['none', 'sentences', 'words', 'characters'],
      description: 'Auto-capitalization behavior',
    },
    returnKeyType: {
      control: { type: 'select' },
      options: ['done', 'go', 'next', 'search', 'send'],
      description: 'Return key type',
    },
    secureTextEntry: {
      control: { type: 'boolean' },
      description: 'Whether to hide text input (for passwords)',
    },
    showToggle: {
      control: { type: 'boolean' },
      description: 'Show password visibility toggle (only works with secureTextEntry)',
    },
    editable: {
      control: { type: 'boolean' },
      description: 'Whether the input is editable',
    },
    autoCorrect: {
      control: { type: 'boolean' },
      description: 'Whether to enable auto-correction',
    },
    clearTextOnFocus: {
      control: { type: 'boolean' },
      description: 'Whether to clear text when focused',
    },
    testID: {
      control: { type: 'text' },
      description: 'Test identifier',
    },
  },
}

export default meta

type Story = StoryObj<typeof TextInputField>

const FormWrapper = ({
  name = 'email',
  label = 'Email Address',
  placeholder = 'Enter your email',
  keyboardType = 'default',
  autoCapitalize = 'none',
  returnKeyType = 'next',
  secureTextEntry = false,
  showToggle = false,
  editable = true,
  autoCorrect = false,
  clearTextOnFocus = false,
  testID,
  onSubmitEditing,
  defaultValue = '',
  withError = false,
  errorMessage = '',
}: {
  name?: keyof FormData
  label?: string
  placeholder?: string
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad'
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send'
  secureTextEntry?: boolean
  showToggle?: boolean
  editable?: boolean
  autoCorrect?: boolean
  clearTextOnFocus?: boolean
  testID?: string
  onSubmitEditing?: () => void
  defaultValue?: string
  withError?: boolean
  errorMessage?: string
}) => {
  const { control, setError } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      username: '',
      confirmPassword: '',
      description: '',
      [name]: defaultValue,
    },
  })

  useEffect(() => {
    if (withError && errorMessage) {
      setError(name as keyof FormData, {
        type: 'manual',
        message: errorMessage,
      })
    }
  }, [withError, errorMessage, name, setError])

  return (
    <TextInputField
      control={control}
      name={name}
      label={label}
      placeholder={placeholder}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      returnKeyType={returnKeyType}
      secureTextEntry={secureTextEntry}
      showToggle={showToggle}
      editable={editable}
      autoCorrect={autoCorrect}
      clearTextOnFocus={clearTextOnFocus}
      {...(testID && { testID })}
      {...(onSubmitEditing && { onSubmitEditing })}
    />
  )
}

export const Default: Story = {
  render: () => <FormWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Basic text input field with form integration.',
      },
    },
  },
}

export const Email: Story = {
  render: () => (
    <FormWrapper
      name="email"
      label="Email Address"
      placeholder="Enter your email"
      keyboardType="email-address"
      autoCapitalize="none"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Email input field with proper keyboard type and auto-capitalization.',
      },
    },
  },
}

export const Password: Story = {
  render: () => (
    <FormWrapper
      name="password"
      label="Password"
      placeholder="Enter your password"
      secureTextEntry={true}
      showToggle={true}
      returnKeyType="done"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Password input field with visibility toggle.',
      },
    },
  },
}

export const PasswordNoToggle: Story = {
  render: () => (
    <FormWrapper
      name="confirmPassword"
      label="Confirm Password"
      placeholder="Confirm your password"
      secureTextEntry={true}
      showToggle={false}
      returnKeyType="done"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Password input field without visibility toggle.',
      },
    },
  },
}

export const Numeric: Story = {
  render: () => (
    <FormWrapper
      name="phoneNumber"
      label="Phone Number"
      placeholder="Enter phone number"
      keyboardType="phone-pad"
      returnKeyType="done"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Numeric input field with phone pad keyboard.',
      },
    },
  },
}

export const WithError: Story = {
  render: () => (
    <FormWrapper
      name="email"
      label="Email Address"
      placeholder="Enter your email"
      keyboardType="email-address"
      defaultValue="invalid-email"
      withError={true}
      errorMessage="Please enter a valid email address"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Text input field with validation error message.',
      },
    },
  },
}

export const Disabled: Story = {
  render: () => (
    <FormWrapper
      name="username"
      label="Username (Disabled)"
      placeholder="This field is disabled"
      editable={false}
      defaultValue="john_doe"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Disabled text input field that cannot be edited.',
      },
    },
  },
}

export const LongText: Story = {
  render: () => (
    <FormWrapper
      name="description"
      label="Description"
      placeholder="Enter a detailed description..."
      autoCapitalize="sentences"
      returnKeyType="done"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Text input field for longer text with sentence capitalization.',
      },
    },
  },
}

export const WithSubmitAction: Story = {
  render: () => (
    <FormWrapper
      name="firstName"
      label="First Name"
      placeholder="Enter your first name"
      autoCapitalize="words"
      returnKeyType="next"
      onSubmitEditing={() => Alert.alert('Submit', 'Next field would be focused')}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Text input field with submit action on return key press.',
      },
    },
  },
}

export const MultipleInputs: Story = {
  render: () => {
    const { control } = useForm<FormData>({
      defaultValues: {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        username: '',
        confirmPassword: '',
        description: '',
      },
    })

    const inputs = [
      {
        name: 'firstName' as keyof FormData,
        label: 'First Name',
        placeholder: 'Enter your first name',
        autoCapitalize: 'words' as const,
      },
      {
        name: 'lastName' as keyof FormData,
        label: 'Last Name',
        placeholder: 'Enter your last name',
        autoCapitalize: 'words' as const,
      },
      {
        name: 'email' as keyof FormData,
        label: 'Email Address',
        placeholder: 'Enter your email',
        keyboardType: 'email-address' as const,
        autoCapitalize: 'none' as const,
      },
      {
        name: 'phoneNumber' as keyof FormData,
        label: 'Phone Number',
        placeholder: 'Enter phone number',
        keyboardType: 'phone-pad' as const,
      },
      {
        name: 'password' as keyof FormData,
        label: 'Password',
        placeholder: 'Enter password',
        secureTextEntry: true,
        showToggle: true,
        returnKeyType: 'done' as const,
      },
    ]

    return (
      <View className="gap-4">
        {inputs.map((input, index) => (
          <TextInputField
            key={input.name}
            control={control}
            name={input.name}
            label={input.label}
            placeholder={input.placeholder}
            testID={`input-${index}`}
            keyboardType={input.keyboardType || 'default'}
            autoCapitalize={input.autoCapitalize || 'none'}
            returnKeyType={input.returnKeyType || 'next'}
            secureTextEntry={input.secureTextEntry || false}
            showToggle={input.showToggle || false}
          />
        ))}
      </View>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Multiple text input fields in a form with various configurations.',
      },
    },
  },
}

export const AllStates: Story = {
  render: () => {
    const { control, setError } = useForm({
      defaultValues: {
        normal: '',
        withValue: 'Filled value',
        error: 'invalid@email',
        disabled: 'Disabled value',
        password: '',
      },
    })

    useEffect(() => {
      setError('error', {
        type: 'manual',
        message: 'Invalid email format',
      })
    }, [setError])

    return (
      <View className="gap-4">
        <View>
          <TextInputField
            control={control}
            name="normal"
            label="Normal empty state"
            placeholder="Type here..."
          />
        </View>

        <View>
          <TextInputField
            control={control}
            name="withValue"
            label="With value"
            placeholder="This has a value"
          />
        </View>

        <View>
          <TextInputField
            control={control}
            name="error"
            label="With error state"
            placeholder="Email with error"
            keyboardType="email-address"
          />
        </View>

        <View>
          <TextInputField
            control={control}
            name="disabled"
            label="Disabled state"
            placeholder="Can't edit this"
            editable={false}
          />
        </View>

        <View>
          <TextInputField
            control={control}
            name="password"
            label="Password with toggle"
            placeholder="Enter password"
            secureTextEntry={true}
            showToggle={true}
          />
        </View>
      </View>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'All possible states of the text input field in one view.',
      },
    },
  },
}

export const Playground: Story = {
  render: (args: any) => {
    const {
      name,
      label,
      placeholder,
      keyboardType,
      autoCapitalize,
      returnKeyType,
      secureTextEntry,
      showToggle,
      editable,
      autoCorrect,
      clearTextOnFocus,
      testID,
    } = args

    return (
      <FormWrapper
        name={name as keyof FormData}
        label={label}
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        returnKeyType={returnKeyType}
        secureTextEntry={secureTextEntry}
        showToggle={showToggle}
        editable={editable}
        autoCorrect={autoCorrect}
        clearTextOnFocus={clearTextOnFocus}
        {...(testID && { testID })}
      />
    )
  },
  args: {
    name: 'email',
    label: 'Email Address',
    placeholder: 'Enter your email',
    keyboardType: 'email-address',
    autoCapitalize: 'none',
    returnKeyType: 'next',
    secureTextEntry: false,
    showToggle: false,
    editable: true,
    autoCorrect: false,
    clearTextOnFocus: false,
    testID: 'playground-input',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all props and configurations.',
      },
    },
  },
}
