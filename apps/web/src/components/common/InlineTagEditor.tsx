import React, { useState, useEffect, useRef } from 'react';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tag } from './Tag';

export interface TagOption {
    id: string;
    name: string;
    category?: string;
    color?: string;
}

interface InlineTagEditorProps {
    tags: TagOption[];
    selectedTags: TagOption[];
    onTagsChange: ( tags: TagOption[] ) => void;
    onSave: ( tagIds: string[] ) => void;
    saving?: boolean;
    className?: string;
}

export function InlineTagEditor( {
    tags,
    selectedTags,
    onTagsChange,
    onSave,
    saving = false,
    className,
}: InlineTagEditorProps ) {
    const [ open, setOpen ] = useState( false );
    const [ searchQuery, setSearchQuery ] = useState( '' );
    const containerRef = useRef<HTMLDivElement>( null );

    const filteredTags = tags.filter(
        tag => 
            tag.name.toLowerCase().includes( searchQuery.toLowerCase() ) &&
            !selectedTags.some( t => t.id === tag.id )
    );

    const handleRemove = async ( tagId: string ) => {
        console.log( 'Removing tag:', tagId );
        const newTags = selectedTags.filter( t => t.id !== tagId );
        console.log( 'New tags after remove:', newTags );
        onTagsChange( newTags );
        // Auto-save with the new tag list immediately
        setTimeout( () => {
            console.log( 'Calling onSave after remove with tags:', newTags.map( t => t.id ) );
            onSave( newTags.map( t => t.id ) );
        }, 100 );
    };

    const handleAdd = ( tag: TagOption ) => {
        console.log( 'Adding tag:', tag );
        const newTags = [ ...selectedTags, tag ];
        onTagsChange( newTags );
        setSearchQuery( '' );
        setOpen( false );
        // Auto-save with the new tag list immediately
        setTimeout( () => {
            console.log( 'Calling onSave after add with tags:', newTags.map( t => t.id ) );
            onSave( newTags.map( t => t.id ) );
        }, 100 );
    };

    const handleDoubleClick = ( e: React.MouseEvent ) => {
        // Don't open if clicking on a tag or button
        const target = e.target as HTMLElement;
        if ( target.closest( 'button' ) || target.closest( '.tag-item' ) ) {
            return;
        }
        setOpen( true );
    };

    return (
        <div
            ref={containerRef}
            className={cn( 'flex items-center gap-1 flex-wrap', className )}
            onDoubleClick={handleDoubleClick}
            title="Double-click to add tags"
        >
            {selectedTags.map( ( tag ) => (
                <span key={tag.id} className="tag-item">
                    <Tag
                        name={tag.name}
                        color={tag.color}
                        removable
                        onRemove={() => handleRemove( tag.id )}
                        className="text-xs py-0.5 px-2"
                    />
                </span>
            ) )}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium border border-dashed',
                            'hover:bg-muted transition-colors',
                            'text-muted-foreground border-muted-foreground/50'
                        )}
                        onClick={() => setOpen( true )}
                    >
                        <Plus className="h-3 w-3" />
                        Add tag
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2" align="start">
                    <div className="space-y-2">
                        <Input
                            placeholder="Search tags..."
                            value={searchQuery}
                            onChange={( e ) => setSearchQuery( e.target.value )}
                            autoFocus
                        />
                        <ScrollArea className="h-48">
                            {filteredTags.length === 0 ? (
                                <div className="p-4 text-sm text-center text-muted-foreground">
                                    {searchQuery ? 'No matching tags' : 'No more tags available'}
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {filteredTags.map( ( tag ) => (
                                        <button
                                            key={tag.id}
                                            onClick={() => handleAdd( tag )}
                                            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-accent transition-colors"
                                        >
                                            <Tag name={tag.name} color={tag.color} className="text-xs" />
                                            {tag.category && (
                                                <span className="ml-auto text-xs text-muted-foreground">
                                                    {tag.category}
                                                </span>
                                            )}
                                        </button>
                                    ) )}
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                </PopoverContent>
            </Popover>

            {saving && (
                <span className="text-xs text-muted-foreground">Saving...</span>
            )}
        </div>
    );
}
