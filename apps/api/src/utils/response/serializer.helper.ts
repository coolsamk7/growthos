export const toApiResponse = <T>( message: string, data: T ) => {
    return {
        message,
        data,
    };
};

export const toApiListResponse = <T>( data: T[], total: number, page: number, limit: number ) => {
    return {
        data,
        total,
        page,
        limit,
    };
};

export const toMessageResponse = ( message: string ) => {
    return {
        message,
    };
};

export const serializeEntity = <T extends Record<string, any>>( 
    entity: T, 
    fields?: ( keyof T )[]
): Partial<T> => {
    if ( !fields ) {
        const result: any = { ...entity };
        if ( result.createdAt instanceof Date ) result.createdAt = result.createdAt.toISOString();
        if ( result.updatedAt instanceof Date ) result.updatedAt = result.updatedAt.toISOString();
        if ( result.deletedAt instanceof Date ) result.deletedAt = result.deletedAt.toISOString();
        return result;
    }

    const result: any = {};
    for ( const field of fields ) {
        const value = entity[ field ] as any;
        if ( value instanceof Date ) {
            result[ field ] = value.toISOString();
        } else {
            result[ field ] = value;
        }
    }
    return result;
};
