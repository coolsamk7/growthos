import { Type } from 'typebox'

export const SignupResponse = Type.Object( {
    messsage: Type.String( { example: 'User created successfully' } )
} )
