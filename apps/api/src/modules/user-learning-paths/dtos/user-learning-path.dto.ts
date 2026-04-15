import Type from 'typebox';

export const CreateUserLearningPathRequest = Type.Object({
    name: Type.String({ minLength: 1, maxLength: 255 }),
    description: Type.Optional(Type.String()),
    targetDate: Type.Optional(Type.String({ format: 'date-time' })),
    targetProblems: Type.Optional(Type.Number({ minimum: 0 })),
    masterLearningPathId: Type.Optional(Type.String()),
});

export const UpdateUserLearningPathRequest = Type.Object({
    name: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
    description: Type.Optional(Type.String()),
    targetDate: Type.Optional(Type.String({ format: 'date-time' })),
    targetProblems: Type.Optional(Type.Number({ minimum: 0 })),
});
