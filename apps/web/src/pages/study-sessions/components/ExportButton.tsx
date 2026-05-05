import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { exportSessionsToCSV, type StudySession } from '@/services/study-session.service';
import { toast } from 'sonner';

interface ExportButtonProps {
    sessions: StudySession[];
    disabled?: boolean;
}

export function ExportButton( { sessions, disabled = false }: ExportButtonProps ) {
    const [ isExporting, setIsExporting ] = useState( false );

    const handleExportCSV = async () => {
        try {
            setIsExporting( true );
            
            if ( sessions.length === 0 ) {
                toast.error( 'No sessions to export' );
                return;
            }
            
            exportSessionsToCSV( sessions );
            toast.success( `Exported ${sessions.length} sessions to CSV` );
        } catch ( error ) {
            console.error( 'Export failed:', error );
            toast.error( 'Failed to export sessions' );
        } finally {
            setIsExporting( false );
        }
    };

    const handleExportFiltered = () => {
        handleExportCSV();
    };

    const handleExportAll = () => {
        // For now, just export current sessions
        // In future, could fetch all sessions from API
        handleExportCSV();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled || isExporting}
                >
                    <Download className="h-4 w-4 mr-2" />
                    {isExporting ? 'Exporting...' : 'Export'}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportFiltered}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Current View ({sessions.length} sessions)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportAll}>
                    <Download className="h-4 w-4 mr-2" />
                    Export All Sessions
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
