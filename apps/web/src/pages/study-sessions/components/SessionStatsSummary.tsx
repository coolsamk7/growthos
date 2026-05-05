import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import type { StudySession } from '../../../services/study-session.service';

interface SessionStatsSummaryProps {
    sessions: StudySession[];
    formatTotalTime: ( totalSeconds: number ) => string;
}

export function SessionStatsSummary( { sessions, formatTotalTime }: SessionStatsSummaryProps ) {
    const getTotalStudyTime = () => {
        return ( sessions || [] ).reduce( ( acc, session ) => {
            return acc + ( session.durationSeconds || session.durationMinutes * 60 || 0 );
        }, 0 );
    };

    const getOrphanCount = () => {
        return ( sessions || [] ).filter( session => 
            !session.userModuleId && !session.userTopicId && !session.userProblemId 
        ).length;
    };

    return (
        <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Sessions</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {( sessions || [] ).length}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Study Time</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {formatTotalTime( getTotalStudyTime() )}
                        </p>
                    </div>
                </div>
                {getOrphanCount() > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Orphan Sessions</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Need to be linked</p>
                                </div>
                            </div>
                            <Badge variant="outline" className="text-amber-600 border-amber-400 bg-amber-50 dark:bg-amber-900/30 px-3 py-1">
                                {getOrphanCount()}
                            </Badge>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
