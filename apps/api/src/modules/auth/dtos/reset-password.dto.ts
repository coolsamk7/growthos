import { Type } from 'typebox';

export const ResetPasswordRequest = Type.Object( {
    oldPassword: Type.String( { minLength: 8 } ),
    newPassword: Type.String( { minLength: 8 } ),
} );

export const ResetPasswordResponse = Type.Object( {
    message: Type.String(),
} );
