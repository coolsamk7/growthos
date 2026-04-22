import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Save, X } from 'lucide-react';

interface ProfileSectionProps {
    title: string;
    icon: React.ElementType;
    section: string;
    isEditing: boolean;
    isSaving: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    children: React.ReactNode;
}

export function ProfileSection( {
    title,
    icon: Icon,
    section,
    isEditing,
    isSaving,
    onEdit,
    onSave,
    onCancel,
    children,
}: ProfileSectionProps ) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="flex items-center gap-2">
                    <Icon className="size-5 text-primary" />
                    {title}
                </CardTitle>
                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onCancel}
                                disabled={isSaving}
                            >
                                <X className="size-4" />
                            </Button>
                            <Button
                                size="sm"
                                onClick={onSave}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <div className="mr-2 size-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        Saving
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 size-4" />
                                        Save
                                    </>
                                )}
                            </Button>
                        </>
                    ) : (
                        <Button variant="ghost" size="sm" onClick={onEdit}>
                            <Edit2 className="size-4" />
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {children}
            </CardContent>
        </Card>
    );
}
