"use client"
import { CgSpinnerTwo } from "react-icons/cg";
/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable react-hooks/rules-of-hooks */
import React, { useActionState } from 'react'
import { UserFormState } from "./RegisterForm";

const AppForm = ({
    inputs, action }: {
        inputs: any[]
        action: any
    }) => {
    const initialState: UserFormState = {
        message: undefined,
        errors: [],
        error: undefined,
        loading: false
    }
    const [formState, formAction] = useActionState(
        action,
        initialState
    )
    return (
        <form
            action={formAction}
            onSubmit={() => {
                formState.message = ""
                formState.error = undefined
                formState.loading = true
            }}
            className="bg-white p-6 rounded shadow-md w-96" >
            <h1 className="text-2xl font-bold text-primary mb-4">Register</h1>
            {
                formState?.error && <p className="text-red-500 text-lg">
                    {formState?.error}
                </p>
            }
            <p className="text-green-400">{formState.message}</p>
            {
                !formState.loading
                    ? inputs.map(formInput => {
                        return <UserFormInput key={formInput.name} {...formInput} error={formState?.errors![formInput?.name]} />
                    })
                    : <div className="flex justify-center py-8 items-center w-full">
                        <CgSpinnerTwo className="animate-spin text-3xl" />
                        <p className="my-auto px-4">Creating account...</p>
                    </div>
            }
            <button
                type="submit" disabled={formState.loading} className={`
                    w-full 
                    ${formState.loading
                        ? `bg-gray-900 hover:bg-gray-800 
                            cursor-not-allowed hidden`
                        : `bg-indigo-600 hover:bg-indigo-800 
                            cursor-pointer`
                    } mt-4 text-white py-2 rounded hover:bg-primary-dark btn btn-primary`}>
                <i className="fa fa-user glyphicon glyphicon" />
                {!formState.loading
                    ? 'Register'
                    : "Loading..."}
            </button>
        </form >
    );
};

interface UserFormInputProps {
    name: string,
    placeholder: string,
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
            id={name} name={name} placeholoder={placeholder} type={type} />
    </fieldset>
}
export default AppForm;