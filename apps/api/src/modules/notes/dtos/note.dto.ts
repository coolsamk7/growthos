import Type from 'typebox';

export const CreateNoteRequest = Type.Object({
    userTopicId: Type.String(),
    title: Type.String({ minLength: 1, maxLength: 255 }),
    content: Type.String({ minLength: 1 }),
    orderIndex: Type.Optional(Type.Number({ minimum: 0 })),
    isPinned: Type.Optional(Type.Boolean()),
});

export const UpdateNoteRequest = Type.Object({
    userTopicId: Type.Optional(Type.String()),
    title: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
    content: Type.Optional(Type.String({ minLength: 1 })),
    orderIndex: Type.Optional(Type.Number({ minimum: 0 })),
    isPinned: Type.Optional(Type.Boolean()),
});
