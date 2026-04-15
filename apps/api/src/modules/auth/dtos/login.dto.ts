import Type from 'typebox';

export const LoginRequest = Type.Object( {
    email: Type.String( { format: 'email' } ),
    password: Type.String( { minLength: 1 } )
} );

export const LoginResponse = Type.Object( {
    message: Type.String(),
    accessToken: Type.String(),
    refreshToken: Type.String(),
    user: Type.Object( {
        id: Type.String(),
        email: Type.String(),
        firstName: Type.Optional( Type.String() ),
        lastName: Type.Optional( Type.String() ),
        role: Type.String(),
        status: Type.String()
    } )
} );
