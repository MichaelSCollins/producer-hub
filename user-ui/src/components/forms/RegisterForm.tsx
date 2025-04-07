"use client"
import { CgSpinnerTwo } from "react-icons/cg";
import React, { useActionState, useRef } from 'react'
import registerAction from "@/actions/register";
import { UserFormState, UserInputControl } from "@/lib/interfaces";

const formInputData: UserInputControl[] = [{
    name: 'username',
    placeholder: '',
    type: 'username',
    label: 'Producer/Musician/DJ Name:',
    required: true
}, {
    name: 'email',
    placeholder: '',
    type: 'email',
    label: 'Producer Email:',
    required: true
}, {
    name: 'password',
    placeholder: '',
    type: 'password',
    label: 'Password:',
    required: true
}, {
    name: 'confirmPassword',
    placeholder: '',
    type: 'password',
    label: 'Confirm Password:'
}]


const RegisterForm: React.FC = () => {
    const formRef = useRef<HTMLFormElement>(null)
    const initialState: UserFormState = {
        message: undefined,
        errors: {},
        error: undefined,
        loading: false
    }
    const [registrationState, formAction] = useActionState<UserFormState>(
        () => {
            const formData = new FormData(formRef.current!)
            return registerAction(formData);
        },
        initialState
    )
    return (
        <form
            action={formAction}
            ref={formRef}
            onSubmit={() => {
                registrationState.message = ""
                registrationState.error = undefined
                registrationState.loading = true
            }}
            className="bg-white p-6 rounded shadow-md w-96" >
            <h1 className="text-2xl font-bold text-primary mb-4">Register</h1>
            {
                registrationState?.error && <p className="text-red-500 text-lg">
                    {registrationState?.error}
                </p>
            }
            <p className="text-green-400">{registrationState.message}</p>
            {
                !registrationState.loading
                    ? formInputData.map(formInput => {
                        return <UserFormInput
                            key={formInput.name}
                            {...formInput}
                            error={registrationState.errors[formInput.name]?.message} />
                    })
                    : <div className="flex justify-center py-8 items-center w-full">
                        <CgSpinnerTwo className="animate-spin text-3xl" />
                        <p className="my-auto px-4">Creating account...</p>
                    </div>
            }
            <button
                type="submit" disabled={registrationState.loading} className={`
                    w-full 
                    ${registrationState.loading
                        ? `bg-gray-900 hover:bg-gray-800 
                            cursor-not-allowed hidden`
                        : `bg-indigo-600 hover:bg-indigo-800 
                            cursor-pointer`
                    } mt-4 text-white py-2 rounded hover:bg-primary-dark btn btn-primary`}>
                <i className="fa fa-user glyphicon glyphicon" />
                {!registrationState.loading
                    ? 'Register'
                    : "Loading..."}
            </button>
        </form >
    );
};

interface UserFormInputProps {
    name: string,
    placeholder?: string,
    label: string,
    type: string,
    error?: string | undefined
}

const UserFormInput = ({
    name,
    placeholder,
    label,
    type,
    error
}: UserFormInputProps) => {
    return <fieldset className="flex flex-col p-1 justify-between *:text-nowrap hover:*:border-indigo-500">
        <label htmlFor={name}>{label}</label>
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <input
            className="bg-none p-1 border border-slate-900 rounded-lg"
            name={name} placeholoder={placeholder} type={type} />
    </fieldset>
}
export default RegisterForm;