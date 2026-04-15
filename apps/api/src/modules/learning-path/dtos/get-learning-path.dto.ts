import Type from 'typebox';

export const LearningPathListItemSchema = {
    id: Type.String(),
    title: Type.String(),
    description: Type.Optional( Type.String() ),
    status: Type.String(),
    thumbnail: Type.Optional( Type.String() ),
    estimatedHours: Type.Number(),
    tags: Type.Array( Type.String() ),
    createdBy: Type.String(),
    createdAt: Type.String(),
    updatedAt: Type.String(),
};

