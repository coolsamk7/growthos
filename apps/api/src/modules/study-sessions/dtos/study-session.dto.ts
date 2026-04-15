import Type from 'typebox';

export const CreateStudySessionRequest = Type.Object({
    userLearningPathId: Type.Optional(Type.String()),
    userTopicId: Type.Optional(Type.String()),
    durationMinutes: Type.Number({ minimum: 1 }),
    notes: Type.Optional(Type.String()),
    sessionDate: Type.String({ format: 'date' }),
});

export const UpdateStudySessionRequest = Type.Object({
    userLearningPathId: Type.Optional(Type.String()),
    userTopicId: Type.Optional(Type.String()),
    durationMinutes: Type.Optional(Type.Number({ minimum: 1 })),
    notes: Type.Optional(Type.String()),
    sessionDate: Type.Optional(Type.String({ format: 'date' })),
});
