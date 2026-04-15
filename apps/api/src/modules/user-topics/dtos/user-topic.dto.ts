import Type from 'typebox';

export const CreateUserTopicRequest = Type.Object({
    userLearningPathId: Type.String(),
    name: Type.String({ minLength: 1, maxLength: 255 }),
    description: Type.Optional(Type.String()),
    status: Type.Optional(Type.Union([
        Type.Literal('NOT_STARTED'),
        Type.Literal('IN_PROGRESS'),
        Type.Literal('COMPLETED'),
        Type.Literal('MASTERED')
    ])),
    orderIndex: Type.Optional(Type.Number({ minimum: 0 })),
    confidenceScore: Type.Optional(Type.Number({ minimum: 0, maximum: 100 })),
    masterTopicId: Type.Optional(Type.String()),
});

export const UpdateUserTopicRequest = Type.Object({
    userLearningPathId: Type.Optional(Type.String()),
    name: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
    description: Type.Optional(Type.String()),
    status: Type.Optional(Type.Union([
        Type.Literal('NOT_STARTED'),
        Type.Literal('IN_PROGRESS'),
        Type.Literal('COMPLETED'),
        Type.Literal('MASTERED')
    ])),
    orderIndex: Type.Optional(Type.Number({ minimum: 0 })),
    confidenceScore: Type.Optional(Type.Number({ minimum: 0, maximum: 100 })),
});
