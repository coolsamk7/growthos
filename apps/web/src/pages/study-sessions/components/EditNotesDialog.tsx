import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { StudySession } from '../../../services/study-session.service';

interface EditNotesDialogProps {
    session: StudySession | null;
    notes: string;
    onNotesChange: ( notes: string ) => void;
    onClose: () => void;
    onSave: () => void;
}

export function EditNotesDialog( {
    session,
    notes,
    onNotesChange,
    onClose,
    onSave
}: EditNotesDialogProps ) {
    return (
        <Dialog open={!!session} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Session Notes</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Input
                            id="notes"
                            value={notes}
                            onChange={( e ) => onNotesChange( e.target.value )}
                            placeholder="Add notes about this session..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={onSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
