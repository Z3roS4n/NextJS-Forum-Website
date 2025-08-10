"use client"

import { ReactEventHandler, ReactNode } from "react";

interface InputParams {
    label: string;
    type?: 'text' | 'password' | 'textarea' | 'number';
    readOnly?: boolean;
    default?: string | number;
    onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    maxLength?: number;
}

const InputComponent = ({ label, type = 'text', readOnly = false, default: defaultValue = `Enter ${label}...`, onChange, maxLength }: InputParams) => {
    const id = `${label}-${type}`;

    const InputTypes: Record<string, ReactNode> = {
        'textarea': <textarea id={id}
                        defaultValue={defaultValue}
                        onChange={(event) => onChange && onChange(event)}
                        className="input lg:w-1/1 resize-none h-30" maxLength={maxLength}
                    />,   

        'text': <input id={id}
                    defaultValue={!readOnly ? defaultValue : ''}
                    onChange={(event) => onChange && onChange(event)}
                    className="input lg:w-1/1" 
                    maxLength={128}
                    readOnly={readOnly}
                />,
    }

    return (
        <>
            <div className="flex flex-col w-1/1">
                <label htmlFor={id} className="font-bold text-lg">{label}</label>
                { InputTypes[type] }
            </div>   
        </>
    )
}

export default InputComponent;