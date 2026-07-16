import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authSchema, type AuthFormData } from '../../schemas/auth.schema';
import Input from '../shared/Input';
import GoogleOAuthButton from './GoogleOAuthButton';

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

    const buttonText = mode === 'login' ? 'Sign In' : 'Sign Up';

    return (
        <div className='flex flex-col gap-10 mx-auto'>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full max-w-md mx-auto items-center">

                {error && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <Input
                    label="Email"
                    type="email"
                    placeholder="Enter your mail"
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
                    className="bg-primary w-[40%] sm:w-[50%] py-2 text-white sm:py-4 rounded-2xl text-md sm:text-xl hover:bg-primary-hover shadow-[#4e4c7d] shadow-lg  transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Loading...' : buttonText}
                </button>

            </form>

            <div className='flex flex-col items-center gap-4'>
                <p className='text-center text-sm sm:text-lg text-primary-text'>Sign in with</p>
                <GoogleOAuthButton />
            </div>
        </div>
    );
}