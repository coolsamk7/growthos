import Type from 'typebox';

export const UpdateEducationRequest = Type.Object( {
    highestEducation: Type.Optional( Type.String( { maxLength: 100 } ) ),
    fieldOfStudy: Type.Optional( Type.String( { maxLength: 100 } ) ),
    institution: Type.Optional( Type.String( { maxLength: 200 } ) ),
    graduationYear: Type.Optional( Type.String( { maxLength: 4 } ) )
} );

export const UpdateEducationResponse = Type.Object( {
    message: Type.String(),
    data: Type.Object( {
        highestEducation: Type.Optional( Type.String() ),
        fieldOfStudy: Type.Optional( Type.String() ),
        institution: Type.Optional( Type.String() ),
        graduationYear: Type.Optional( Type.String() )
    } )
} );
