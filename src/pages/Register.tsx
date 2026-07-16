import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import AuthForm from '../components/auth/AuthForm';
import type { AuthFormData } from '../schemas/auth.schema';

export default function Register() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleRegister = async (data: AuthFormData) => {
        setIsLoading(true);
        setError(null);

        const { data: authData, error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                emailRedirectTo: `${window.location.origin}/login`,
            },
        });

        if (error) {
            setError(error.message);
            setIsLoading(false);
            return;
        }

        if (authData.user) {
            if (authData.user.identities?.length === 0) {
                setError('User already exists');
                setIsLoading(false);
                return;
            }
            navigate('/boards');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">

                <h2 className="text-center font-semibold text-2xl text-primary-text">Sign Up</h2>

                <h1 className='text-start text-primary-text text-3xl'>Create Account</h1>

                <p className='text-lg font-light text-secondary-text'>Please Inter your Informatioin and create your account</p>


                <AuthForm
                    mode="register"
                    onSubmit={handleRegister}
                    isLoading={isLoading}
                    error={error}
                />

                <p className="text-center text-lg text-gray-600">
                    Have an Account?{' '}
                    <Link to="/login" className="text-primary hover:text-primary-hover font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}