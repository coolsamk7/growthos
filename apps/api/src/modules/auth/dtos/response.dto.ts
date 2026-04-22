import { Type } from 'typebox'

export const SignupResponse = Type.Object( {
    message: Type.String( { example: 'User created successfully' } ),
    data: Type.Object( {
        email: Type.String( { format: 'email' } ),
        sessionId: Type.String(  )
    } )
} )
