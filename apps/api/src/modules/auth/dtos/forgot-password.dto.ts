import { Type } from 'typebox';

export const ForgotPasswordRequest = Type.Object( {
    email: Type.String( { format: 'email' } ),
} );

export const ForgotPasswordResponse = Type.Object( {
    message: Type.String(),
} );
