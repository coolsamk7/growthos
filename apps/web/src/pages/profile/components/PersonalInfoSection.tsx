import { User, Mail, Phone } from 'lucide-react';
import { ProfileSection } from './ProfileSection';
import { InputField } from './FormFields';
import { DatePicker } from '@/components/ui/date-picker';

interface PersonalInfoSectionProps {
    profile: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        dateOfBirth: string;
    };
    isEditing: boolean;
    isSaving: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    onChange: ( field: string, value: string ) => void;
}

export function PersonalInfoSection( {
    profile,
    isEditing,
    isSaving,
    onEdit,
    onSave,
    onCancel,
    onChange,
}: PersonalInfoSectionProps ) {
    return (
        <ProfileSection
            title="Personal Information"
            icon={User}
            section="personal"
            isEditing={isEditing}
            isSaving={isSaving}
            onEdit={onEdit}
            onSave={onSave}
            onCancel={onCancel}
        >
            <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                    icon={User}
                    label="First Name"
                    placeholder="John"
                    value={profile.firstName}
                    onChange={( value ) => onChange( 'firstName', value )}
                    disabled={!isEditing}
                />
                <InputField
                    icon={User}
                    label="Last Name"
                    placeholder="Doe"
                    value={profile.lastName}
                    onChange={( value ) => onChange( 'lastName', value )}
                    disabled={!isEditing}
                />
            </div>
            <InputField
                icon={Mail}
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                value={profile.email}
                onChange={( value ) => onChange( 'email', value )}
                disabled={!isEditing}
            />
            <InputField
                icon={Phone}
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={profile.phone}
                onChange={( value ) => onChange( 'phone', value )}
                disabled={!isEditing}
            />
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Date of Birth</label>
                <DatePicker
                    value={profile.dateOfBirth}
                    onChange={( value ) => onChange( 'dateOfBirth', value )}
                    disabled={!isEditing}
                    placeholder="Select your birth date"
                />
            </div>
        </ProfileSection>
    );
}
