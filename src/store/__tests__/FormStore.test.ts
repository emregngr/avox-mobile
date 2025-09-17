import useFormStore, { clearForm, setFormValues } from '@/store/form'

beforeEach(() => {
  clearForm()
})

describe('useFormStore', () => {
  it('should have the correct initial state', () => {
    const { formValues } = useFormStore.getState()
    expect(formValues).toEqual({
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      privacyPolicy: false,
      termsOfUse: false,
    })
  })

  it('should update form values with setFormValues', () => {
    setFormValues({
      email: 'test@example.com',
      firstName: 'John',
      privacyPolicy: true,
    })

    const { formValues } = useFormStore.getState()

    expect(formValues).toEqual({
      email: 'test@example.com',
      firstName: 'John',
      lastName: '',
      password: '',
      privacyPolicy: true,
      termsOfUse: false,
    })
  })

  it('should reset form values with clearForm', () => {
    setFormValues({
      email: 'beforeclear@example.com',
      firstName: 'Jane',
      termsOfUse: true,
    })

    clearForm()

    const { formValues } = useFormStore.getState()
    expect(formValues).toEqual({
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      privacyPolicy: false,
      termsOfUse: false,
    })
  })
})
