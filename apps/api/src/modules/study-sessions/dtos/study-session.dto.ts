import Type from 'typebox';

export const CreateStudySessionRequest = Type.Object( {
    userLearningPathId: Type.Optional( Type.String() ),
    userModuleId: Type.Optional( Type.String() ),
    userTopicId: Type.Optional( Type.String() ),
    userProblemId: Type.Optional( Type.String() ),
    durationMinutes: Type.Optional( Type.Number( { minimum: 0 } ) ),
    durationSeconds: Type.Optional( Type.Number( { minimum: 0 } ) ),
    notes: Type.Optional( Type.String() ),
    sessionDate: Type.Optional( Type.String( { format: 'date' } ) ),
    startTime: Type.Optional( Type.String( { format: 'date-time' } ) ),
    endTime: Type.Optional( Type.String( { format: 'date-time' } ) ),
    isActive: Type.Optional( Type.Boolean() ),
} );

export const UpdateStudySessionRequest = Type.Object( {
    userLearningPathId: Type.Optional( Type.String() ),
    userModuleId: Type.Optional( Type.String() ),
    userTopicId: Type.Optional( Type.String() ),
    userProblemId: Type.Optional( Type.String() ),
    durationMinutes: Type.Optional( Type.Number( { minimum: 0 } ) ),
    durationSeconds: Type.Optional( Type.Number( { minimum: 0 } ) ),
    notes: Type.Optional( Type.String() ),
    sessionDate: Type.Optional( Type.String( { format: 'date' } ) ),
    startTime: Type.Optional( Type.String( { format: 'date-time' } ) ),
    endTime: Type.Optional( Type.String( { format: 'date-time' } ) ),
    isActive: Type.Optional( Type.Boolean() ),
} );
