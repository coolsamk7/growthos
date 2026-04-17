import { Type } from 'typebox'

export const ResendOtpRequest = Type.Object( {
    userId: Type.String( { format: 'uuid' } )
} )

export const ResendOtpResponse = Type.Object( {
    message: Type.String( { example: 'OTP resent successfully' } )
} )
