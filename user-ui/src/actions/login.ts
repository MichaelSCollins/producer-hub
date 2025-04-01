/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";
import { InputError, UserFormState } from "@/components/forms/RegisterForm";
import api from "@/lib/api/api";
const processedFormData: any = {}
let errors: any = {}
let hasFailed = false;
const processFormValue = (name: string, formData: FormData) => {
    if (!formData.get(name))
        return undefined
    const value = formData.get(name)?.valueOf()
    processedFormData[name] = value
    return value;
}

const processFormData = (
    formData: FormData,
    inputs: any[],
) => {
    inputs.forEach((name) => {
        if (!processFormValue(name, formData))
        {
            errors[name] = '' + name + ' is required.'
            hasFailed = true;
        }
    })
}

const loginAction = async (state: UserFormState, formData: FormData) => {
    errors = {};
    hasFailed = false;
    processFormData(
        formData,
        ['username', 'password'],
    )
    if (hasFailed)
    {
        return {
            ...state,
            message: '',
            errors,
            loading: false
        }
    }
    try
    {
        const response = await api.login(processedFormData)
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