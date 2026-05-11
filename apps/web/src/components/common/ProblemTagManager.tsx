import React, { useState, useEffect } from 'react';
import { TagSelector, Tag, type TagOption } from '@/components/common';
import { useTags, useAttachTags, useItemTags } from '@/hooks/useTags';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';

interface ProblemTagManagerProps {
    problemId: string;
    problemType: 'master-problem' | 'user-problem';
    onTagsUpdated?: () => void;
}

/**
 * Example component showing how to manage tags for problems.
 * Can be adapted for modules and topics.
 */
export function ProblemTagManager( {
    problemId,
    problemType,
    onTagsUpdated,
}: ProblemTagManagerProps ) {
    const { tags: allTags, loading: loadingAllTags } = useTags();
    const { tags: currentTags, loading: loadingCurrentTags, refetch } = useItemTags(
        problemType,
        problemId
    );
    const { attachTags, attaching } = useAttachTags( problemType );

    const [ selectedTags, setSelectedTags ] = useState<TagOption[]>( [] );

    useEffect( () => {
        setSelectedTags(
            currentTags.map( tag => ( {
                id: tag.id,
                name: tag.name,
                category: tag.category,
                color: tag.color,
            } ) )
        );
    }, [ currentTags ] );

    const handleSave = async () => {
        const tagIds = selectedTags.map( t => t.id );
        const success = await attachTags( problemId, tagIds );
        if ( success ) {
            await refetch();
            onTagsUpdated?.();
        }
    };

    const tagOptions: TagOption[] = allTags.map( tag => ( {
        id: tag.id,
        name: tag.name,
        category: tag.category,
        color: tag.color,
    } ) );

    if ( loadingAllTags || loadingCurrentTags ) {
        return (
            <div className="flex items-center justify-center p-4">
                <Loader className="h-6 w-6 animate-spin" />
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Tags</CardTitle>
                <CardDescription>
                    Add tags to categorize and organize this problem
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <TagSelector
                    tags={tagOptions}
                    selectedTags={selectedTags}
                    onTagsChange={setSelectedTags}
                    placeholder="Select tags to categorize this problem..."
                />

                <Button onClick={handleSave} disabled={attaching} className="w-full">
                    {attaching ? (
                        <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Save Tags'
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
