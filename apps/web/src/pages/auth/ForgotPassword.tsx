import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/common/Logo';

export function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [ isLoading, setIsLoading ] = useState( false );
    const [ isSubmitted, setIsSubmitted ] = useState( false );
    const [ email, setEmail ] = useState( '' );

    const handleSubmit = async ( e: React.FormEvent ) => {
        e.preventDefault();
        setIsLoading( true );

        // Simulate API call
        await new Promise( ( resolve ) => setTimeout( resolve, 1000 ) );

        setIsLoading( false );
        setIsSubmitted( true );
    };

    const handleResend = async () => {
        setIsLoading( true );
        await new Promise( ( resolve ) => setTimeout( resolve, 1000 ) );
        setIsLoading( false );
    };

    return (
        <div className="flex min-h-screen bg-background">
            {/* Left side - Form */}
            <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="mx-auto w-full max-w-sm">
                    <div className="mb-8">
                        <Logo />
                    </div>

                    {!isSubmitted ? (
                        <>
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
                            >
                                <ArrowLeft className="size-4" />
                                Back to login
                            </Link>

                            <h1 className="text-2xl font-bold tracking-tight text-foreground">Forgot your password?</h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                No worries, we&apos;ll send you reset instructions.
                            </p>

                            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-foreground">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={( e ) => setEmail( e.target.value )}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                                    {isLoading ? 'Sending...' : 'Send reset link'}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-success/10">
                                <CheckCircle className="size-8 text-success" />
                            </div>

                            <h1 className="text-2xl font-bold tracking-tight text-foreground">Check your email</h1>
                            <p className="mt-2 text-sm text-muted-foreground">We sent a password reset link to</p>
                            <p className="mt-1 font-medium text-foreground">{email}</p>

                            <div className="mt-8 space-y-4">
                                <Button onClick={() => navigate( '/login' )} className="w-full" size="lg">
                                    Back to login
                                </Button>

                                <p className="text-sm text-muted-foreground">
                                    Didn&apos;t receive the email?{' '}
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        disabled={isLoading}
                                        className="font-medium text-primary hover:text-primary/80 disabled:opacity-50"
                                    >
                                        {isLoading ? 'Sending...' : 'Click to resend'}
                                    </button>
                                </p>
                            </div>

                            <div className="mt-8 rounded-xl bg-muted p-4">
                                <p className="text-xs text-muted-foreground">
                                    <strong className="text-foreground">Tip:</strong> If you don&apos;t see the email,
                                    check your spam folder. The link will expire in 1 hour.
                                </p>
                            </div>
                        </div>
                    )}

                    <p className="mt-8 text-center text-sm text-muted-foreground">
                        Remember your password?{' '}
                        <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right side - Decorative */}
            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-muted">
                <div className="max-w-md px-8 text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="relative">
                            <div className="size-32 rounded-3xl bg-primary/10 flex items-center justify-center">
                                <svg
                                    className="size-16 text-primary"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                                    />
                                </svg>
                            </div>
                            <div className="absolute -bottom-2 -right-2 size-16 rounded-2xl bg-warning/20 flex items-center justify-center">
                                <svg
                                    className="size-8 text-warning"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Reset Your Password</h2>
                    <p className="mt-4 text-muted-foreground">
                        Enter your email address and we&apos;ll send you a link to reset your password and get back to
                        learning.
                    </p>
                    <div className="mt-8 space-y-3 text-left">
                        <div className="flex items-start gap-3 rounded-lg bg-background/50 p-3">
                            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                                1
                            </div>
                            <p className="text-sm text-muted-foreground">Enter your registered email address</p>
                        </div>
                        <div className="flex items-start gap-3 rounded-lg bg-background/50 p-3">
                            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                                2
                            </div>
                            <p className="text-sm text-muted-foreground">Check your inbox for the reset link</p>
                        </div>
                        <div className="flex items-start gap-3 rounded-lg bg-background/50 p-3">
                            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                                3
                            </div>
                            <p className="text-sm text-muted-foreground">Create a new secure password</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
