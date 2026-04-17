import { Type } from 'typebox'

export const SignupResponse = Type.Object( {
    message: Type.String( { example: 'User created successfully' } ),
    data: Type.Object( {
        userId: Type.String( { format: 'uuid' } ),
        email: Type.String( { format: 'email' } ),
        firstName: Type.String(),
        lastName: Type.String(),
        status: Type.String( { example: 'PENDING' } )
    } )
} )
