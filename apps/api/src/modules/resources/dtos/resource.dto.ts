import { Type } from 'typebox';

export const CreateResourceRequest = Type.Object( {
    entityType: Type.Union( [ Type.Literal( 'module' ), Type.Literal( 'topic' ), Type.Literal( 'problem' ) ] ),
    entityId: Type.String(),
    title: Type.String( { minLength: 1, maxLength: 255 } ),
    url: Type.String( { format: 'uri' } ),
    type: Type.Optional( Type.String() ),
    description: Type.Optional( Type.String() ),
    orderIndex: Type.Optional( Type.Number( { minimum: 0 } ) ),
    isCompleted: Type.Optional( Type.Boolean() ),
} );

export const UpdateResourceRequest = Type.Object( {
    title: Type.Optional( Type.String( { minLength: 1, maxLength: 255 } ) ),
    url: Type.Optional( Type.String( { format: 'uri' } ) ),
    type: Type.Optional( Type.String() ),
    description: Type.Optional( Type.String() ),
    orderIndex: Type.Optional( Type.Number( { minimum: 0 } ) ),
    isCompleted: Type.Optional( Type.Boolean() ),
} );
