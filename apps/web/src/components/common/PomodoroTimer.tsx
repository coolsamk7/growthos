import { useEffect, useState } from 'react';
import { Play, Pause, Square, Clock, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { startStudySession, stopStudySession, getActiveSession, type StudySession } from '@/services/study-session.service';
import { toast } from 'sonner';

const POMODORO_DURATION = 25 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;

interface PomodoroTimerProps {
    userLearningPathId?: string;
    userModuleId?: string;
    userTopicId?: string;
    userProblemId?: string;
    onSessionComplete?: ( session: StudySession ) => void;
}

export function PomodoroTimer( {
    userLearningPathId,
    userModuleId,
    userTopicId,
    userProblemId,
    onSessionComplete
}: PomodoroTimerProps ) {
    const [ mode, setMode ] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>( 'pomodoro' );
    const [ seconds, setSeconds ] = useState( POMODORO_DURATION );
    const [ isRunning, setIsRunning ] = useState( false );
    const [ activeSession, setActiveSession ] = useState<StudySession | null>( null );
    const [ pomodoroCount, setPomodoroCount ] = useState( 0 );

    useEffect( () => {
        const loadActiveSession = async () => {
            try {
                const session = await getActiveSession();
                if ( session ) {
                    setActiveSession( session );
                    setIsRunning( true );
                    
                    if ( session.startTime ) {
                        const elapsed = Math.floor( ( Date.now() - new Date( session.startTime ).getTime() ) / 1000 );
                        const remaining = POMODORO_DURATION - elapsed;
                        setSeconds( remaining > 0 ? remaining : 0 );
                    }
                }
            } catch ( error ) {
                console.error( 'Failed to load active session:', error );
            }
        };
        
        loadActiveSession();
    }, [] );

    useEffect( () => {
        let interval: NodeJS.Timeout;

        if ( isRunning && seconds > 0 ) {
            interval = setInterval( () => {
                setSeconds( prev => prev - 1 );
            }, 1000 );
        } else if ( seconds === 0 && isRunning ) {
            // Handle timer completion
            const completeTimer = async () => {
                setIsRunning( false );
                
                if ( mode === 'pomodoro' && activeSession ) {
                    try {
                        const completedSession = await stopStudySession( activeSession.id );
                        toast.success( 'Pomodoro completed! Great work!' );
                        
                        const newCount = pomodoroCount + 1;
                        setPomodoroCount( newCount );
                        setActiveSession( null );
                        
                        if ( onSessionComplete ) {
                            onSessionComplete( completedSession );
                        }

                        if ( newCount % 4 === 0 ) {
                            setMode( 'longBreak' );
                            setSeconds( LONG_BREAK );
                        } else {
                            setMode( 'shortBreak' );
                            setSeconds( SHORT_BREAK );
                        }
                    } catch ( error ) {
                        console.error( 'Failed to stop session:', error );
                        toast.error( 'Failed to save session' );
                    }
                } else {
                    toast.success( 'Break complete! Ready for another session?' );
                    setMode( 'pomodoro' );
                    setSeconds( POMODORO_DURATION );
                }
            };
            
            completeTimer();
        }

        return () => clearInterval( interval );
    }, [ isRunning, seconds, mode, activeSession, pomodoroCount, onSessionComplete ] );

    const handleStart = async () => {
        console.log( '[PomodoroTimer] Starting timer...', { mode, activeSession, userLearningPathId, userModuleId, userTopicId, userProblemId } );
        
        if ( mode === 'pomodoro' && !activeSession ) {
            try {
                console.log( '[PomodoroTimer] Calling API to start session...' );
                const session = await startStudySession( {
                    userLearningPathId,
                    userModuleId,
                    userTopicId,
                    userProblemId,
                } );
                console.log( '[PomodoroTimer] Session started:', session );
                setActiveSession( session );
                setIsRunning( true );
                toast.success( 'Study session started!' );
            } catch ( error: any ) {
                console.error( '[PomodoroTimer] Failed to start session:', error );
                console.error( '[PomodoroTimer] Error details:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                } );
                toast.error( error.response?.data?.message || 'Failed to start session' );
            }
        } else {
            console.log( '[PomodoroTimer] Starting timer without API call (break mode or existing session)' );
            setIsRunning( true );
        }
    };

    const handlePause = () => {
        setIsRunning( false );
    };

    const handleStop = async () => {
        if ( activeSession ) {
            try {
                await stopStudySession( activeSession.id );
                toast.success( 'Session stopped and saved' );
                setActiveSession( null );
            } catch ( error ) {
                console.error( 'Failed to stop session:', error );
                toast.error( 'Failed to stop session' );
            }
        }
        
        setIsRunning( false );
        setSeconds( getModeSeconds( mode ) );
    };

    const handleModeChange = ( newMode: 'pomodoro' | 'shortBreak' | 'longBreak' ) => {
        if ( isRunning || activeSession ) {
            toast.error( 'Stop the current timer first' );
            return;
        }
        
        setMode( newMode );
        setSeconds( getModeSeconds( newMode ) );
    };

    const getModeSeconds = ( m: typeof mode ) => {
        switch ( m ) {
            case 'pomodoro':
                return POMODORO_DURATION;
            case 'shortBreak':
                return SHORT_BREAK;
            case 'longBreak':
                return LONG_BREAK;
        }
    };

    const formatTime = ( secs: number ) => {
        const mins = Math.floor( secs / 60 );
        const remainingSecs = secs % 60;
        return `${mins.toString().padStart( 2, '0' )}:${remainingSecs.toString().padStart( 2, '0' )}`;
    };

    const getProgress = () => {
        const total = getModeSeconds( mode );
        return ( ( total - seconds ) / total ) * 100;
    };

    const getModeLabel = () => {
        switch ( mode ) {
            case 'pomodoro':
                return 'Focus Time';
            case 'shortBreak':
                return 'Short Break';
            case 'longBreak':
                return 'Long Break';
        }
    };

    const getModeIcon = () => {
        return mode === 'pomodoro' ? <Clock className="h-4 w-4" /> : <Coffee className="h-4 w-4" />;
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        {getModeIcon()}
                        Pomodoro Timer
                    </CardTitle>
                    <Badge variant={mode === 'pomodoro' ? 'default' : 'secondary'}>
                        {getModeLabel()}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-center space-y-4">
                    <div className="text-6xl font-bold tabular-nums">
                        {formatTime( seconds )}
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${getProgress()}%` }}
                        />
                    </div>

                    <div className="flex gap-2 justify-center">
                        {!isRunning ? (
                            <Button onClick={handleStart} size="lg">
                                <Play className="h-4 w-4 mr-2" />
                                Start
                            </Button>
                        ) : (
                            <Button onClick={handlePause} size="lg" variant="secondary">
                                <Pause className="h-4 w-4 mr-2" />
                                Pause
                            </Button>
                        )}
                        
                        <Button 
                            onClick={handleStop} 
                            size="lg" 
                            variant="destructive"
                            disabled={!isRunning && !activeSession}
                        >
                            <Square className="h-4 w-4 mr-2" />
                            Stop
                        </Button>
                    </div>

                    <div className="flex gap-2 justify-center">
                        <Button
                            onClick={() => handleModeChange( 'pomodoro' )}
                            variant={mode === 'pomodoro' ? 'default' : 'outline'}
                            size="sm"
                            disabled={isRunning || !!activeSession}
                        >
                            Pomodoro
                        </Button>
                        <Button
                            onClick={() => handleModeChange( 'shortBreak' )}
                            variant={mode === 'shortBreak' ? 'default' : 'outline'}
                            size="sm"
                            disabled={isRunning || !!activeSession}
                        >
                            Short Break
                        </Button>
                        <Button
                            onClick={() => handleModeChange( 'longBreak' )}
                            variant={mode === 'longBreak' ? 'default' : 'outline'}
                            size="sm"
                            disabled={isRunning || !!activeSession}
                        >
                            Long Break
                        </Button>
                    </div>

                    {pomodoroCount > 0 && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Completed Pomodoros Today: <span className="font-semibold">{pomodoroCount}</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
