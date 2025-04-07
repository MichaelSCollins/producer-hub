/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";
import { UserFormState } from "@/lib/interfaces";
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
    inputNames: string[],
) => {
    inputNames.forEach((name) => {
        if (!processFormValue(name, formData))
        {
            errors[name] = {
                name,
                message: '' + name + ' is required.'
            }
            hasFailed = true;
        }
    })
    if (processedFormData['password']
        != processedFormData['confirmPassword'])
    {
        errors['password'] = 'Passwords do not match.'
        errors['confirmPassword'] = 'Passwords do not match.'
        hasFailed = true;
    }
}

const registerAction = async (formData: FormData) => {
    const state: UserFormState = {
        message: undefined,
        errors: {},
        error: undefined,
        loading: false
    }
    errors = {};
    hasFailed = false;
    processFormData(
        formData,
        ['email', 'password', 'confirmPassword', 'username'],
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
        const { user: { username } } = await api.register(processedFormData)
        return {
            ...state,
            message: username + " successfully registered",
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

export default registerAction