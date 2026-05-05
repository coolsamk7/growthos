import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Link } from 'lucide-react';
import { format } from 'date-fns';
import { ContentTreePicker, type ContentSelection } from '@/components/common/ContentTreePicker';
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
    onNamesLoaded,
    onClose,
    onLink
}: LinkSessionDialogProps ) {
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
                        <p className="text-sm font-medium mb-3">Select Content:</p>
                        {session?.userLearningPathId ? (
                            <ContentTreePicker
                                learningPathId={session.userLearningPathId}
                                onSelect={onSelectionChange}
                                selectedIds={selection}
                                onNamesLoaded={onNamesLoaded}
                            />
                        ) : (
                            <Alert>
                                <AlertDescription>
                                    This session is not associated with any learning path. 
                                    Please delete it and create a new session from your learning path.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

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
                    <Button onClick={onLink} disabled={!selection.moduleId}>
                        <Link className="h-4 w-4 mr-2" />
                        Link Session
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
