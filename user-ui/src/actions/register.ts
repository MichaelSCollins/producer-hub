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
        return Object.assign(state, {
            message: 'Invalid input.',
            errors,
            loading: false
        })
    }
    return await api.register(
        validatedFormData
    ).catch((e: any) => {
        return Object.assign(state, {
            message: 'Registration Failed....',
            error: "An error occurred while registering: " + e.message,
            loading: false
        })
    }).then((response) => {
        return Object.assign(state, {
            message: response.data.username + "... Account created!",
            loading: false,
            errors: {},
            error: undefined
        })
    })
}

export default registerAction