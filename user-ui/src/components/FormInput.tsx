import React from "react";

interface FormInputProps {
    label: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<FormInputProps> = ({ label, type, value, onChange }) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                type={type}
                placeholoder={value?.toString()}
                onChange={onChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            />
        </div>
    );
};

export default FormInput;
