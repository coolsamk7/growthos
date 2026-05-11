import { useState } from 'react';
import { ChevronDown, ChevronRight, Edit2, Trash2, Star, StarOff, ExternalLink, Tags as TagsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { UserProblem, ProblemStatus, ProblemDifficulty } from '@/services/user-problem.service';
import { useToast } from '@/hooks/use-toast';
import { TimerDialog } from '@/components/common/TimerDialog';
import { ResourcesList } from './ResourcesList';
import { useItemTags, useTags, useAttachTags } from '@/hooks/useTags';
import { Tag, TagSelector } from '@/components/common';

const difficultyColors: Record<ProblemDifficulty, string> = {
    EASY: 'bg-green-500/10 text-green-700 dark:text-green-400',
    MEDIUM: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    HARD: 'bg-red-500/10 text-red-700 dark:text-red-400',
};

interface ProblemCardProps {
    problem: UserProblem;
    topicId: string;
    isExpanded: boolean;
    onToggle: () => void;
    onStatusChange: ( status: ProblemStatus ) => void;
    onToggleStar: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export function ProblemCard( {
    problem,
    topicId,
    isExpanded,
    onToggle,
    onStatusChange,
    onToggleStar,
    onEdit,
    onDelete,
}: ProblemCardProps ) {
    const [ isEditingTags, setIsEditingTags ] = useState( false );
    const { toast } = useToast();

    // Tag management
    const { tags: allTags } = useTags();
    const { tags: problemTags, refetch: refetchTags } = useItemTags( 'user-problem', problem.id );
    const { attachTags, attaching } = useAttachTags( 'user-problem' );
    const [ selectedTags, setSelectedTags ] = useState<any[]>( [] );

    // Sync selected tags
    useState( () => {
        setSelectedTags(
            problemTags.map( ( t ) => ( {
                id: t.id,
                name: t.name,
                color: t.color,
                category: t.category,
            } ) )
        );
    }, [ problemTags ] );

    const handleSaveTags = async () => {
        try {
            await attachTags( problem.id, selectedTags.map( ( t ) => t.id ) );
            toast( {
                title: 'Success',
                description: 'Tags updated successfully',
            } );
            refetchTags();
            setIsEditingTags( false );
        } catch ( error: any ) {
            toast( {
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to update tags',
            } );
        }
    };

    return (
        <div className="rounded border overflow-hidden bg-background">
            <div className="flex items-start justify-between gap-2 p-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 shrink-0"
                    onClick={onToggle}
                >
                    {isExpanded ? (
                        <ChevronDown className="size-4" />
                    ) : (
                        <ChevronRight className="size-4" />
                    )}
                </Button>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium flex items-center gap-1">
                            {problem.isStarred && (
                                <Star className="size-3 fill-amber-500 text-amber-500" />
                            )}
                            {problem.title}
                        </p>
                        {problem.externalUrl && (
                            <a
                                href={problem.externalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary"
                            >
                                <ExternalLink className="size-3" />
                            </a>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge
                            variant="secondary"
                            className={`text-xs ${difficultyColors[problem.difficulty]}`}
                        >
                            {problem.difficulty}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{problem.source}</span>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <TimerDialog
                        title={problem.title}
                        userTopicId={topicId}
                        userProblemId={problem.id}
                        onSessionComplete={() => {
                            toast( {
                                title: 'Session completed!',
                                description: 'Your study session has been saved.',
                            } );
                        }}
                    />
                    <Select value={problem.status} onValueChange={onStatusChange}>
                        <SelectTrigger className="w-[110px] h-7 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="TODO">To Do</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="SOLVED">Solved</SelectItem>
                            <SelectItem value="REVIEWED">Reviewed</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button size="icon" variant="ghost" className="size-6" onClick={onToggleStar}>
                        {problem.isStarred ? (
                            <StarOff className="size-3" />
                        ) : (
                            <Star className="size-3" />
                        )}
                    </Button>
                    <Button size="icon" variant="ghost" className="size-6" onClick={onEdit}>
                        <Edit2 className="size-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="size-6" onClick={onDelete}>
                        <Trash2 className="size-3" />
                    </Button>
                </div>
            </div>

            {isExpanded && (
                <div className="border-t bg-muted/20 p-3 space-y-3">
                    {/* Tags Section */}
                    <div className="rounded-lg border bg-card p-2">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <TagsIcon className="h-3 w-3 text-muted-foreground" />
                                <h6 className="text-xs font-medium">Tags</h6>
                            </div>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 text-xs px-2"
                                onClick={() => setIsEditingTags( !isEditingTags )}
                            >
                                {isEditingTags ? 'Cancel' : 'Edit'}
                            </Button>
                        </div>

                        {isEditingTags ? (
                            <div className="space-y-2">
                                <TagSelector
                                    tags={allTags.map( ( t ) => ( {
                                        id: t.id,
                                        name: t.name,
                                        color: t.color,
                                        category: t.category,
                                    } ) )}
                                    selectedTags={selectedTags}
                                    onTagsChange={setSelectedTags}
                                    placeholder="Select tags..."
                                />
                                <Button
                                    size="sm"
                                    onClick={handleSaveTags}
                                    disabled={attaching}
                                    className="h-6 text-xs"
                                >
                                    {attaching ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        ) : (
                            <div className="flex gap-1 flex-wrap">
                                {problemTags.length === 0 ? (
                                    <span className="text-xs text-muted-foreground">No tags</span>
                                ) : (
                                    problemTags.map( ( tag ) => (
                                        <Tag key={tag.id} name={tag.name} color={tag.color} className="text-xs" />
                                    ) )
                                )}
                            </div>
                        )}
                    </div>

                    <ResourcesList entityType="problem" entityId={problem.id} />
                </div>
            )}
        </div>
    );
}
