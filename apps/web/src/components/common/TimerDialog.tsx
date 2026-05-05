import { useState } from 'react';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { PomodoroTimer } from './PomodoroTimer';
import { StudySession } from '@/services/study-session.service';

interface TimerDialogProps {
    title: string;
    userLearningPathId?: string;
    userModuleId?: string;
    userTopicId?: string;
    userProblemId?: string;
    onSessionComplete?: ( session: StudySession ) => void;
}

export function TimerDialog( {
    title,
    userLearningPathId,
    userModuleId,
    userTopicId,
    userProblemId,
    onSessionComplete
}: TimerDialogProps ) {
    const [ open, setOpen ] = useState( false );

    const handleSessionComplete = ( session: StudySession ) => {
        if ( onSessionComplete ) {
            onSessionComplete( session );
        }
    };

    return (
        <>
            <Button
                size="icon"
                variant="ghost"
                className="size-6"
                onClick={() => setOpen( true )}
                title="Start timer for this item"
            >
                <Clock className="size-3" />
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-lg">
                            Study Timer: {title}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <PomodoroTimer
                            userLearningPathId={userLearningPathId}
                            userModuleId={userModuleId}
                            userTopicId={userTopicId}
                            userProblemId={userProblemId}
                            onSessionComplete={handleSessionComplete}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
