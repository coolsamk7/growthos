import Type, { TSchema } from 'typebox';

export const PaginatedListResponse = ( data: TSchema ) =>
    Type.Object( {
        data: Type.Array( data ),
        meta: Type.Object( {
            itemsPerPage: Type.Number(),
            totalItems: Type.Number(),
            currentPage: Type.Number(),
            totalPages: Type.Number(),
            sortBy: Type.Object( {} )
        } )
   } );
