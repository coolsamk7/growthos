import { Briefcase } from 'lucide-react';
import { ProfileSection } from './ProfileSection';
import { InputField, SelectField } from './FormFields';

const experienceOptions = [ 'Student', '0-1 years', '1-3 years', '3-5 years', '5-10 years', '10+ years' ];

interface ProfessionalInfoSectionProps {
    profile: {
        occupation: string;
        company: string;
        experience: string;
    };
    isEditing: boolean;
    isSaving: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    onChange: ( field: string, value: string ) => void;
}

export function ProfessionalInfoSection( {
    profile,
    isEditing,
    isSaving,
    onEdit,
    onSave,
    onCancel,
    onChange,
}: ProfessionalInfoSectionProps ) {
    return (
        <ProfileSection
            title="Professional Information"
            icon={Briefcase}
            section="professional"
            isEditing={isEditing}
            isSaving={isSaving}
            onEdit={onEdit}
            onSave={onSave}
            onCancel={onCancel}
        >
            <InputField
                icon={Briefcase}
                label="Occupation / Role"
                placeholder="Software Engineer"
                value={profile.occupation}
                onChange={( value ) => onChange( 'occupation', value )}
                disabled={!isEditing}
            />
            <InputField
                icon={Briefcase}
                label="Company / Organization"
                placeholder="Tech Corp"
                value={profile.company}
                onChange={( value ) => onChange( 'company', value )}
                disabled={!isEditing}
            />
            <SelectField
                icon={Briefcase}
                label="Years of Experience"
                options={experienceOptions}
                value={profile.experience}
                onChange={( value ) => onChange( 'experience', value )}
                disabled={!isEditing}
            />
        </ProfileSection>
    );
}
