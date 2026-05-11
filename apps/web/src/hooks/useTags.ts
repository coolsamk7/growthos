import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
    getAllTags, 
    getItemTags, 
    attachTagsToItem, 
    detachTagFromItem,
    type Tag,
    type TagItemType
} from '@/services/tag.service';

export type { Tag, TagItemType };

export function useTags( category?: string ) {
    const [ tags, setTags ] = useState<Tag[]>( [] );
    const [ loading, setLoading ] = useState( true );
    const [ error, setError ] = useState<string | null>( null );

    useEffect( () => {
        fetchTags();
    }, [ category ] );

    const fetchTags = async () => {
        try {
            setLoading( true );
            setError( null );
            
            console.log( 'Fetching tags with category:', category );
            const result = await getAllTags( { 
                page: 1, 
                limit: 100,
                ...( category && { category } )
            } );
            console.log( 'Tags service response:', result );
            
            setTags( result.data || [] );
        } catch ( err: any ) {
            console.error( 'Error fetching tags:', err );
            const errorMessage = err.error?.message || err.message || 'Failed to fetch tags';
            setError( errorMessage );
            toast.error( `Failed to fetch tags: ${errorMessage}` );
            setTags( [] );
        } finally {
            setLoading( false );
        }
    };

    return { tags, loading, error, refetch: fetchTags };
}

export function useAttachTags( type: TagItemType ) {
    const [ attaching, setAttaching ] = useState( false );

    const attachTags = async ( itemId: string, tagIds: string[] ) => {
        try {
            setAttaching( true );
            console.log( `Attaching tags to ${type}/${itemId}:`, tagIds );
            
            await attachTagsToItem( type, itemId, tagIds );
            
            toast.success( 'Tags attached successfully' );
            return true;
        } catch ( err: any ) {
            console.error( `Error attaching tags to ${type}:`, err );
            const errorMessage = err.error?.message || err.response?.data?.message || err.message || 'Failed to attach tags';
            toast.error( errorMessage );
            return false;
        } finally {
            setAttaching( false );
        }
    };

    return { attachTags, attaching };
}

export function useDetachTag( type: TagItemType ) {
    const [ detaching, setDetaching ] = useState( false );

    const detachTag = async ( itemId: string, tagId: string ) => {
        try {
            setDetaching( true );
            console.log( `Detaching tag from ${type}/${itemId}/${tagId}` );
            
            await detachTagFromItem( type, itemId, tagId );
            
            toast.success( 'Tag removed successfully' );
            return true;
        } catch ( err: any ) {
            console.error( `Error detaching tag from ${type}:`, err );
            const errorMessage = err.error?.message || err.response?.data?.message || err.message || 'Failed to remove tag';
            toast.error( errorMessage );
            return false;
        } finally {
            setDetaching( false );
        }
    };

    return { detachTag, detaching };
}

export function useItemTags( type: TagItemType, itemId?: string ) {
    const [ tags, setTags ] = useState<Tag[]>( [] );
    const [ loading, setLoading ] = useState( false );
    const [ error, setError ] = useState<string | null>( null );

    useEffect( () => {
        if ( itemId ) {
            fetchItemTags();
        } else {
            setTags( [] );
            setLoading( false );
        }
    }, [ itemId, type ] );

    const fetchItemTags = async () => {
        if ( !itemId ) return;

        try {
            setLoading( true );
            setError( null );
            console.log( `Fetching tags for ${type}/${itemId}` );
            
            const tagsData = await getItemTags( type, itemId );
            
            console.log( `Tags for ${type}:`, tagsData );
            setTags( Array.isArray( tagsData ) ? tagsData : [] );
        } catch ( err: any ) {
            console.error( `Error fetching ${type} tags:`, err );
            const errorMessage = err.error?.message || err.response?.data?.message || err.message || 'Failed to fetch item tags';
            setError( errorMessage );
            // Don't show toast for 404 (item might not have tags yet)
            if ( err.status !== 404 && err.response?.status !== 404 ) {
                toast.error( `Failed to fetch tags: ${errorMessage}` );
            }
            setTags( [] );
        } finally {
            setLoading( false );
        }
    };

    return { tags, loading, error, refetch: fetchItemTags };
}
