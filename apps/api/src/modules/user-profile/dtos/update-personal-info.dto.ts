import Type from 'typebox';

export const UpdatePersonalInfoRequest = Type.Object( {
    firstName: Type.Optional( Type.String( { minLength: 1, maxLength: 100 } ) ),
    lastName: Type.Optional( Type.String( { minLength: 1, maxLength: 100 } ) ),
    phone: Type.Optional( Type.String( { maxLength: 20 } ) ),
    dateOfBirth: Type.Optional( Type.String( { format: 'date' } ) )
} );

export const UpdatePersonalInfoResponse = Type.Object( {
    message: Type.String(),
    data: Type.Object( {
        firstName: Type.Optional( Type.String() ),
        lastName: Type.Optional( Type.String() ),
        phone: Type.Optional( Type.String() ),
        dateOfBirth: Type.Optional( Type.String() )
    } )
} );
