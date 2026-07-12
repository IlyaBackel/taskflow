import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-medium text-gray-700">
                    {label}
                </label>
                <input
                    ref={ref}
                    className={`border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
                    {...props}
                />
                {error && (
                    <p className="text-sm text-red-500 mt-1">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;