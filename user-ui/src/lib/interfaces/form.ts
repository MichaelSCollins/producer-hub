export interface UserInputControl {
    name: string,
    placeholder?: string,
    type: string,
    label: string,
    required?: boolean,
    error?: string | undefined,
    disabled?: boolean,
    autoComplete?: string,
    autoFocus?: boolean,
    defaultValue?: string,
    maxLength?: number,
    minLength?: number,
    pattern?: string,
    readOnly?: boolean,
    size?: number,
    spellCheck?: boolean,
    value?: string,
    className?: string
}
export interface InputError {
    inputName: string,
    message: string
}

export interface UserFormState {
    message?: string | undefined,
    error?: string | undefined,
    errors: { [key: string]: InputError },
    loading?: boolean
}