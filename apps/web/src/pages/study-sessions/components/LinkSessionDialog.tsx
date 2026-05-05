import { useState, useEffect } from 'react';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Link } from 'lucide-react';
import { format } from 'date-fns';
import { ContentTreePicker, type ContentSelection } from '@/components/common/ContentTreePicker';
import { getLearingPaths } from '@/services/learning-path.service';
import type { StudySession } from '../../../services/study-session.service';

interface LinkSessionDialogProps {
    session: StudySession | null;
    selection: ContentSelection;
    contentNames: {
        modules: Record<string, string>;
        topics: Record<string, string>;
        problems: Record<string, string>;
    };
    formatDuration: ( session: StudySession ) => string;
    onSelectionChange: ( selection: ContentSelection ) => void;
    onLearningPathChange: ( learningPathId: string ) => void;
    onNamesLoaded: ( names: { modules: Record<string, string>; topics: Record<string, string>; problems: Record<string, string> } ) => void;
    onClose: () => void;
    onLink: () => void;
}

export function LinkSessionDialog( {
    session,
    selection,
    contentNames,
    formatDuration,
    onSelectionChange,
    onLearningPathChange,
    onNamesLoaded,
    onClose,
    onLink
}: LinkSessionDialogProps ) {
    const [ selectedLearningPathId, setSelectedLearningPathId ] = useState<string>( '' );
    const [ learningPaths, setLearningPaths ] = useState<any[]>( [] );
    const [ loading, setLoading ] = useState( false );

    useEffect( () => {
        if ( session ) {
            loadLearningPaths();
            if ( session.userLearningPathId ) {
                setSelectedLearningPathId( session.userLearningPathId );
            }
        }
    }, [ session ] );

    const loadLearningPaths = async () => {
        try {
            setLoading( true );
            const paths = await getLearingPaths();
            setLearningPaths( paths );
        } catch ( error ) {
            console.error( 'Failed to load learning paths:', error );
        } finally {
            setLoading( false );
        }
    };

    const handleLearningPathChange = ( pathId: string ) => {
        setSelectedLearningPathId( pathId );
        onLearningPathChange( pathId );
        // Reset content selection when learning path changes
        onSelectionChange( {} );
    };

    return (
        <Dialog open={!!session} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Link Orphan Session to Content</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Alert className="bg-amber-50 dark:bg-amber-950 border-amber-200">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-amber-800 dark:text-amber-200">
                            Select the module, topic, or problem you were studying during this session.
                        </AlertDescription>
                    </Alert>

                    <div className="border-t pt-4">
                        <p className="text-sm font-medium mb-2">Session Details:</p>
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            <div>📅 {session && format( new Date( session.sessionDate ), 'MMM dd, yyyy' )}</div>
                            <div>⏱️ {session && formatDuration( session )}</div>
                            {session?.notes && <div>📝 {session.notes}</div>}
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <p className="text-sm font-medium mb-3">Select Learning Path:</p>
                        <Select 
                            value={selectedLearningPathId} 
                            onValueChange={handleLearningPathChange}
                            disabled={loading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a learning path..." />
                            </SelectTrigger>
                            <SelectContent>
                                {learningPaths.map( ( path ) => (
                                    <SelectItem key={path.id} value={path.id}>
                                        {path.title || path.name}
                                    </SelectItem>
                                ) )}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedLearningPathId && (
                        <div className="border-t pt-4">
                            <p className="text-sm font-medium mb-3">Select Content:</p>
                            <ContentTreePicker
                                learningPathId={selectedLearningPathId}
                                onSelect={onSelectionChange}
                                selectedIds={selection}
                                onNamesLoaded={onNamesLoaded}
                            />
                        </div>
                    )}

                    {selection.moduleId && (
                        <div className="border-t pt-4">
                            <p className="text-sm font-medium mb-2">Selected:</p>
                            <div className="space-y-1 text-sm">
                                <div>📦 Module: {contentNames.modules[selection.moduleId] || selection.moduleId}</div>
                                {selection.topicId && <div>🎯 Topic: {contentNames.topics[selection.topicId] || selection.topicId}</div>}
                                {selection.problemId && <div>📝 Problem: {contentNames.problems[selection.problemId] || selection.problemId}</div>}
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={onLink} disabled={!selectedLearningPathId || !selection.moduleId}>
                        <Link className="h-4 w-4 mr-2" />
                        Link Session
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
