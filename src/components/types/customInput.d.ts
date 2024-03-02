export interface CustomInputProps {
  placeholder?: string
  label?: string
  labelClassName?: string
  inputClassName?: string
  errorClassName?: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  value: string
  children?: ReactNode
  error?: string
  isDisabled?: boolean
}
