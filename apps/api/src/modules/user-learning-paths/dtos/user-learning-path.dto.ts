import Type from 'typebox';

export const CreateUserLearningPathRequest = Type.Object( {
    name: Type.String( { minLength: 1, maxLength: 255 } ),
    description: Type.Optional( Type.String() ),
    targetDate: Type.Optional( Type.String( { format: 'date-time' } ) ),
    targetProblems: Type.Optional( Type.Number( { minimum: 0 } ) ),
    masterLearningPathId: Type.Optional( Type.String() ),
} );

export const UpdateUserLearningPathRequest = Type.Object( {
    name: Type.Optional( Type.String( { minLength: 1, maxLength: 255 } ) ),
    description: Type.Optional( Type.String() ),
    targetDate: Type.Optional( Type.String( { format: 'date-time' } ) ),
    targetProblems: Type.Optional( Type.Number( { minimum: 0 } ) ),
} );

const UserLearningPathSchema = Type.Object( {
    id: Type.String(),
    userId: Type.String(),
    name: Type.String(),
    description: Type.Optional( Type.String() ),
    targetDate: Type.Optional( Type.String() ),
    targetProblems: Type.Number(),
    masterLearningPathId: Type.Optional( Type.String() ),
    createdAt: Type.String(),
    updatedAt: Type.String(),
    deletedAt: Type.Optional( Type.String() ),
} );

export const CreateUserLearningPathResponse = Type.Object( {
    message: Type.String(),
    data: UserLearningPathSchema,
} );

export const UpdateUserLearningPathResponse = Type.Object( {
    message: Type.String(),
    data: UserLearningPathSchema,
} );

export const GetUserLearningPathResponse = UserLearningPathSchema;

export const GetUserLearningPathsResponse = Type.Object( {
    data: Type.Array( UserLearningPathSchema ),
    total: Type.Number(),
    page: Type.Number(),
    limit: Type.Number(),
    totalPages: Type.Number(),
} );

export const DeleteUserLearningPathResponse = Type.Object( {
    message: Type.String(),
} );
