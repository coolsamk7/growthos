import Type from 'typebox';

export const CreateMasterTopicRequest = Type.Object( {
    masterLearningPathId: Type.String(),
    name: Type.String( { minLength: 1, maxLength: 255 } ),
    description: Type.Optional( Type.String() ),
    orderIndex: Type.Optional( Type.Number( { minimum: 0 } ) ),
    isPublished: Type.Optional( Type.Boolean() ),
} );

export const UpdateMasterTopicRequest = Type.Object( {
    masterLearningPathId: Type.Optional( Type.String() ),
    name: Type.Optional( Type.String( { minLength: 1, maxLength: 255 } ) ),
    description: Type.Optional( Type.String() ),
    orderIndex: Type.Optional( Type.Number( { minimum: 0 } ) ),
    isPublished: Type.Optional( Type.Boolean() ),
} );
