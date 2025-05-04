/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import api from "@/lib/api/api";
import { UserFormState } from "@/lib/interfaces";

const validatedInputData: any = {}

let errors: any = {}
let hasFailed = false;

const validateInput = (name: string, formData: FormData) => {
    const inputValue = formData.get(name)?.valueOf()
    if (!inputValue)
        return undefined
    validatedInputData[name] = inputValue
    return inputValue;
}

const validateFormData = (
    formData: FormData,
    inputs: any[],
) => {
    inputs.forEach((name) => {
        if (!validateInput(name, formData))
        {
            errors[name] = '' + name + ' is required.'
            hasFailed = true;
        }
    })
}

const loginAction = async (state: UserFormState, formData: FormData) => {
    errors = {};
    hasFailed = false;
    validateFormData(
        formData,
        ['username', 'password'],
    )
    if (hasFailed)
    {
        return {
            ...state,
            message: 'Failed to process user input.',
            errors,
            loading: false
        }
    }
    try
    {
        const response = await api.login(validatedInputData)
        return {
            ...state,
            message: JSON.stringify(response),
            loading: false
        }
    } catch (e: any)
    {
        return {
            ...state,
            message: '',
            error: "An error occurred while registering: " + e.message,
            loading: false
        }
    }
}

export default loginAction