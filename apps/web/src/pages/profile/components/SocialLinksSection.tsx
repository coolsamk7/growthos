import { Globe, Linkedin, Github, Twitter } from 'lucide-react';
import { ProfileSection } from './ProfileSection';
import { InputField } from './FormFields';

interface SocialLinksSectionProps {
    profile: {
        linkedinUrl: string;
        githubUrl: string;
        twitterUrl: string;
        websiteUrl: string;
    };
    isEditing: boolean;
    isSaving: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    onChange: ( field: string, value: string ) => void;
}

export function SocialLinksSection( {
    profile,
    isEditing,
    isSaving,
    onEdit,
    onSave,
    onCancel,
    onChange,
}: SocialLinksSectionProps ) {
    return (
        <ProfileSection
            title="Social Links"
            icon={Globe}
            section="social"
            isEditing={isEditing}
            isSaving={isSaving}
            onEdit={onEdit}
            onSave={onSave}
            onCancel={onCancel}
        >
            <InputField
                icon={Linkedin}
                label="LinkedIn"
                placeholder="https://linkedin.com/in/username"
                value={profile.linkedinUrl}
                onChange={( value ) => onChange( 'linkedinUrl', value )}
                disabled={!isEditing}
            />
            <InputField
                icon={Github}
                label="GitHub"
                placeholder="https://github.com/username"
                value={profile.githubUrl}
                onChange={( value ) => onChange( 'githubUrl', value )}
                disabled={!isEditing}
            />
            <InputField
                icon={Twitter}
                label="Twitter"
                placeholder="https://twitter.com/username"
                value={profile.twitterUrl}
                onChange={( value ) => onChange( 'twitterUrl', value )}
                disabled={!isEditing}
            />
            <InputField
                icon={Globe}
                label="Personal Website"
                placeholder="https://yourwebsite.com"
                value={profile.websiteUrl}
                onChange={( value ) => onChange( 'websiteUrl', value )}
                disabled={!isEditing}
            />
        </ProfileSection>
    );
}
