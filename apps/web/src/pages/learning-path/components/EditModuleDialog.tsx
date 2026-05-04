import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { updateUserModule, UserModule, ModuleStatus } from '@/services/user-module.service';
import { useToast } from '@/hooks/use-toast';

interface EditModuleDialogProps {
    module: UserModule;
    open: boolean;
    onOpenChange: ( open: boolean ) => void;
    onSuccess?: ( module: UserModule ) => void;
}

export function EditModuleDialog( { module, open, onOpenChange, onSuccess }: EditModuleDialogProps ) {
    const [ loading, setLoading ] = useState( false );
    const { toast } = useToast();

    const [ formData, setFormData ] = useState( {
        name: module.name,
        description: module.description || '',
        status: module.status,
    } );

    useEffect( () => {
        if ( open ) {
            setFormData( {
                name: module.name,
                description: module.description || '',
                status: module.status,
            } );
        }
    }, [ open, module ] );

    const handleSubmit = async ( e: React.FormEvent ) => {
        e.preventDefault();

        if ( !formData.name.trim() ) {
            toast( {
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Module name is required',
            } );
            return;
        }

        try {
            setLoading( true );
            const updatedModule = await updateUserModule( module.id, {
                name: formData.name,
                description: formData.description || undefined,
                status: formData.status,
            } );

            toast( {
                title: 'Success',
                description: 'Module updated successfully',
            } );

            onOpenChange( false );
            onSuccess?.( updatedModule );
        } catch ( error: any ) {
            toast( {
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to update module',
            } );
        } finally {
            setLoading( false );
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Module</DialogTitle>
                        <DialogDescription>
                            Update the module information and track your progress.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">
                                Module Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={( e ) =>
                                    setFormData( ( prev ) => ( { ...prev, name: e.target.value } ) )
                                }
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                rows={3}
                                value={formData.description}
                                onChange={( e ) =>
                                    setFormData( ( prev ) => ( { ...prev, description: e.target.value } ) )
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={( value: ModuleStatus ) =>
                                    setFormData( ( prev ) => ( { ...prev, status: value } ) )
                                }
                            >
                                <SelectTrigger id="edit-status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange( false )}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
