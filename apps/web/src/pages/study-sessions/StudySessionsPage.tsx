import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square } from 'lucide-react';
import { PomodoroTimer } from '@/components/common/PomodoroTimer';
import { HeatmapCalendar } from '@/components/common/HeatmapCalendar';
import type { ContentSelection } from '@/components/common/ContentTreePicker';
import { 
    getStudySessions,
    searchStudySessions, 
    updateStudySession, 
    deleteStudySession,
    type StudySession,
    type SearchFilters
} from '@/services/study-session.service';
import { 
    SessionStatsSummary,
    SessionList,
    EditNotesDialog,
    LinkSessionDialog,
    SessionPagination,
    SessionSearch
} from './components';
import { toast } from 'sonner';

export function StudySessionsPage() {
    const [ sessions, setSessions ] = useState<StudySession[]>( [] );
    const [ loading, setLoading ] = useState( true );
    const [ page, setPage ] = useState( 1 );
    const [ totalPages, setTotalPages ] = useState( 1 );
    const [ showTimer, setShowTimer ] = useState( false );
    const [ editingSession, setEditingSession ] = useState<StudySession | null>( null );
    const [ editNotes, setEditNotes ] = useState( '' );
    const [ linkingSession, setLinkingSession ] = useState<StudySession | null>( null );
    const [ showOrphansOnly, setShowOrphansOnly ] = useState( false );
    const [ linkSelection, setLinkSelection ] = useState<ContentSelection>( {} );
    const [ selectedLearningPathId, setSelectedLearningPathId ] = useState<string>( '' );
    const [ searchFilters, setSearchFilters ] = useState<SearchFilters>( {} );
    const [ contentNames, setContentNames ] = useState<{ 
        modules: Record<string, string>; 
        topics: Record<string, string>; 
        problems: Record<string, string> 
    }>( { modules: {}, topics: {}, problems: {} } );

    useEffect( () => {
        loadSessions();
    }, [ page ] );

    const loadSessions = async () => {
        try {
            setLoading( true );
            
            // Check if we have active filters
            const hasFilters = Object.keys( searchFilters ).some( 
                k => k !== 'page' && k !== 'limit' && searchFilters[k as keyof SearchFilters] 
            );
            
            let response;
            if ( hasFilters ) {
                response = await searchStudySessions( { ...searchFilters, page, limit: 20 } );
            } else {
                response = await getStudySessions( { page, limit: 20 } );
            }
            
            setSessions( response.sessions );
            setTotalPages( response.totalPages );
        } catch ( error: any ) {
            toast.error( error.response?.data?.message || 'Failed to load study sessions' );
        } finally {
            setLoading( false );
        }
    };

    const handleSearch = () => {
        setPage( 1 ); // Reset to first page when searching
        loadSessions();
    };

    const handleEditOpen = ( session: StudySession ) => {
        setEditingSession( session );
        setEditNotes( session.notes || '' );
    };

    const handleEditSave = async () => {
        if ( !editingSession ) return;

        try {
            await updateStudySession( editingSession.id, { notes: editNotes } );
            toast.success( 'Notes updated successfully!' );
            setEditingSession( null );
            loadSessions();
        } catch ( error: any ) {
            toast.error( error.response?.data?.message || 'Failed to update notes' );
        }
    };

    const handleDelete = async ( id: string ) => {
        if ( !confirm( 'Are you sure you want to delete this session?' ) ) {
            return;
        }

        try {
            await deleteStudySession( id );
            toast.success( 'Session deleted successfully!' );
            loadSessions();
        } catch ( error: any ) {
            toast.error( error.response?.data?.message || 'Failed to delete session' );
        }
    };

    const handleLinkSession = async () => {
        if ( !linkingSession || !linkSelection.moduleId ) {
            toast.error( 'Please select at least a module' );
            return;
        }

        if ( !selectedLearningPathId ) {
            toast.error( 'Please select a learning path' );
            return;
        }

        try {
            const updateData: any = {
                userLearningPathId: selectedLearningPathId,
                userModuleId: linkSelection.moduleId,
            };

            if ( linkSelection.topicId ) {
                updateData.userTopicId = linkSelection.topicId;
            }

            if ( linkSelection.problemId ) {
                updateData.userProblemId = linkSelection.problemId;
            }

            await updateStudySession( linkingSession.id, updateData );
            
            toast.success( 'Session linked successfully!' );
            setLinkingSession( null );
            setLinkSelection( {} );
            setSelectedLearningPathId( '' );
            loadSessions();
        } catch ( error: any ) {
            toast.error( error.response?.data?.message || 'Failed to link session' );
        }
    };

    const formatDuration = ( session: StudySession ) => {
        const totalSeconds = session.durationSeconds || session.durationMinutes * 60 || 0;
        const minutes = Math.floor( totalSeconds / 60 );
        const seconds = totalSeconds % 60;
        return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
    };

    const formatTotalTime = ( totalSeconds: number ) => {
        const hours = Math.floor( totalSeconds / 3600 );
        const minutes = Math.floor( ( totalSeconds % 3600 ) / 60 );
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    };

    const getOrphanCount = () => {
        return ( sessions || [] ).filter( session => {
            const hasNoIds = !session.userModuleId && !session.userTopicId && !session.userProblemId;
            const hasNoRelations = !session.userModule && !session.userTopic && !session.userProblem;
            return hasNoIds || hasNoRelations;
        } ).length;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Study Sessions</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Track your study time and monitor your progress
                        </p>
                    </div>
                    <Button 
                        onClick={() => setShowTimer( true )}
                        size="lg"
                        className="shadow-md"
                    >
                        <Play className="h-5 w-5 mr-2" />
                        Start Session
                    </Button>
                </div>

                {/* Stats Summary */}
                <div className="mb-8">
                    <SessionStatsSummary 
                        sessions={sessions}
                        formatTotalTime={formatTotalTime}
                    />
                </div>

                {/* Heatmap */}
                <div className="mb-8">
                    <HeatmapCalendar />
                </div>

                {/* Search and Filters */}
                <div className="mb-6">
                    <SessionSearch
                        filters={searchFilters}
                        onFiltersChange={setSearchFilters}
                        onSearch={handleSearch}
                        moduleNames={contentNames.modules}
                        topicNames={contentNames.topics}
                    />
                </div>

                {/* Sessions List */}
                <SessionList
                    sessions={sessions}
                    loading={loading}
                    showOrphansOnly={showOrphansOnly}
                    orphanCount={getOrphanCount()}
                    onToggleOrphansFilter={() => setShowOrphansOnly( !showOrphansOnly )}
                    onEdit={handleEditOpen}
                    onLink={setLinkingSession}
                    onDelete={handleDelete}
                    formatDuration={formatDuration}
                />

                {/* Pagination */}
                <SessionPagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />

                {/* Dialogs */}
                <EditNotesDialog
                    session={editingSession}
                    notes={editNotes}
                    onNotesChange={setEditNotes}
                    onClose={() => setEditingSession( null )}
                    onSave={handleEditSave}
                />

                <LinkSessionDialog
                    session={linkingSession}
                    selection={linkSelection}
                    contentNames={contentNames}
                    formatDuration={formatDuration}
                    onSelectionChange={setLinkSelection}
                    onLearningPathChange={setSelectedLearningPathId}
                    onNamesLoaded={setContentNames}
                    onClose={() => {
                        setLinkingSession( null );
                        setLinkSelection( {} );
                        setSelectedLearningPathId( '' );
                        setContentNames( { modules: {}, topics: {}, problems: {} } );
                    }}
                    onLink={handleLinkSession}
                />

                {showTimer && (
                    <PomodoroTimer
                        onClose={() => setShowTimer( false )}
                        onSessionComplete={loadSessions}
                    />
                )}
            </div>
        </div>
    );
}
