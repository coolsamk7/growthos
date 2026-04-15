import Type from 'typebox';

export const CreateMasterLearningPathRequest = Type.Object( {
    name: Type.String( { minLength: 1, maxLength: 255 } ),
    description: Type.Optional( Type.String() ),
    isPublished: Type.Optional( Type.Boolean() ),
} );

export const UpdateMasterLearningPathRequest = Type.Object( {
    name: Type.Optional( Type.String( { minLength: 1, maxLength: 255 } ) ),
    description: Type.Optional( Type.String() ),
    isPublished: Type.Optional( Type.Boolean() ),
} );
