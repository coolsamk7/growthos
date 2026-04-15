import Type from 'typebox';

export const CreateStreakRequest = Type.Object({
    currentStreak: Type.Optional(Type.Number({ minimum: 0 })),
    longestStreak: Type.Optional(Type.Number({ minimum: 0 })),
    lastActivityDate: Type.Optional(Type.String({ format: 'date' })),
    totalStudyDays: Type.Optional(Type.Number({ minimum: 0 })),
    totalProblemsSolved: Type.Optional(Type.Number({ minimum: 0 })),
});

export const UpdateStreakRequest = Type.Object({
    currentStreak: Type.Optional(Type.Number({ minimum: 0 })),
    longestStreak: Type.Optional(Type.Number({ minimum: 0 })),
    lastActivityDate: Type.Optional(Type.String({ format: 'date' })),
    totalStudyDays: Type.Optional(Type.Number({ minimum: 0 })),
    totalProblemsSolved: Type.Optional(Type.Number({ minimum: 0 })),
});

