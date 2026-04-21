import Type from 'typebox';

export const GetProfileResponse = Type.Object( {
    message: Type.String(),
    data: Type.Object( {
        userId: Type.String(),
        email: Type.String(),
        firstName: Type.Optional( Type.String() ),
        lastName: Type.Optional( Type.String() ),
        phone: Type.Optional( Type.String() ),
        dateOfBirth: Type.Optional( Type.String() ),
        city: Type.Optional( Type.String() ),
        state: Type.Optional( Type.String() ),
        country: Type.Optional( Type.String() ),
        occupation: Type.Optional( Type.String() ),
        company: Type.Optional( Type.String() ),
        experience: Type.Optional( Type.String() ),
        highestEducation: Type.Optional( Type.String() ),
        fieldOfStudy: Type.Optional( Type.String() ),
        institution: Type.Optional( Type.String() ),
        graduationYear: Type.Optional( Type.String() ),
        learningGoal: Type.Optional( Type.String() ),
        targetExam: Type.Optional( Type.String() ),
        linkedinUrl: Type.Optional( Type.String() ),
        githubUrl: Type.Optional( Type.String() ),
        twitterUrl: Type.Optional( Type.String() ),
        websiteUrl: Type.Optional( Type.String() ),
        bio: Type.Optional( Type.String() ),
        avatarUrl: Type.Optional( Type.String() )
    } )
} );
