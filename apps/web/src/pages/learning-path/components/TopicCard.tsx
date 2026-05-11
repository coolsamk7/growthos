import { useState } from 'react';
import { Trash2, Circle, PlayCircle, CheckCircle2, Award, ChevronDown, ChevronRight, Tags as TagsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { UserTopic, TopicStatus } from '@/services/user-topic.service';
import { useToast } from '@/hooks/use-toast';
import { TimerDialog } from '@/components/common/TimerDialog';
import { NotesList } from './NotesList';
import { ProblemsList } from './ProblemsList';
import { ResourcesList } from './ResourcesList';
import { useItemTags, useTags, useAttachTags } from '@/hooks/useTags';
import { Tag, TagSelector } from '@/components/common';

interface TopicCardProps {
    topic: UserTopic;
    userLearningPathId: string;
    isExpanded: boolean;
    statusInfo: { icon: any; color: string; label: string };
    onToggle: () => void;
    onStatusChange: ( status: TopicStatus ) => void;
    onDelete: () => void;
}

export function TopicCard( {
    topic,
    userLearningPathId,
    isExpanded,
    statusInfo,
    onToggle,
    onStatusChange,
    onDelete,
}: TopicCardProps ) {
    const [ isEditingTags, setIsEditingTags ] = useState( false );
    const { toast } = useToast();

    // Tag management
    const { tags: allTags } = useTags();
    const { tags: topicTags, refetch: refetchTags } = useItemTags( 'user-topic', topic.id );
    const { attachTags, attaching } = useAttachTags( 'user-topic' );
    const [ selectedTags, setSelectedTags ] = useState<any[]>( [] );

    // Sync selected tags
    useState( () => {
        setSelectedTags(
            topicTags.map( ( t ) => ( {
                id: t.id,
                name: t.name,
                color: t.color,
                category: t.category,
            } ) )
        );
    }, [ topicTags ] );

    const handleSaveTags = async () => {
        try {
            await attachTags( topic.id, selectedTags.map( ( t ) => t.id ) );
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

    const StatusIcon = statusInfo.icon;

    return (
        <div className="rounded-lg border overflow-hidden">
            <div className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors">
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-6"
                    onClick={onToggle}
                >
                    {isExpanded ? (
                        <ChevronDown className="size-4" />
                    ) : (
                        <ChevronRight className="size-4" />
                    )}
                </Button>

                <StatusIcon className={`size-4 ${statusInfo.color}`} />

                <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{topic.name}</p>
                    {topic.description && (
                        <p className="text-xs text-muted-foreground truncate">
                            {topic.description}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {typeof topic.problemCount === 'number' && (
                        <Badge variant="outline" className="text-xs">
                            {topic.problemCount} problems
                        </Badge>
                    )}

                    {topic.confidenceScore > 0 && (
                        <Badge variant="secondary" className="text-xs">
                            {topic.confidenceScore}%
                        </Badge>
                    )}

                    <TimerDialog
                        title={topic.name}
                        userLearningPathId={userLearningPathId}
                        userTopicId={topic.id}
                        onSessionComplete={() => {
                            toast( {
                                title: 'Session completed!',
                                description: 'Your study session has been saved.',
                            } );
                        }}
                    />

                    <Select value={topic.status} onValueChange={onStatusChange}>
                        <SelectTrigger className="w-[140px] h-8 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="MASTERED">Mastered</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={onDelete}
                    >
                        <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                </div>
            </div>

            {isExpanded && (
                <div className="border-t bg-muted/20 p-4 space-y-4">
                    {/* Tags Section */}
                    <div className="rounded-lg border bg-card p-3">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <TagsIcon className="h-4 w-4 text-muted-foreground" />
                                <h5 className="text-xs font-medium">Tags</h5>
                            </div>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs"
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
                                    placeholder="Select tags for this topic..."
                                />
                                <Button
                                    size="sm"
                                    onClick={handleSaveTags}
                                    disabled={attaching}
                                    className="h-7 text-xs"
                                >
                                    {attaching ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        ) : (
                            <div className="flex gap-1.5 flex-wrap">
                                {topicTags.length === 0 ? (
                                    <span className="text-xs text-muted-foreground">
                                        No tags
                                    </span>
                                ) : (
                                    topicTags.map( ( tag ) => (
                                        <Tag
                                            key={tag.id}
                                            name={tag.name}
                                            color={tag.color}
                                            className="text-xs"
                                        />
                                    ) )
                                )}
                            </div>
                        )}
                    </div>

                    <ResourcesList entityType="topic" entityId={topic.id} />
                    <NotesList topicId={topic.id} />
                    <ProblemsList topicId={topic.id} />
                </div>
            )}
        </div>
    );
}
