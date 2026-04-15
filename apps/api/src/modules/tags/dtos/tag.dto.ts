import Type from 'typebox';

export const CreateTagRequest = Type.Object( {
    name: Type.String( { minLength: 1, maxLength: 100 } ),
    category: Type.Optional( Type.String() ),
    description: Type.Optional( Type.String() ),
} );

export const UpdateTagRequest = Type.Object( {
    name: Type.Optional( Type.String( { minLength: 1, maxLength: 100 } ) ),
    category: Type.Optional( Type.String() ),
    description: Type.Optional( Type.String() ),
} );

export const TagSchema = {
    id: Type.String(),
    name: Type.String(),
    category: Type.Optional( Type.String() ),
    description: Type.Optional( Type.String() ),
    usageCount: Type.Number(),
    createdAt: Type.String(),
    updatedAt: Type.String(),
};
