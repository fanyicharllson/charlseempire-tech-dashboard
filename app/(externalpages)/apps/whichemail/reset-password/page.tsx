'use client';
import {useEffect, useState} from 'react';
import {Account, Client} from 'appwrite';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';

// 🔧 Setup Appwrite client
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const account = new Account(client);


// ✅ Updated Schema for password form (includes confirm password)
const schema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function ResetRedirectPage() {
    const [userId, setUserId] = useState('');
    const [secret, setSecret] = useState('');
    const [status, setStatus] = useState<'loading' | 'form' | 'success' | 'error'>('loading');
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<FormData>({resolver: zodResolver(schema)});

    // Extract userId + secret from URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const uid = params.get('userId');
        const sec = params.get('secret');
        if (uid && sec) {
            setUserId(uid);
            setSecret(sec);
            setStatus('form');
        } else {
            setStatus('error');
            setError('Invalid or expired link.');
        }
    }, []);

    const onSubmit = async (data: FormData) => {
        console.log(`Appwrite sec: ${secret} and userId: ${userId}`);
        try {
            await account.updateRecovery({
                userId: userId,
                secret: secret,
                password: data.password
            });
            setStatus('success');
            // Auto-open the WhichEmail app after a short delay
            setTimeout(() => {
                window.location.href = 'whichemail://(auth)/login';
            }, 3000);
        } catch (err: unknown) {
            console.error(err);
            setStatus('error');
            setError('This link may have expired. Please try again from the app.');
        }
    };

    // 💅 Modern Container Component with Gradient Background
    const Container = ({children}: { children: React.ReactNode }) => (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-slate-800 text-white relative overflow-hidden">
            {/* Floating Background Elements for Wow Factor */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
                <div
                    className="absolute bottom-10 right-10 w-40 h-40 bg-blue-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>
            <div
                className="bg-white/95 backdrop-blur-lg text-slate-900 p-8 rounded-3xl shadow-2xl w-[90%] max-w-md text-center relative z-10 border border-white/20">
                {children}
            </div>
        </div>
    );

    if (status === 'loading') {
        return (
            <Container>
                <div className="flex flex-col items-center">
                    <div
                        className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="animate-pulse text-lg font-medium">Validating your link...</p>
                </div>
            </Container>
        );
    }

    if (status === 'error') {
        return (
            <Container>
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-4 text-red-600">Oops 😔</h2>
                    <p className="mb-6 text-slate-600">{error}</p>
                    <p className="text-sm text-slate-500">
                        Try requesting a new password reset from the WhichEmail app.
                    </p>
                </div>
            </Container>
        );
    }

    if (status === 'success') {
        return (
            <Container>
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-green-600">Password Reset Successful 🎉</h2>
                    <p className="text-slate-700 mb-2">
                        Opening <strong>WhichEmail</strong> automatically...
                    </p>
                    <p className="text-sm text-slate-500">
                        If nothing happens, return to the app manually.
                    </p>
                </div>
            </Container>
        );
    }

    // FORM
    return (
        <Container>
            <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                </div>
                <h1 className="text-3xl font-bold mb-2 text-blue-700">Welcome back to WhichEmail 💌</h1>
                <p className="text-sm text-slate-600 text-center leading-relaxed">
                    Built to solve a real problem: forgetting which email you used for different services.<br/>
                    Now you&apos;ll never have to worry about it again!
                </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
                <div>
                    <input
                        type="password"
                        placeholder="Enter new password"
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                        disabled={isSubmitting}
                        {...register('password')}
                        aria-label="New Password"
                    />
                    {errors.password?.message && (
                        <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                    )}
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                        disabled={isSubmitting}
                        {...register('confirmPassword')}
                        aria-label="Confirm New Password"
                    />
                    {errors.confirmPassword?.message && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center">
                            <div
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Resetting...
                        </div>
                    ) : (
                        'Reset Password'
                    )}
                </button>
            </form>
        </Container>
    );
}
