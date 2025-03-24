
interface Validation {
    isValid: boolean,
    message?: string
}
export const projectValidator = {
    validateProject: (projectName?: string): Validation => {
        if (!projectName)
        {
            return {
                isValid: false,
                message: 'Please enter a project name'
            }
        }
        return {
            isValid: true,
            message: 'Project is valid'
        };
    },
}