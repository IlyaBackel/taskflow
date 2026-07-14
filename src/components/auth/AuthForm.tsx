import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authSchema, type AuthFormData } from '../../schemas/auth.schema';
import Input from '../shared/Input';
import GoogleSignInButton from './GoogleOAuthButton';

interface AuthFormProps {
    mode: 'login' | 'register';
    onSubmit: (data: AuthFormData) => void | Promise<void>;
    isLoading?: boolean;
    error?: string | null;
}

export default function AuthForm({
    mode,
    onSubmit,
    isLoading = false,
    error,
}: AuthFormProps) {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AuthFormData>({
        resolver: zodResolver(authSchema),
    });

    const title = mode === 'login' ? 'Sign In' : 'Create Account';
    const buttonText = mode === 'login' ? 'Sign In' : 'Sign Up';

    return (
        <div className='flex flex-col gap-4 mx-auto'>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-center">{title}</h2>

                {error && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <Input
                    label="Email"
                    type="email"
                    placeholder="your@email.com"
                    {...register('email')}
                    error={errors.email?.message}
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                    error={errors.password?.message}
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Loading...' : buttonText}
                </button>

            </form>
            <GoogleSignInButton />
        </div>
    );
}