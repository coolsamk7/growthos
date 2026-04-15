import Type from 'typebox';

export const createApiResponse = <T extends Record<string, any>>( dataSchema: T ) => {
    return Type.Object( {
        message: Type.String(),
        data: Type.Object( dataSchema ),
    } );
};

export const createApiListResponse = <T extends Record<string, any>>( itemSchema: T ) => {
    return Type.Object( {
        data: Type.Array( Type.Object( itemSchema ) ),
        total: Type.Number(),
        page: Type.Number(),
        limit: Type.Number(),
    } );
};

export const createMessageResponse = () => {
    return Type.Object( {
        message: Type.String(),
    } );
};
