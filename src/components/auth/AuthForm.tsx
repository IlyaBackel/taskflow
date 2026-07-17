import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, registerSchema, type LoginFormData, type RegisterFormData } from '../../schemas/auth.schema';
import Input from '../shared/Input';
import GoogleSignInButton from './GoogleOAuthButton';

interface AuthFormProps {
    mode: 'login' | 'register';
    onSubmit: (data: LoginFormData | RegisterFormData) => void | Promise<void>;
    isLoading?: boolean;
    error?: string | null;
}

export default function AuthForm({
    mode,
    onSubmit,
    isLoading = false,
    error,
}: AuthFormProps) {
    const schema = mode === 'login' ? loginSchema : registerSchema;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData | RegisterFormData>({
        resolver: zodResolver(schema),
    });

    const buttonText = mode === 'login' ? 'Sign In' : 'Sign Up';

    return (
        <div className="flex flex-col gap-6 w-full">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
                {error && (
                    <div className="p-3 text-sm   border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-md">
                        {error}
                    </div>
                )}

                {mode === 'register' && (
                    <Input
                        label="Full Name"
                        type="text"
                        placeholder="Your full name"
                        {...register('name')}
                        error={(errors as any).name?.message}
                    />
                )}

                <Input
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    {...register('email')}
                    error={errors.email?.message}
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    {...register('password')}
                    error={errors.password?.message}
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 sm:py-3.5 px-4 text-base sm:text-lg font-medium rounded-2xl shadow-lg transition-colors duration-200 bg-primary hover:bg-primary-hover text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Loading...' : buttonText}
                </button>
            </form>

            <div className="flex flex-col items-center gap-3">
                <p className="text-sm sm:text-base text-secondary-text">Sign in with</p>
                <GoogleSignInButton />
            </div>
        </div>
    );
}