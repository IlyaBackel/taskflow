import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1 w-full">
                {label && <label className="text-sm font-medium text-primary-text">{label}</label>}
                <input
                    ref={ref}
                    className={`w-full px-3 py-2 rounded-lg border ${error ? 'border-red-500' : 'border-border-primary'} text-primary-text placeholder-placeholder focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${className}`}
                    {...props}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);

export default Input;