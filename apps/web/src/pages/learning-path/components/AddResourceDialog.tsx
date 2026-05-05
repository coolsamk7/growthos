import { useState } from 'react';
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
import { createResource, Resource, ResourceEntityType } from '@/services/resource.service';
import { useToast } from '@/hooks/use-toast';

interface AddResourceDialogProps {
    entityType: ResourceEntityType;
    entityId: string;
    open: boolean;
    onOpenChange: ( open: boolean ) => void;
    onSuccess?: ( resource: Resource ) => void;
}

const resourceTypes = [
    { value: 'video', label: 'Video' },
    { value: 'article', label: 'Article' },
    { value: 'documentation', label: 'Documentation' },
    { value: 'tutorial', label: 'Tutorial' },
    { value: 'book', label: 'Book' },
    { value: 'course', label: 'Course' },
    { value: 'other', label: 'Other' },
];

export function AddResourceDialog( { entityType, entityId, open, onOpenChange, onSuccess }: AddResourceDialogProps ) {
    const [ loading, setLoading ] = useState( false );
    const { toast } = useToast();

    const [ formData, setFormData ] = useState( {
        title: '',
        url: '',
        type: 'article',
        description: '',
    } );

    const handleSubmit = async ( e: React.FormEvent ) => {
        e.preventDefault();

        if ( !formData.title.trim() || !formData.url.trim() ) {
            toast( {
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Title and URL are required',
            } );
            return;
        }

        try {
            setLoading( true );
            const resource = await createResource( {
                entityType,
                entityId,
                title: formData.title,
                url: formData.url,
                type: formData.type,
                description: formData.description || undefined,
            } );

            toast( {
                title: 'Success',
                description: 'Resource added successfully',
            } );

            setFormData( { title: '', url: '', type: 'article', description: '' } );
            onOpenChange( false );
            onSuccess?.( resource );
        } catch ( error: any ) {
            toast( {
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to add resource',
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
                        <DialogTitle>Add Resource Link</DialogTitle>
                        <DialogDescription>
                            Add a helpful link or resource for this {entityType}.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="resource-title">
                                Title <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="resource-title"
                                placeholder="e.g., React Documentation"
                                value={formData.title}
                                onChange={( e ) =>
                                    setFormData( ( prev ) => ( { ...prev, title: e.target.value } ) )
                                }
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="resource-url">
                                URL <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="resource-url"
                                type="url"
                                placeholder="https://..."
                                value={formData.url}
                                onChange={( e ) =>
                                    setFormData( ( prev ) => ( { ...prev, url: e.target.value } ) )
                                }
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="resource-type">Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={( value ) =>
                                    setFormData( ( prev ) => ( { ...prev, type: value } ) )
                                }
                            >
                                <SelectTrigger id="resource-type">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {resourceTypes.map( ( type ) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ) )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="resource-description">Description (Optional)</Label>
                            <Textarea
                                id="resource-description"
                                rows={3}
                                placeholder="Brief description of this resource..."
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
                            onClick={() => onOpenChange( false )}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Resource'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
