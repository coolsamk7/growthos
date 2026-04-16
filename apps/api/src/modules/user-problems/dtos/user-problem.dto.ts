import Type from 'typebox';

export const CreateUserProblemRequest = Type.Object( {
    userTopicId: Type.String(),
    title: Type.String( { minLength: 1, maxLength: 255 } ),
    externalUrl: Type.Optional( Type.String() ),
    difficulty: Type.Union( [ Type.Literal( 'EASY' ), Type.Literal( 'MEDIUM' ), Type.Literal( 'HARD' ) ] ),
    status: Type.Optional( Type.Union( [
        Type.Literal( 'TODO' ),
        Type.Literal( 'IN_PROGRESS' ),
        Type.Literal( 'SOLVED' ),
        Type.Literal( 'REVIEWING' )
    ] ) ),
    source: Type.Optional( Type.Union( [
        Type.Literal( 'LEETCODE' ),
        Type.Literal( 'HACKERRANK' ),
        Type.Literal( 'CODECHEF' ),
        Type.Literal( 'CODEFORCES' ),
        Type.Literal( 'CUSTOM' )
    ] ) ),
    approachNotes: Type.Optional( Type.String() ),
    solution: Type.Optional( Type.String() ),
    isStarred: Type.Optional( Type.Boolean() ),
    masterProblemId: Type.Optional( Type.String() ),
} );

export const UpdateUserProblemRequest = Type.Object( {
    userTopicId: Type.Optional( Type.String() ),
    title: Type.Optional( Type.String( { minLength: 1, maxLength: 255 } ) ),
    externalUrl: Type.Optional( Type.String() ),
    difficulty: Type.Optional( Type.Union( [ Type.Literal( 'EASY' ), Type.Literal( 'MEDIUM' ), Type.Literal( 'HARD' ) ] ) ),
    status: Type.Optional( Type.Union( [
        Type.Literal( 'TODO' ),
        Type.Literal( 'IN_PROGRESS' ),
        Type.Literal( 'SOLVED' ),
        Type.Literal( 'REVIEWING' )
    ] ) ),
    source: Type.Optional( Type.Union( [
        Type.Literal( 'LEETCODE' ),
        Type.Literal( 'HACKERRANK' ),
        Type.Literal( 'CODECHEF' ),
        Type.Literal( 'CODEFORCES' ),
        Type.Literal( 'CUSTOM' )
    ] ) ),
    approachNotes: Type.Optional( Type.String() ),
    solution: Type.Optional( Type.String() ),
    isStarred: Type.Optional( Type.Boolean() ),
} );
