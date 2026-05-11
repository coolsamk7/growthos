import { useState, useEffect } from 'react';
import { BookOpen, Circle, PlayCircle, CheckCircle2, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUserTopics, UserTopic, TopicStatus, updateUserTopic, deleteUserTopic } from '@/services/user-topic.service';
import { useToast } from '@/hooks/use-toast';
import { AddTopicDialog } from './AddTopicDialog';
import { TopicCard } from './TopicCard';

interface TopicListProps {
    userLearningPathId: string;
    userModuleId: string;
}

const statusConfig: Record<TopicStatus, { icon: any; color: string; label: string }> = {
    NOT_STARTED: {
        icon: Circle,
        color: 'text-muted-foreground',
        label: 'Not Started',
    },
    IN_PROGRESS: {
        icon: PlayCircle,
        color: 'text-primary',
        label: 'In Progress',
    },
    COMPLETED: {
        icon: CheckCircle2,
        color: 'text-success',
        label: 'Completed',
    },
    MASTERED: {
        icon: Award,
        color: 'text-amber-500',
        label: 'Mastered',
    },
};

export function TopicList( { userLearningPathId, userModuleId }: TopicListProps ) {
    const [ topics, setTopics ] = useState<UserTopic[]>( [] );
    const [ loading, setLoading ] = useState( true );
    const [ expandedTopics, setExpandedTopics ] = useState<Set<string>>( new Set() );
    const [ page, setPage ] = useState( 1 );
    const [ totalTopics, setTotalTopics ] = useState( 0 );
    const [ hasMore, setHasMore ] = useState( false );
    const { toast } = useToast();
    
    console.log( 'TopicList - received userModuleId:', userModuleId, 'userLearningPathId:', userLearningPathId );
    
    const ITEMS_PER_PAGE = 10;

    useEffect( () => {
        setPage( 1 );
        setTopics( [] );
        fetchTopics( 1 );
    }, [ userModuleId ] );

    const fetchTopics = async ( pageNum: number = page ) => {
        try {
            setLoading( true );
            console.log( 'Fetching topics for module:', userModuleId, 'page:', pageNum );
            const result = await getUserTopics( userModuleId, pageNum, ITEMS_PER_PAGE );
            console.log( 'Topics result:', result );
            
            if ( pageNum === 1 ) {
                setTopics( result.data );
            } else {
                setTopics( ( prev ) => [ ...prev, ...result.data ] );
            }
            
            setTotalTopics( result.total );
            setHasMore( pageNum < result.totalPages );
            setPage( pageNum );
        } catch ( error: any ) {
            toast( {
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to load topics',
            } );
        } finally {
            setLoading( false );
        }
    };

    const handleTopicCreated = ( newTopic: UserTopic ) => {
        setTopics( ( prev ) => [ newTopic, ...prev ] );
        setTotalTopics( ( prev ) => prev + 1 );
    };

    const loadMore = () => {
        if ( !loading && hasMore ) {
            fetchTopics( page + 1 );
        }
    };

    const handleStatusChange = async ( topicId: string, newStatus: TopicStatus ) => {
        try {
            const updatedTopic = await updateUserTopic( topicId, { status: newStatus } );
            setTopics( ( prev ) =>
                prev.map( ( t ) => ( t.id === topicId ? { ...t, status: newStatus } : t ) )
            );
            toast( {
                title: 'Success',
                description: 'Topic status updated',
            } );
        } catch ( error: any ) {
            toast( {
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to update topic',
            } );
        }
    };

    const handleDelete = async ( topicId: string ) => {
        if ( !confirm( 'Are you sure you want to delete this topic?' ) ) {
            return;
        }

        try {
            await deleteUserTopic( topicId );
            setTopics( ( prev ) => prev.filter( ( t ) => t.id !== topicId ) );
            toast( {
                title: 'Success',
                description: 'Topic deleted successfully',
            } );
        } catch ( error: any ) {
            toast( {
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to delete topic',
            } );
        }
    };

    const toggleTopic = ( topicId: string ) => {
        setExpandedTopics( ( prev ) => {
            const next = new Set( prev );
            if ( next.has( topicId ) ) {
                next.delete( topicId );
            } else {
                next.add( topicId );
            }
            return next;
        } );
    };

    if ( loading && topics.length === 0 ) {
        return <div className="text-center py-4 text-sm text-muted-foreground">Loading topics...</div>;
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                    <BookOpen className="size-4" />
                    Topics ({totalTopics})
                </h4>
                <AddTopicDialog
                    userLearningPathId={userLearningPathId}
                    userModuleId={userModuleId}
                    onSuccess={handleTopicCreated}
                />
            </div>

            {topics.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground border rounded-lg border-dashed">
                    No topics yet. Add your first topic to get started.
                </div>
            ) : (
                <div className="space-y-2">
                    {topics
                        .sort( ( a, b ) => ( a.orderIndex || 0 ) - ( b.orderIndex || 0 ) )
                        .map( ( topic ) => (
                            <TopicCard
                                key={topic.id}
                                topic={topic}
                                userLearningPathId={userLearningPathId}
                                isExpanded={expandedTopics.has( topic.id )}
                                statusInfo={statusConfig[topic.status]}
                                onToggle={() => toggleTopic( topic.id )}
                                onStatusChange={( newStatus ) =>
                                    handleStatusChange( topic.id, newStatus )
                                }
                                onDelete={() => handleDelete( topic.id )}
                            />
                        ) )}
                </div>
            )}
            
            {hasMore && (
                <div className="text-center pt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={loadMore}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Load More Topics'}
                    </Button>
                </div>
            )}
        </div>
    );
}
