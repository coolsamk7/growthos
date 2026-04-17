const OTP_SESSION_ID_KEY = 'otpSessionId';
const OTP_EMAIL_ID_KEY = 'otpEmailId';

export const otpSessionStorage = {
    setOtpSessionData( sessionId: string, email?: string ) {
        localStorage.setItem( OTP_SESSION_ID_KEY, sessionId );
        if ( email ) {
            localStorage.setItem( OTP_EMAIL_ID_KEY, email );
        }
    },

    getOtpSessionId(): string | null {
        return localStorage.getItem( OTP_SESSION_ID_KEY );
    },

    getOtpSessionEmail(): string | null {
        return localStorage.getItem( OTP_EMAIL_ID_KEY );
    },

    clearSessionData() {
        localStorage.removeItem( OTP_EMAIL_ID_KEY );
        localStorage.removeItem( OTP_SESSION_ID_KEY );
    },
};
