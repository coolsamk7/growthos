import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Mail, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/common/Logo';
import { toast } from 'sonner';

export function OTPPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || 'your email';

    const [ otp, setOtp ] = useState<string[]>( [ '', '', '', '', '', '' ] );
    const [ isLoading, setIsLoading ] = useState( false );
    const [ isResending, setIsResending ] = useState( false );
    const [ resendCooldown, setResendCooldown ] = useState( 0 );
    const [ error, setError ] = useState( '' );

    const inputRefs = useRef<( HTMLInputElement | null )[]>( [] );

    useEffect( () => {
        inputRefs.current[0]?.focus();
    }, [] );

    useEffect( () => {
        if ( resendCooldown > 0 ) {
            const timer = setTimeout( () => setResendCooldown( resendCooldown - 1 ), 1000 );
            return () => clearTimeout( timer );
        }
    }, [ resendCooldown ] );

    const handleChange = ( index: number, value: string ) => {
        if ( value.length > 1 ) {
            value = value[value.length - 1];
        }

        if ( value && !/^\d$/.test( value ) ) {
            return;
        }

        const newOtp = [ ...otp ];
        newOtp[index] = value;
        setOtp( newOtp );
        setError( '' );

        if ( value && index < 5 ) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = ( index: number, e: React.KeyboardEvent<HTMLInputElement> ) => {
        if ( e.key === 'Backspace' && !otp[index] && index > 0 ) {
            inputRefs.current[index - 1]?.focus();
        }

        if ( e.key === 'ArrowLeft' && index > 0 ) {
            inputRefs.current[index - 1]?.focus();
        }
        if ( e.key === 'ArrowRight' && index < 5 ) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = ( e: React.ClipboardEvent ) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData( 'text' ).replace( /\D/g, '' ).slice( 0, 6 );

        if ( pastedData ) {
            const newOtp = [ ...otp ];
            pastedData.split( '' ).forEach( ( char, index ) => {
                if ( index < 6 ) {
                    newOtp[index] = char;
                }
            } );
            setOtp( newOtp );

            const nextEmptyIndex = newOtp.findIndex( ( val ) => !val );
            inputRefs.current[nextEmptyIndex === -1 ? 5 : nextEmptyIndex]?.focus();
        }
    };

    const handleSubmit = async ( e: React.FormEvent ) => {
        e.preventDefault();

        const otpValue = otp.join( '' );
        if ( otpValue.length !== 6 ) {
            setError( 'Please enter the complete 6-digit code' );
            return;
        }

        setIsLoading( true );
        try {
        } catch ( error: any ) {
            toast.error( error.message || 'Error while verifying OTP' );
        } finally {
            setIsLoading( false );
        }
        setError( '' );


        setIsLoading( false );
        navigate( '/app/dashboard' );
    };

    const handleResend = async () => {
        setIsResending( true );

        await new Promise( ( resolve ) => setTimeout( resolve, 1000 ) );

        setIsResending( false );
        setResendCooldown( 120 );
        setOtp( [ '', '', '', '', '', '' ] );
        inputRefs.current[0]?.focus();
    };

    const isComplete = otp.every( ( digit ) => digit !== '' );

    return (
        <div className="flex min-h-screen bg-background">
            {/* Left side - Form */}
            <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="mx-auto w-full max-w-sm">
                    <div className="mb-8">
                        <Logo />
                    </div>

                    <button
                        onClick={() => navigate( '/signup' )}
                        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="size-4" />
                        Back to signup
                    </button>

                    <div className="mb-8 flex justify-center">
                        <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Mail className="size-8 text-primary" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-foreground text-center">Verify your email</h1>
                    <p className="mt-2 text-sm text-muted-foreground text-center">
                        We&apos;ve sent a 6-digit verification code to{' '}
                        <span className="font-medium text-foreground">{email}</span>
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8">
                        <div className="flex justify-center gap-2 sm:gap-3">
                            {otp.map( ( digit, index ) => (
                                <input
                                    key={index}
                                    ref={( el ) => {
                                        inputRefs.current[index] = el;
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    maxLength={1}
                                    value={digit}
                                    onChange={( e ) => handleChange( index, e.target.value )}
                                    onKeyDown={( e ) => handleKeyDown( index, e )}
                                    onPaste={handlePaste}
                                    className={`
                    size-12 sm:size-14 rounded-xl border-2 bg-background text-center text-xl font-semibold
                    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                    transition-all duration-200
                    ${error ? 'border-destructive' : digit ? 'border-primary' : 'border-border'}
                  `}
                                />
                            ) )}
                        </div>

                        {error && <p className="mt-4 text-sm text-destructive text-center">{error}</p>}

                        <Button type="submit" className="w-full mt-8" size="lg" disabled={isLoading || !isComplete}>
                            {isLoading ? 'Verifying...' : 'Verify email'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">Didn&apos;t receive the code?</p>
                        <Button
                            variant="ghost"
                            className="mt-2 text-primary"
                            onClick={handleResend}
                            disabled={isResending || resendCooldown > 0}
                        >
                            {isResending ? (
                                <>
                                    <RefreshCw className="size-4 mr-2 animate-spin" />
                                    Sending...
                                </>
                            ) : resendCooldown > 0 ? (
                                `Resend in ${resendCooldown}s`
                            ) : (
                                <>
                                    <RefreshCw className="size-4 mr-2" />
                                    Resend code
                                </>
                            )}
                        </Button>
                    </div>

                    <p className="mt-8 text-center text-xs text-muted-foreground">
                        Make sure to check your spam folder if you don&apos;t see the email
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
                                        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                                    />
                                </svg>
                            </div>
                            <div className="absolute -bottom-2 -right-2 size-12 rounded-xl bg-success/20 flex items-center justify-center">
                                <svg
                                    className="size-6 text-success"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Almost There!</h2>
                    <p className="mt-4 text-muted-foreground">
                        We just need to verify your email address to ensure the security of your account and protect
                        your learning progress.
                    </p>
                    <div className="mt-8 p-4 rounded-xl bg-background/50 border border-border">
                        <div className="flex items-start gap-3 text-left">
                            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg
                                    className="size-4 text-primary"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">Pro tip</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    You can paste the entire code at once - we&apos;ll automatically fill in all the
                                    boxes for you.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
