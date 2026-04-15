import { Type } from 'typebox';

export const ForgotPasswordResetRequest = Type.Object( {
    email: Type.String( { format: 'email' } ),
    otp: Type.String( { minLength: 6, maxLength: 6 } ),
    newPassword: Type.String( { minLength: 8 } ),
} );

export const ForgotPasswordResetResponse = Type.Object( {
    message: Type.String(),
} );
