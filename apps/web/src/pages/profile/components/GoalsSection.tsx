import { GraduationCap } from 'lucide-react';
import { ProfileSection } from './ProfileSection';
import { InputField, SelectField } from './FormFields';
import { Separator } from '@/components/ui/separator';

const learningGoalOptions = [
    'Career Switch',
    'Skill Enhancement',
    'Competitive Exams',
    'Personal Growth',
    'Academic Excellence',
    'Certification',
];

interface GoalsSectionProps {
    profile: {
        learningGoal: string;
        targetExam: string;
        bio: string;
    };
    isEditing: boolean;
    isSaving: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    onChange: ( field: string, value: string ) => void;
}

export function GoalsSection( {
    profile,
    isEditing,
    isSaving,
    onEdit,
    onSave,
    onCancel,
    onChange,
}: GoalsSectionProps ) {
    return (
        <ProfileSection
            title="Learning Goals"
            icon={GraduationCap}
            section="goals"
            isEditing={isEditing}
            isSaving={isSaving}
            onEdit={onEdit}
            onSave={onSave}
            onCancel={onCancel}
        >
            <SelectField
                icon={GraduationCap}
                label="Primary Learning Goal"
                options={learningGoalOptions}
                value={profile.learningGoal}
                onChange={( value ) => onChange( 'learningGoal', value )}
                disabled={!isEditing}
            />
            <InputField
                icon={GraduationCap}
                label="Target Exam / Certification"
                placeholder="AWS Solutions Architect"
                value={profile.targetExam}
                onChange={( value ) => onChange( 'targetExam', value )}
                disabled={!isEditing}
            />
            <Separator className="my-2" />
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Bio</label>
                <textarea
                    value={profile.bio}
                    onChange={( e ) => onChange( 'bio', e.target.value )}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
            </div>
        </ProfileSection>
    );
}
