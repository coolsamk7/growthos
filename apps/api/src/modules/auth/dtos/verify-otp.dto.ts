import { Type } from 'typebox';

export const VerifyOtpRequest = Type.Object( {
    userId: Type.String(),
    otp: Type.String( { minLength: 6, maxLength: 6 } ),
} );

export const VerifyOtpResponse = Type.Object( {
    message: Type.String(),
} );
