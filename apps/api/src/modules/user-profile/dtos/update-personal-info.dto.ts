import Type from 'typebox';
import Format from 'typebox/format'
import Value from 'typebox/value'

export const UpdatePersonalInfoRequest = Type.Object( {
    firstName: Type.Optional( Type.String( { minLength: 1, maxLength: 100 } ) ),
    lastName: Type.Optional( Type.String( { minLength: 1, maxLength: 100 } ) ),
    phone: Type.Optional( Type.String( { minLength: 1, maxLength: 10 } ) ),
    dateOfBirth: Type.Optional( Type.String( { format: 'dob',  } ) )
} );

export const UpdatePersonalInfoResponse = Type.Object( {
    message: Type.String(),
    data: Type.Object( {
        firstName: Type.Optional( Type.String() ),
        lastName: Type.Optional( Type.String() ),
        phone: Type.Optional( Type.String() ),
        dateOfBirth: Type.Optional( Type.String() )
    } )
} );


Format.Set( 'dob', value => {
     if ( !value ) return false;
     console.log( value )
     const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test( value );
     if ( !isValidFormat ) return false;
     const input = new Date( value + "T00:00:00" ); // avoid timezone issues
     if ( isNaN( input.getTime() ) ) return false;
     const today = new Date();
     today.setHours( 0, 0, 0, 0 );
     return input <= today; 
} )
