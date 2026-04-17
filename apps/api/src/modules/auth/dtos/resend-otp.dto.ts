import { Type } from 'typebox'

export const ResendOtpRequest = Type.Object( {
    email: Type.String( { format: 'email' } )
} )

export const ResendOtpResponse = Type.Object( {
    message: Type.String( { example: 'OTP resent successfully' } ),
    data: Type.Object( {
        email: Type.String( { format: 'email' } ),
        sessionId: Type.String(  )
    } )

} )
