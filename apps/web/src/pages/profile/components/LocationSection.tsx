import { MapPin, Globe } from 'lucide-react';
import { ProfileSection } from './ProfileSection';
import { InputField } from './FormFields';

interface LocationSectionProps {
    profile: {
        city: string;
        state: string;
        country: string;
    };
    isEditing: boolean;
    isSaving: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    onChange: ( field: string, value: string ) => void;
}

export function LocationSection( {
    profile,
    isEditing,
    isSaving,
    onEdit,
    onSave,
    onCancel,
    onChange,
}: LocationSectionProps ) {
    return (
        <ProfileSection
            title="Location"
            icon={MapPin}
            section="location"
            isEditing={isEditing}
            isSaving={isSaving}
            onEdit={onEdit}
            onSave={onSave}
            onCancel={onCancel}
        >
            <InputField
                icon={MapPin}
                label="City"
                placeholder="San Francisco"
                value={profile.city}
                onChange={( value ) => onChange( 'city', value )}
                disabled={!isEditing}
            />
            <InputField
                icon={MapPin}
                label="State / Province"
                placeholder="California"
                value={profile.state}
                onChange={( value ) => onChange( 'state', value )}
                disabled={!isEditing}
            />
            <InputField
                icon={Globe}
                label="Country"
                placeholder="United States"
                value={profile.country}
                onChange={( value ) => onChange( 'country', value )}
                disabled={!isEditing}
            />
        </ProfileSection>
    );
}
