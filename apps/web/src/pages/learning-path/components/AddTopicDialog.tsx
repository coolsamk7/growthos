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
import { createUserTopic, UserTopic } from '@/services/user-topic.service';
import { useToast } from '@/hooks/use-toast';

interface AddTopicDialogProps {
    userLearningPathId: string;
    userModuleId: string;
    onSuccess?: ( topic: UserTopic ) => void;
}

export function AddTopicDialog( { userLearningPathId, userModuleId, onSuccess }: AddTopicDialogProps ) {
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
                description: 'Topic name is required',
            } );
            return;
        }

        try {
            setLoading( true );
            const topic = await createUserTopic( {
                userLearningPathId,
                userModuleId,
                name: formData.name,
                description: formData.description || undefined,
            } );

            toast( {
                title: 'Success',
                description: 'Topic created successfully',
            } );

            setFormData( { name: '', description: '' } );
            setOpen( false );
            onSuccess?.( topic );
        } catch ( error: any ) {
            toast( {
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to create topic',
            } );
        } finally {
            setLoading( false );
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <Plus className="mr-2 size-4" />
                    Add Topic
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New Topic</DialogTitle>
                        <DialogDescription>
                            Create a new topic to organize your problems and resources.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">
                                Topic Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                placeholder="e.g., Two Pointers"
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
                                placeholder="Describe what this topic covers..."
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
                            {loading ? 'Creating...' : 'Create Topic'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
