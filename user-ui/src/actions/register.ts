/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";
import { UserFormState } from "@/lib/interfaces";
import api from "@/lib/api/api";
const validatedFormData: any = {}
let errors: any = {}
let hasFailed = false;
const validateInput = (name: string, formData: FormData) => {
    if (!formData.get(name))
        return undefined
    const value = formData.get(name)?.valueOf()
    validatedFormData[name] = value
    return value;
}

const validateFormData = (
    formData: FormData,
    inputNames: string[],
) => {
    inputNames.forEach((name) => {
        if (!validateInput(name, formData))
        {
            errors[name] = {
                name,
                message: name + ' is required.'
            }
            hasFailed = true;
        }
    })
    if (validatedFormData['password']
        != validatedFormData['confirmPassword'])
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
    validateFormData(
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
        const { user: { username } } = await api.register(validatedFormData)
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