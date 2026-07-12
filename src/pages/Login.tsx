import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import AuthForm from '../components/auth/AuthForm';
import type { AuthFormData } from '../schemas/auth.schema';

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
            // Перенаправляем на страницу с досками
            navigate('/boards');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h1 className="text-center text-3xl font-bold text-gray-900">
                        TaskFlow
                    </h1>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Sign in to manage your tasks
                    </p>
                </div>

                <AuthForm
                    mode="login"
                    onSubmit={handleLogin}
                    isLoading={isLoading}
                    error={error}
                />

                <p className="text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}