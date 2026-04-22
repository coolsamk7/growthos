import Type from 'typebox';

export const UpdateGoalsRequest = Type.Object( {
    learningGoal: Type.Optional( Type.String( { maxLength: 100 } ) ),
    targetExam: Type.Optional( Type.String( { maxLength: 200 } ) ),
    bio: Type.Optional( Type.String( { maxLength: 1000 } ) )
} );

export const UpdateGoalsResponse = Type.Object( {
    message: Type.String(),
    data: Type.Object( {
        learningGoal: Type.Optional( Type.String() ),
        targetExam: Type.Optional( Type.String() ),
        bio: Type.Optional( Type.String() )
    } )
} );
