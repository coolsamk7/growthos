import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createUserModule, UserModule } from '@/services/user-module.service';
import { useToast } from '@/hooks/use-toast';

interface AddModuleDialogProps {
    userLearningPathId: string;
    onSuccess?: ( module: UserModule ) => void;
}

export function AddModuleDialog( { userLearningPathId, onSuccess }: AddModuleDialogProps ) {
    const [ open, setOpen ] = useState( false );
    const [ loading, setLoading ] = useState( false );
    const { toast } = useToast();

    const [ formData, setFormData ] = useState( {
        name: '',
        description: '',
    } );

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
            const module = await createUserModule( {
                userLearningPathId,
                name: formData.name,
                description: formData.description || undefined,
            } );

            toast( {
                title: 'Success',
                description: 'Module created successfully',
            } );

            setFormData( { name: '', description: '' } );
            setOpen( false );
            onSuccess?.( module );
        } catch ( error: any ) {
            toast( {
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to create module',
            } );
        } finally {
            setLoading( false );
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-2 size-4" />
                    Add Module
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New Module</DialogTitle>
                        <DialogDescription>
                            Create a new module in this learning path to organize your topics and problems.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">
                                Module Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                placeholder="e.g., Arrays & Strings"
                                value={formData.name}
                                onChange={( e ) =>
                                    setFormData( ( prev ) => ( { ...prev, name: e.target.value } ) )
                                }
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe what this module covers..."
                                rows={4}
                                value={formData.description}
                                onChange={( e ) =>
                                    setFormData( ( prev ) => ( { ...prev, description: e.target.value } ) )
                                }
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen( false )}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Module'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
