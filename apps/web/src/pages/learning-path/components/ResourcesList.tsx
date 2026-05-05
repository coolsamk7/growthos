import { useState, useEffect } from 'react';
import { Link2, Plus, Trash2, ExternalLink, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { getResources, Resource, ResourceEntityType, deleteResource, updateResource } from '@/services/resource.service';
import { useToast } from '@/hooks/use-toast';
import { AddResourceDialog } from './AddResourceDialog';

interface ResourcesListProps {
    entityType: ResourceEntityType;
    entityId: string;
}

export function ResourcesList( { entityType, entityId }: ResourcesListProps ) {
    const [ resources, setResources ] = useState<Resource[]>( [] );
    const [ loading, setLoading ] = useState( true );
    const [ dialogOpen, setDialogOpen ] = useState( false );
    const { toast } = useToast();

    useEffect( () => {
        fetchResources();
    }, [ entityType, entityId ] );

    const fetchResources = async () => {
        try {
            setLoading( true );
            console.log( '[ResourcesList] Fetching resources:', { entityType, entityId } );
            const result = await getResources( entityType, entityId );
            console.log( '[ResourcesList] Received resources:', result );
            setResources( result.data );
        } catch ( error: any ) {
            console.error( '[ResourcesList] Error:', error );
            toast( {
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to load resources',
            } );
        } finally {
            setLoading( false );
        }
    };

    const handleResourceCreated = ( newResource: Resource ) => {
        setResources( ( prev ) => [ ...prev, newResource ] );
    };

    const handleToggleComplete = async ( resource: Resource ) => {
        try {
            await updateResource( resource.id, { isCompleted: !resource.isCompleted } );
            setResources( ( prev ) =>
                prev.map( ( r ) => ( r.id === resource.id ? { ...r, isCompleted: !r.isCompleted } : r ) )
            );
        } catch ( error: any ) {
            toast( {
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to update resource',
            } );
        }
    };

    const handleDelete = async ( resourceId: string ) => {
        if ( !confirm( 'Are you sure you want to delete this resource?' ) ) return;

        try {
            await deleteResource( resourceId );
            setResources( ( prev ) => prev.filter( ( r ) => r.id !== resourceId ) );
            toast( {
                title: 'Success',
                description: 'Resource deleted successfully',
            } );
        } catch ( error: any ) {
            toast( {
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to delete resource',
            } );
        }
    };

    if ( loading ) {
        return <div className="text-xs text-muted-foreground">Loading resources...</div>;
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <h5 className="text-xs font-semibold flex items-center gap-2">
                    <Link2 className="size-3" />
                    Resources ({resources.length})
                </h5>
                <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs"
                    onClick={() => setDialogOpen( true )}
                >
                    <Plus className="mr-1 size-3" />
                    Add Link
                </Button>
            </div>

            {resources.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No resources yet</p>
            ) : (
                <div className="space-y-1">
                    {resources.map( ( resource ) => (
                        <div key={resource.id} className="rounded border p-2 bg-background hover:bg-muted/50 transition-colors">
                            <div className="flex items-start gap-2">
                                <Checkbox
                                    checked={resource.isCompleted}
                                    onCheckedChange={() => handleToggleComplete( resource )}
                                    className="mt-0.5"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium hover:underline flex items-center gap-1"
                                        >
                                            {resource.title}
                                            <ExternalLink className="size-3" />
                                        </a>
                                        {resource.type && (
                                            <Badge variant="outline" className="text-xs">
                                                {resource.type}
                                            </Badge>
                                        )}
                                        {resource.isCompleted && (
                                            <Check className="size-3 text-green-600" />
                                        )}
                                    </div>
                                    {resource.description && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {resource.description}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="size-6"
                                    onClick={() => handleDelete( resource.id )}
                                >
                                    <Trash2 className="size-3" />
                                </Button>
                            </div>
                        </div>
                    ) )}
                </div>
            )}

            <AddResourceDialog
                entityType={entityType}
                entityId={entityId}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSuccess={handleResourceCreated}
            />
        </div>
    );
}
