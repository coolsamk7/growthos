import { GraduationCap, Calendar } from 'lucide-react';
import { ProfileSection } from './ProfileSection';
import { InputField, SelectField } from './FormFields';

const educationOptions = [ 'High School', 'Diploma', "Bachelor's Degree", "Master's Degree", 'PhD', 'Other' ];

interface EducationSectionProps {
    profile: {
        highestEducation: string;
        fieldOfStudy: string;
        institution: string;
        graduationYear: string;
    };
    isEditing: boolean;
    isSaving: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    onChange: ( field: string, value: string ) => void;
}

export function EducationSection( {
    profile,
    isEditing,
    isSaving,
    onEdit,
    onSave,
    onCancel,
    onChange,
}: EducationSectionProps ) {
    return (
        <ProfileSection
            title="Education"
            icon={GraduationCap}
            section="education"
            isEditing={isEditing}
            isSaving={isSaving}
            onEdit={onEdit}
            onSave={onSave}
            onCancel={onCancel}
        >
            <SelectField
                icon={GraduationCap}
                label="Highest Education"
                options={educationOptions}
                value={profile.highestEducation}
                onChange={( value ) => onChange( 'highestEducation', value )}
                disabled={!isEditing}
            />
            <InputField
                icon={GraduationCap}
                label="Field of Study"
                placeholder="Computer Science"
                value={profile.fieldOfStudy}
                onChange={( value ) => onChange( 'fieldOfStudy', value )}
                disabled={!isEditing}
            />
            <InputField
                icon={GraduationCap}
                label="Institution"
                placeholder="Stanford University"
                value={profile.institution}
                onChange={( value ) => onChange( 'institution', value )}
                disabled={!isEditing}
            />
            <InputField
                icon={Calendar}
                label="Graduation Year"
                placeholder="2017"
                value={profile.graduationYear}
                onChange={( value ) => onChange( 'graduationYear', value )}
                disabled={!isEditing}
            />
        </ProfileSection>
    );
}
