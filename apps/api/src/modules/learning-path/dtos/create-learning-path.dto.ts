import Type from 'typebox';

export const CreateLearningPathRequest = Type.Object( {
    title: Type.String( { minLength: 1, maxLength: 255 } ),
    description: Type.Optional( Type.String() ),
    content: Type.Optional( Type.Array( Type.Any() ) ),
    thumbnail: Type.Optional( Type.String() ),
    estimatedHours: Type.Optional( Type.Number( { minimum: 0 } ) ),
    tags: Type.Optional( Type.Array( Type.String() ) ),
    status: Type.Optional( Type.Union( [ 
        Type.Literal( 'DRAFT' ), 
        Type.Literal( 'PUBLIC' ), 
        Type.Literal( 'INACTIVE' ) 
    ] ) ),
} );

export const LearningPathSchema = {
    id: Type.String(),
    title: Type.String(),
    description: Type.Optional( Type.String() ),
    content: Type.Array( Type.Any() ),
    status: Type.String(),
    thumbnail: Type.Optional( Type.String() ),
    estimatedHours: Type.Number(),
    tags: Type.Array( Type.String() ),
    createdBy: Type.String(),
    createdAt: Type.String(),
    updatedAt: Type.String(),
};

