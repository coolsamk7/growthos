import Type from 'typebox';

export const UpdateSocialLinksRequest = Type.Object( {
    linkedinUrl: Type.Optional( Type.String( { format: 'uri', maxLength: 500 } ) ),
    githubUrl: Type.Optional( Type.String( { format: 'uri', maxLength: 500 } ) ),
    twitterUrl: Type.Optional( Type.String( { format: 'uri', maxLength: 500 } ) ),
    websiteUrl: Type.Optional( Type.String( { format: 'uri', maxLength: 500 } ) )
} );

export const UpdateSocialLinksResponse = Type.Object( {
    message: Type.String(),
    data: Type.Object( {
        linkedinUrl: Type.Optional( Type.String() ),
        githubUrl: Type.Optional( Type.String() ),
        twitterUrl: Type.Optional( Type.String() ),
        websiteUrl: Type.Optional( Type.String() )
    } )
} );
