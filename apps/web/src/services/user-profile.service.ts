import { userProfileGetProfile, userProfileUpdateEducation, userProfileUpdateGoals, userProfileUpdateLocation, userProfileUpdatePersonalInfo, userProfileUpdateProfessionalInfo, userProfileUpdateSocialLinks } from "@growthos/api-client"

export const getUserProfileInformation = async () => {
    const response = await userProfileGetProfile();
    if ( response.error ) {
        throw response.error;
    }
    return response.data;
}

export const updatePersonalInfomration = async ( data: {
    firstName: string;
    lastName: string;
    phone: string;
    dateOfBirth: string;
} ) => {
    const response = await userProfileUpdatePersonalInfo( {
        body: {
            firstName: data.firstName,
            lastName: data.lastName, 
            phone: data.phone, 
            dateOfBirth: data.dateOfBirth
        }
    } )
    if ( response.error ) {
        throw response.error;
    }
    return response.data
}

export const udpateUserLocation = async ( data: {
    city: string,
    state: string,
    country: string
} ) =>  {
   const response = await userProfileUpdateLocation( {
        body: {
            country: data.country, state: data.state, city: data.city
        }
    } )
    if ( response.error ) {
        throw response.error;
    }
    return response.data;
}


export const updateProfessionalInformation = async ( data: {
    occupation: string,
    company: string,
    experience: string
} ) => {
    console.log( data )
    const response = await userProfileUpdateProfessionalInfo( {
        body: {
            company: data.company,
            occupation: data.occupation,
            experience: data.experience
        }
    } )
    console.log( response.data )
    if ( response.error ) {
        throw response.error;
    }
    return response.data;
}

export const updateEducation = async ( data: { 
    highestEducation: string,
    fieldOfStudy: string,
    institution: string,
    graduationYear: string
} ) => {
    const response = await userProfileUpdateEducation( {
        body: {
            highestEducation: data.highestEducation, 
            fieldOfStudy: data.fieldOfStudy, 
            institution: data.institution, 
            graduationYear: data.graduationYear
        }
    } )
    if ( response.error ) {
        throw response.error;
    }
    return response.data;
}

export const updateCurrentGoal = async ( data: {
    learningGoal: string,
    targetExam: string,
    bio: string
} ) => {
    const response = await userProfileUpdateGoals( {
        body: {
            bio: data.bio, 
            targetExam: data.targetExam, 
            learningGoal: data.learningGoal
        }
    } )
    if ( response.error ) {
        throw response.error;
    }
    return response.data
}

export const updateSocialLink = async ( data: {
    linkedinUrl: string,
    githubUrl: string,
    twitterUrl: string,
    websiteUrl: string
} ) => {
    const response = await userProfileUpdateSocialLinks( {
        body: {
            linkedinUrl: data.linkedinUrl,
            githubUrl: data.githubUrl,
            twitterUrl: data.twitterUrl,
            websiteUrl: data.websiteUrl
        }
    } )
    if ( response.error ) {
        throw response.error;
    }
    return response.data
}
