import Type from 'typebox';

export const UpdateProfessionalInfoRequest = Type.Object( {
    occupation: Type.Optional( Type.String( { maxLength: 100 } ) ),
    company: Type.Optional( Type.String( { maxLength: 100 } ) ),
    experience: Type.Optional( Type.String( { maxLength: 50 } ) )
} );

export const UpdateProfessionalInfoResponse = Type.Object( {
    message: Type.String(),
    data: Type.Object( {
        occupation: Type.Optional( Type.String() ),
        company: Type.Optional( Type.String() ),
        experience: Type.Optional( Type.String() )
    } )
} );
