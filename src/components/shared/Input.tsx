import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-2 w-full">
                <label className="text-sm sm:text-lg ml-3 font-medium text-primary-text">
                    {label}
                </label>
                <input
                    ref={ref}
                    className={`border text-sm sm:text-lg rounded-2xl px-3 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary ${error ? 'border-red-500' : 'border-gray-300'}`}
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