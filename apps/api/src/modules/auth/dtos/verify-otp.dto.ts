import { Type } from 'typebox';

export const VerifyOtpRequest = Type.Object( {
    sessionId: Type.String(),
    otp: Type.String( { minLength: 6, maxLength: 6 } ),
    email: Type.String( { format: 'email' } )
} );

export const VerifyOtpResponse = Type.Object( {
    message: Type.String(),
} );
