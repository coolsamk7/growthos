import Type from 'typebox';

export const CreateMasterProblemRequest = Type.Object( {
    masterTopicId: Type.String(),
    title: Type.String( { minLength: 1, maxLength: 255 } ),
    externalUrl: Type.Optional( Type.String() ),
    difficulty: Type.Union( [ 
        Type.Literal( 'EASY' ), 
        Type.Literal( 'MEDIUM' ), 
        Type.Literal( 'HARD' ) 
    ] ),
    source: Type.Optional( Type.Union( [ 
        Type.Literal( 'LEETCODE' ),
        Type.Literal( 'HACKERRANK' ),
        Type.Literal( 'CODECHEF' ),
        Type.Literal( 'CODEFORCES' ),
        Type.Literal( 'CUSTOM' ),
    ] ) ),
    orderIndex: Type.Optional( Type.Number( { minimum: 0 } ) ),
    isPublished: Type.Optional( Type.Boolean() ),
    isMustSolve: Type.Optional( Type.Boolean() ),
} );

export const UpdateMasterProblemRequest = Type.Object( {
    masterTopicId: Type.Optional( Type.String() ),
    title: Type.Optional( Type.String( { minLength: 1, maxLength: 255 } ) ),
    externalUrl: Type.Optional( Type.String() ),
    difficulty: Type.Optional( Type.Union( [ 
        Type.Literal( 'EASY' ), 
        Type.Literal( 'MEDIUM' ), 
        Type.Literal( 'HARD' ) 
    ] ) ),
    source: Type.Optional( Type.Union( [ 
        Type.Literal( 'LEETCODE' ),
        Type.Literal( 'HACKERRANK' ),
        Type.Literal( 'CODECHEF' ),
        Type.Literal( 'CODEFORCES' ),
        Type.Literal( 'CUSTOM' ),
    ] ) ),
    orderIndex: Type.Optional( Type.Number( { minimum: 0 } ) ),
    isPublished: Type.Optional( Type.Boolean() ),
    isMustSolve: Type.Optional( Type.Boolean() ),
} );
