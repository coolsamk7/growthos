import Type from 'typebox';

export const UpdateLocationRequest = Type.Object( {
    city: Type.Optional( Type.String( { maxLength: 100 } ) ),
    state: Type.Optional( Type.String( { maxLength: 100 } ) ),
    country: Type.Optional( Type.String( { maxLength: 100 } ) )
} );

export const UpdateLocationResponse = Type.Object( {
    message: Type.String(),
    data: Type.Object( {
        city: Type.Optional( Type.String() ),
        state: Type.Optional( Type.String() ),
        country: Type.Optional( Type.String() )
    } )
} );
