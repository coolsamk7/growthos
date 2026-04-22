import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
    getUserProfileInformation,
    updatePersonalInfomration,
    udpateUserLocation,
    updateProfessionalInformation,
    updateEducation,
    updateCurrentGoal,
    updateSocialLink,
} from '@/services/user-profile.service';

import { ProfileHeader } from './components/ProfileHeader';
import { PersonalInfoSection } from './components/PersonalInfoSection';
import { LocationSection } from './components/LocationSection';
import { ProfessionalInfoSection } from './components/ProfessionalInfoSection';
import { EducationSection } from './components/EducationSection';
import { GoalsSection } from './components/GoalsSection';
import { SocialLinksSection } from './components/SocialLinksSection';

interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    city: string;
    state: string;
    country: string;
    occupation: string;
    company: string;
    experience: string;
    highestEducation: string;
    fieldOfStudy: string;
    institution: string;
    graduationYear: string;
    learningGoal: string;
    targetExam: string;
    linkedinUrl: string;
    githubUrl: string;
    twitterUrl: string;
    websiteUrl: string;
    bio: string;
}

type SectionKey =
    | 'personal'
    | 'location'
    | 'professional'
    | 'education'
    | 'goals'
    | 'social';

const defaultProfile: ProfileData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    city: '',
    state: '',
    country: '',
    occupation: '',
    company: '',
    experience: '',
    highestEducation: '',
    fieldOfStudy: '',
    institution: '',
    graduationYear: '',
    learningGoal: '',
    targetExam: '',
    linkedinUrl: '',
    githubUrl: '',
    twitterUrl: '',
    websiteUrl: '',
    bio: '',
};

const mapProfileData = ( data: Partial<ProfileData> ): ProfileData => {
    return Object.keys( defaultProfile ).reduce( ( acc, key ) => {
        acc[key as keyof ProfileData] = data[key as keyof ProfileData] ?? '';
        return acc;
    }, {} as ProfileData );
};

export function ProfilePage() {

    const [ profile, setProfile ] = useState<ProfileData>( defaultProfile );
    const [ editingSections, setEditingSections ] = useState<Record<string, boolean>>( {} );
    const [ savingSections, setSavingSections ] = useState<Record<string, boolean>>( {} );
    const [ showSuccess, setShowSuccess ] = useState( false );
    const [ loading, setLoading ] = useState( true );
    const [ showError, setShowError ] = useState( false )
    const [ errorMessage, setErrorMessage ] = useState( "" )


    // ------------------ Error Handler ------------------
    const handleError = ( error: any, fallback = 'Something went wrong' ) => {
        console.error( error );

        let message =
            error?.error?.message ||
            error?.response?.data?.message ||
            error?.message ||
            fallback;

        if ( Array.isArray( message ) ) {
            message = message.join( ', ' );
        }

        setShowError( true );
        setTimeout( () => setShowError( false ), 5000 );
        setErrorMessage( message );
    };

    // ------------------ Section Config ------------------
    const sectionConfig: Record<
        SectionKey,
        {
            api: ( data: any ) => Promise<any>;
            getPayload: ( profile: ProfileData ) => any;
        }
    > = {
        personal: {
            api: updatePersonalInfomration,
            getPayload: ( p ) => ( {
                firstName: p.firstName,
                lastName: p.lastName,
                phone: p.phone,
                dateOfBirth: p.dateOfBirth,
            } ),
        },
        location: {
            api: udpateUserLocation,
            getPayload: ( p ) => ( {
                city: p.city,
                state: p.state,
                country: p.country,
            } ),
        },
        professional: {
            api: updateProfessionalInformation,
            getPayload: ( p ) => ( {
                occupation: p.occupation,
                company: p.company,
                experience: p.experience,
            } ),
        },
        education: {
            api: updateEducation,
            getPayload: ( p ) => ( {
                highestEducation: p.highestEducation,
                fieldOfStudy: p.fieldOfStudy,
                institution: p.institution,
                graduationYear: p.graduationYear,
            } ),
        },
        goals: {
            api: updateCurrentGoal,
            getPayload: ( p ) => ( {
                learningGoal: p.learningGoal,
                targetExam: p.targetExam,
                bio: p.bio,
            } ),
        },
        social: {
            api: updateSocialLink,
            getPayload: ( p ) => ( {
                linkedinUrl: p.linkedinUrl,
                githubUrl: p.githubUrl,
                twitterUrl: p.twitterUrl,
                websiteUrl: p.websiteUrl,
            } ),
        },
    };

    // ------------------ Load Profile ------------------
    useEffect( () => {
        const loadProfile = async () => {
            try {
                setLoading( true );
                const { data } = await getUserProfileInformation();
                if ( data ) {
                    setProfile( mapProfileData( data ) );
                }
            } catch ( error ) {
                handleError( error, 'Failed to load profile' );
            } finally {
                setLoading( false );
            }
        };

        loadProfile();
    }, [] );

    // ------------------ Handlers ------------------
    const handleChange = ( field: keyof ProfileData, value: string ) => {
        setProfile( ( prev ) => ( { ...prev, [field]: value } ) );
    };

    const toggleEdit = ( section: SectionKey ) => {
        setShowError( false );
        setEditingSections( ( prev ) => ( { ...prev, [section]: !prev[section] } ) );
    };

    const handleCancelSection = ( section: SectionKey ) => {
        setEditingSections( ( prev ) => ( { ...prev, [section]: false } ) );
    };

    const handleSaveSection = async ( section: SectionKey ) => {
        setSavingSections( ( prev ) => ( { ...prev, [section]: true } ) );

        try {
            const config = sectionConfig[section];
            if ( !config ) return;

            await config.api( config.getPayload( profile ) );

            setEditingSections( ( prev ) => ( { ...prev, [section]: false } ) );
            setShowSuccess( true );
            setTimeout( () => setShowSuccess( false ), 3000 );
        } catch ( error ) {
            handleError( error, `Failed to update ${section}` );
        } finally {
            setSavingSections( ( prev ) => ( { ...prev, [section]: false } ) );
        }
    };

    // ------------------ Loading UI ------------------
    if ( loading ) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        );
    }

    // ------------------ UI ------------------
    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
                    <p className="mt-1 text-muted-foreground">
                        Manage your personal information and preferences.
                    </p>
                </div>
            </div>
            {
                showSuccess && (
                    <div className="flex items-center gap-3 rounded-xl border border-success/20 bg-success/10 p-4">
                        <CheckCircle2 className="size-5 text-success" />
                        <p className="text-sm font-medium text-success">
                            Profile updated successfully!
                        </p>
                    </div>
                )}
            {
                showError && (
                    < div className="flex items-center gap-3 rounded-xl border border-error/20 bg-error/10 p-4">
                        <AlertCircle className="size-5 text-error" />
                        <p className="text-sm font-medium text-error">
                            Unable to save profile. {errorMessage}
                        </p>
                    </div>
                )
            }

            {/* Header Card */}
            <ProfileHeader
                firstName={profile.firstName}
                lastName={profile.lastName}
                occupation={profile.occupation}
                company={profile.company}
                city={profile.city}
                country={profile.country}
                experience={profile.experience}
                learningGoal={profile.learningGoal}
            />

            {/* Sections */}
            <div className="grid gap-6 lg:grid-cols-2">
                <PersonalInfoSection
                    profile={profile}
                    isEditing={editingSections.personal || false}
                    isSaving={savingSections.personal || false}
                    onEdit={() => toggleEdit( 'personal' )}
                    onSave={() => handleSaveSection( 'personal' )}
                    onCancel={() => handleCancelSection( 'personal' )}
                    onChange={handleChange}
                />

                <LocationSection
                    profile={profile}
                    isEditing={editingSections.location || false}
                    isSaving={savingSections.location || false}
                    onEdit={() => toggleEdit( 'location' )}
                    onSave={() => handleSaveSection( 'location' )}
                    onCancel={() => handleCancelSection( 'location' )}
                    onChange={handleChange}
                />

                <ProfessionalInfoSection
                    profile={profile}
                    isEditing={editingSections.professional || false}
                    isSaving={savingSections.professional || false}
                    onEdit={() => toggleEdit( 'professional' )}
                    onSave={() => handleSaveSection( 'professional' )}
                    onCancel={() => handleCancelSection( 'professional' )}
                    onChange={handleChange}
                />

                <EducationSection
                    profile={profile}
                    isEditing={editingSections.education || false}
                    isSaving={savingSections.education || false}
                    onEdit={() => toggleEdit( 'education' )}
                    onSave={() => handleSaveSection( 'education' )}
                    onCancel={() => handleCancelSection( 'education' )}
                    onChange={handleChange}
                />

                <GoalsSection
                    profile={profile}
                    isEditing={editingSections.goals || false}
                    isSaving={savingSections.goals || false}
                    onEdit={() => toggleEdit( 'goals' )}
                    onSave={() => handleSaveSection( 'goals' )}
                    onCancel={() => handleCancelSection( 'goals' )}
                    onChange={handleChange}
                />

                <SocialLinksSection
                    profile={profile}
                    isEditing={editingSections.social || false}
                    isSaving={savingSections.social || false}
                    onEdit={() => toggleEdit( 'social' )}
                    onSave={() => handleSaveSection( 'social' )}
                    onCancel={() => handleCancelSection( 'social' )}
                    onChange={handleChange}
                />
            </div>
        </div >
    );
}

