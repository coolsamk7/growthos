import React, { useState } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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

interface TagSelectorProps {
    tags: TagOption[];
    selectedTags: TagOption[];
    onTagsChange: ( tags: TagOption[] ) => void;
    placeholder?: string;
    emptyText?: string;
}

export function TagSelector( {
    tags,
    selectedTags,
    onTagsChange,
    placeholder = 'Select tags...',
    emptyText = 'No tags found.',
}: TagSelectorProps ) {
    const [ open, setOpen ] = useState( false );
    const [ searchQuery, setSearchQuery ] = useState( '' );

    const filteredTags = tags.filter( tag =>
        tag.name.toLowerCase().includes( searchQuery.toLowerCase() )
    );

    const handleSelect = ( tag: TagOption ) => {
        const isSelected = selectedTags.some( t => t.id === tag.id );
        if ( isSelected ) {
            onTagsChange( selectedTags.filter( t => t.id !== tag.id ) );
        } else {
            onTagsChange( [ ...selectedTags, tag ] );
        }
    };

    const handleRemove = ( tagId: string ) => {
        onTagsChange( selectedTags.filter( t => t.id !== tagId ) );
    };

    return (
        <div className="space-y-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {selectedTags.length > 0
                            ? `${selectedTags.length} tag(s) selected`
                            : placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-2">
                    <div className="space-y-2">
                        <Input
                            placeholder="Search tags..."
                            value={searchQuery}
                            onChange={( e ) => setSearchQuery( e.target.value )}
                        />
                        <ScrollArea className="h-64">
                            {filteredTags.length === 0 ? (
                                <div className="p-4 text-sm text-center text-muted-foreground">
                                    {emptyText}
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {filteredTags.map( ( tag ) => {
                                        const isSelected = selectedTags.some( t => t.id === tag.id );
                                        return (
                                            <button
                                                key={tag.id}
                                                onClick={() => handleSelect( tag )}
                                                className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-accent transition-colors"
                                            >
                                                <Check
                                                    className={cn(
                                                        'h-4 w-4 flex-shrink-0',
                                                        isSelected ? 'opacity-100' : 'opacity-0'
                                                    )}
                                                />
                                                <Tag name={tag.name} color={tag.color} />
                                                {tag.category && (
                                                    <span className="ml-auto text-xs text-muted-foreground">
                                                        {tag.category}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    } )}
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                </PopoverContent>
            </Popover>

            {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedTags.map( ( tag ) => (
                        <Tag
                            key={tag.id}
                            name={tag.name}
                            color={tag.color}
                            removable
                            onRemove={() => handleRemove( tag.id )}
                        />
                    ) )}
                </div>
            )}
        </div>
    );
}
