import Type from 'typebox';

export const CreateGoalRequest = Type.Object( {
    userLearningPathId: Type.Optional( Type.String() ),
    title: Type.String( { minLength: 1, maxLength: 255 } ),
    description: Type.Optional( Type.String() ),
    targetProblems: Type.Optional( Type.Number( { minimum: 0 } ) ),
    targetMinutes: Type.Optional( Type.Number( { minimum: 0 } ) ),
    startDate: Type.String( { format: 'date' } ),
    targetDate: Type.String( { format: 'date' } ),
} );

export const UpdateGoalRequest = Type.Object( {
    userLearningPathId: Type.Optional( Type.String() ),
    title: Type.Optional( Type.String( { minLength: 1, maxLength: 255 } ) ),
    description: Type.Optional( Type.String() ),
    targetProblems: Type.Optional( Type.Number( { minimum: 0 } ) ),
    completedProblems: Type.Optional( Type.Number( { minimum: 0 } ) ),
    targetMinutes: Type.Optional( Type.Number( { minimum: 0 } ) ),
    completedMinutes: Type.Optional( Type.Number( { minimum: 0 } ) ),
    startDate: Type.Optional( Type.String( { format: 'date' } ) ),
    targetDate: Type.Optional( Type.String( { format: 'date' } ) ),
    status: Type.Optional( Type.String() ),
} );
