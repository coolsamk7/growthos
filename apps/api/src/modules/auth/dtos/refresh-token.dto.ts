import Type from 'typebox';

export const RefreshTokenRequest = Type.Object({
    refreshToken: Type.String({ minLength: 1 })
});

export const RefreshTokenResponse = Type.Object({
    message: Type.String(),
    accessToken: Type.String(),
    refreshToken: Type.String()
});
