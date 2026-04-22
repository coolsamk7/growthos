import Type from 'typebox';

export const RevokeTokenRequest = Type.Object( {
    refreshToken: Type.String( { minLength: 1 } )
} );

export const RevokeTokenResponse = Type.Object( {
    message: Type.String()
} );
