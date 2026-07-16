import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import AuthForm from '../components/auth/AuthForm';
import type { AuthFormData } from '../schemas/auth.schema';
import ThemeToggle from '../components/shared/ThemeToggle';

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (data: AuthFormData) => {
        setIsLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (error) {
            setError(error.message);
            setIsLoading(false);
        } else {
            navigate('/boards');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8 bg-primary-bg text-primary-text transition-colors duration-300">
            <div className="w-full max-w-md space-y-6 sm:space-y-8">

                <h2 className="text-center font-semibold text-lg sm:text-2xl text-primary-text">Sign In</h2>

                <h1 className='text-start text-primary-text text-xl sm:text-3xl'>Welcome Back</h1>

                <p className='font-light text-sm sm:text-lg text-secondary-text'>Please Inter your email address and password for Login</p>

                <AuthForm
                    mode="login"
                    onSubmit={handleLogin}
                    isLoading={isLoading}
                    error={error}
                />

                <ThemeToggle />

                <p className="text-center text-sm sm:text-lg text-gray-600">
                    Not Registrar Yet?{' '}
                    <Link to="/register" className="text-primary hover:text-primary-hover font-medium">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}