import { create } from 'zustand'

type RegisterFormValues = {
  email: string
  firstName: string
  lastName: string
  password: string
  privacyPolicy: boolean
  termsOfUse: boolean
}

export type FormStateType = {
  formValues: Partial<RegisterFormValues>
}

export type FormActions = {
  clearForm: () => void
  setFormValues: (values: Partial<RegisterFormValues>) => void
}

const useFormStore = create<FormStateType & FormActions>(set => ({
  clearForm: () =>
    set({
      formValues: {
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        privacyPolicy: false,
        termsOfUse: false,
      },
    }),
  formValues: {
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    privacyPolicy: false,
    termsOfUse: false,
  },
  setFormValues: values => set(state => ({ formValues: { ...state.formValues, ...values } })),
}))

export const { clearForm, formValues, setFormValues } = useFormStore.getState()

export default useFormStore
