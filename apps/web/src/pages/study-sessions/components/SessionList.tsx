import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
    Clock, 
    Calendar, 
    FileText, 
    Edit, 
    Trash2, 
    AlertTriangle, 
    Link 
} from 'lucide-react';
import { format } from 'date-fns';
import type { StudySession } from '../../../services/study-session.service';

interface SessionListProps {
    sessions: StudySession[];
    loading: boolean;
    showOrphansOnly: boolean;
    orphanCount: number;
    onToggleOrphansFilter: () => void;
    onEdit: ( session: StudySession ) => void;
    onLink: ( session: StudySession ) => void;
    onDelete: ( id: string ) => void;
    formatDuration: ( session: StudySession ) => string;
}

export function SessionList( {
    sessions,
    loading,
    showOrphansOnly,
    orphanCount,
    onToggleOrphansFilter,
    onEdit,
    onLink,
    onDelete,
    formatDuration
}: SessionListProps ) {
    const isOrphanSession = ( session: StudySession ) => {
        const isOrphan = !session.userModuleId && !session.userTopicId && !session.userProblemId;
        // Also check if relations are loaded but null
        const hasNoRelations = !session.userModule && !session.userTopic && !session.userProblem;
        return isOrphan || hasNoRelations;
    };

    const getFilteredSessions = () => {
        if ( showOrphansOnly ) {
            return ( sessions || [] ).filter( isOrphanSession );
        }
        return sessions || [];
    };

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl">Session History</CardTitle>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Review your past study sessions
                        </p>
                    </div>
                    {orphanCount > 0 && (
                        <Button
                            variant={showOrphansOnly ? 'default' : 'outline'}
                            size="sm"
                            onClick={onToggleOrphansFilter}
                            className="gap-2"
                        >
                            <AlertTriangle className="h-4 w-4" />
                            {showOrphansOnly ? 'Show All' : `Orphans (${orphanCount})`}
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-6">
                {loading ? (
                    <div className="space-y-4">
                        {[ ...Array( 5 ) ].map( ( _, i ) => (
                            <div
                                key={i}
                                className="animate-pulse h-32 bg-gray-100 dark:bg-gray-800 rounded-xl"
                            />
                        ) )}
                    </div>
                ) : getFilteredSessions().length === 0 ? (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                            <Clock className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            {showOrphansOnly ? 'No orphan sessions' : 'No study sessions yet'}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {showOrphansOnly 
                                ? 'All your sessions are properly linked!' 
                                : 'Click "Start Session" above to begin tracking your study time'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {showOrphansOnly && (
                            <Alert className="bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-1">Orphan Sessions Found</h4>
                                        <AlertDescription className="text-amber-800 dark:text-amber-200 text-sm">
                                            These sessions are not linked to any module, topic, or problem. 
                                            Click the "Link" button to associate them with your learning content.
                                        </AlertDescription>
                                    </div>
                                </div>
                            </Alert>
                        )}
                        {getFilteredSessions().map( ( session ) => {
                            const isOrphan = isOrphanSession( session );
                            
                            return (
                                <div
                                    key={session.id}
                                    className={`group p-5 border rounded-xl transition-all
                                        ${isOrphan 
                                            ? 'border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/30 hover:shadow-amber-100 dark:hover:shadow-amber-900/20' 
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                        }
                                        hover:shadow-md`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-3">
                                            {/* Header with time and date */}
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Badge variant="secondary" className="font-medium">
                                                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                                                    {formatDuration( session )}
                                                </Badge>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    <Calendar className="h-3.5 w-3.5 inline mr-1" />
                                                    {format( new Date( session.sessionDate ), 'MMM dd, yyyy' )}
                                                </span>
                                                {isOrphan && (
                                                    <Badge variant="outline" className="text-amber-600 border-amber-400 bg-amber-50 dark:bg-amber-900/30">
                                                        <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                                                        Orphan
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Content details */}
                                            {!isOrphan ? (
                                                <div className="space-y-1.5 pl-1">
                                                    {session.userModule && (
                                                        <div className="flex items-start gap-2 text-sm">
                                                            <span className="text-gray-500 dark:text-gray-400 min-w-[60px] font-medium">Module:</span>
                                                            <span className="text-gray-900 dark:text-gray-100">{session.userModule.name}</span>
                                                        </div>
                                                    )}

                                                    {session.userTopic && (
                                                        <div className="flex items-start gap-2 text-sm">
                                                            <span className="text-gray-500 dark:text-gray-400 min-w-[60px] font-medium">Topic:</span>
                                                            <span className="text-gray-900 dark:text-gray-100">{session.userTopic.name}</span>
                                                        </div>
                                                    )}

                                                    {session.userProblem && (
                                                        <div className="flex items-start gap-2 text-sm">
                                                            <span className="text-gray-500 dark:text-gray-400 min-w-[60px] font-medium">Problem:</span>
                                                            <span className="text-gray-900 dark:text-gray-100">{session.userProblem.title}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-sm text-amber-700 dark:text-amber-300 italic pl-1 flex items-center gap-2">
                                                    <FileText className="h-4 w-4" />
                                                    Not linked to any content yet
                                                </div>
                                            )}

                                            {/* Notes */}
                                            {session.notes && (
                                                <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                                                    <div className="flex items-start gap-2">
                                                        <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                                        <span>{session.notes}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {isOrphan && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-amber-600 border-amber-300 hover:bg-amber-50 hover:border-amber-400 dark:border-amber-700 dark:hover:bg-amber-900/20"
                                                    onClick={() => onLink( session )}
                                                >
                                                    <Link className="h-3.5 w-3.5" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20"
                                                onClick={() => onEdit( session )}
                                            >
                                                <Edit className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                                                onClick={() => onDelete( session.id )}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        } )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
