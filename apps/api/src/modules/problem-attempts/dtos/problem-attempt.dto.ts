import Type from 'typebox';

export const CreateProblemAttemptRequest = Type.Object({
    userProblemId: Type.String(),
    result: Type.Union([
        Type.Literal('SOLVED_INDEPENDENTLY'),
        Type.Literal('SOLVED_WITH_HINT'),
        Type.Literal('PARTIALLY_SOLVED'),
        Type.Literal('COULD_NOT_SOLVE')
    ]),
    timeTakenMinutes: Type.Optional(Type.Number({ minimum: 0 })),
    notes: Type.Optional(Type.String()),
    usedHint: Type.Optional(Type.Boolean()),
});

export const UpdateProblemAttemptRequest = Type.Object({
    result: Type.Optional(Type.Union([
        Type.Literal('SOLVED_INDEPENDENTLY'),
        Type.Literal('SOLVED_WITH_HINT'),
        Type.Literal('PARTIALLY_SOLVED'),
        Type.Literal('COULD_NOT_SOLVE')
    ])),
    timeTakenMinutes: Type.Optional(Type.Number({ minimum: 0 })),
    notes: Type.Optional(Type.String()),
    usedHint: Type.Optional(Type.Boolean()),
});
