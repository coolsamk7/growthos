import { useState, useEffect } from 'react';
import { StickyNote, Plus, Trash2, Edit2, Pin, PinOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getNotes, Note, createNote, updateNote, deleteNote } from '@/services/note.service';
import { useToast } from '@/hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface NotesListProps {
    topicId: string;
}

export function NotesList( { topicId }: NotesListProps ) {
    const [ notes, setNotes ] = useState<Note[]>( [] );
    const [ loading, setLoading ] = useState( true );
    const [ dialogOpen, setDialogOpen ] = useState( false );
    const [ editingNote, setEditingNote ] = useState<Note | null>( null );
    const [ formData, setFormData ] = useState( { title: '', content: '' } );
    const { toast } = useToast();

    useEffect( () => {
        fetchNotes();
    }, [ topicId ] );

    const fetchNotes = async () => {
        try {
            setLoading( true );
            const data = await getNotes( topicId );
            // Filter out any invalid/undefined entries
            const validNotes = ( data || [] ).filter( n => n && typeof n === 'object' && n.id );
            setNotes( validNotes );
        } catch ( error: any ) {
            toast( {
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to load notes',
            } );
            setNotes( [] );
        } finally {
            setLoading( false );
        }
    };

    const handleOpenDialog = ( note?: Note ) => {
        if ( note ) {
            setEditingNote( note );
            setFormData( { title: note.title, content: note.content } );
        } else {
            setEditingNote( null );
            setFormData( { title: '', content: '' } );
        }
        setDialogOpen( true );
    };

    const handleSubmit = async ( e: React.FormEvent ) => {
        e.preventDefault();

        if ( !formData.title.trim() ) {
            toast( {
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Title is required',
            } );
            return;
        }

        try {
            if ( editingNote ) {
                const updated = await updateNote( editingNote.id, formData );
                setNotes( ( prev ) => prev.map( ( n ) => ( n.id === editingNote.id ? updated : n ) ) );
                toast( { title: 'Success', description: 'Note updated successfully' } );
            } else {
                const newNote = await createNote( { userTopicId: topicId, ...formData } );
                setNotes( ( prev ) => [ ...prev, newNote ] );
                toast( { title: 'Success', description: 'Note created successfully' } );
            }
            setDialogOpen( false );
        } catch ( error: any ) {
            toast( {
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to save note',
            } );
        }
    };

    const handleTogglePin = async ( note: Note ) => {
        try {
            const updated = await updateNote( note.id, { isPinned: !note.isPinned } );
            setNotes( ( prev ) => prev.map( ( n ) => ( n.id === note.id ? updated : n ) ) );
        } catch ( error: any ) {
            toast( {
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to update note',
            } );
        }
    };

    const handleDelete = async ( noteId: string ) => {
        if ( !confirm( 'Are you sure you want to delete this note?' ) ) return;

        try {
            await deleteNote( noteId );
            setNotes( ( prev ) => prev.filter( ( n ) => n.id !== noteId ) );
            toast( { title: 'Success', description: 'Note deleted successfully' } );
        } catch ( error: any ) {
            toast( {
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to delete note',
            } );
        }
    };

    if ( loading ) {
        return <div className="text-xs text-muted-foreground">Loading notes...</div>;
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <h5 className="text-xs font-semibold flex items-center gap-2">
                    <StickyNote className="size-3" />
                    Notes ({notes.length})
                </h5>
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => handleOpenDialog()}>
                    <Plus className="mr-1 size-3" />
                    Add Note
                </Button>
            </div>

            {notes.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No notes yet</p>
            ) : (
                <div className="space-y-2">
                    {notes
                        .filter( ( n ) => n && n.id )
                        .map( ( note ) => (
                        <div key={note.id} className="rounded border p-2 bg-background">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium flex items-center gap-1">
                                        {note.isPinned && <Pin className="size-3 text-amber-500" />}
                                        {note.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                        {note.content}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="size-6"
                                        onClick={() => handleTogglePin( note )}
                                    >
                                        {note.isPinned ? (
                                            <PinOff className="size-3" />
                                        ) : (
                                            <Pin className="size-3" />
                                        )}
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="size-6"
                                        onClick={() => handleOpenDialog( note )}
                                    >
                                        <Edit2 className="size-3" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="size-6"
                                        onClick={() => handleDelete( note.id )}
                                    >
                                        <Trash2 className="size-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) )}
                </div>
            )}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>{editingNote ? 'Edit Note' : 'Add Note'}</DialogTitle>
                            <DialogDescription>
                                {editingNote ? 'Update your note' : 'Create a new note for this topic'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="note-title">Title *</Label>
                                <Input
                                    id="note-title"
                                    value={formData.title}
                                    onChange={( e ) => setFormData( ( prev ) => ( { ...prev, title: e.target.value } ) )}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="note-content">Content</Label>
                                <Textarea
                                    id="note-content"
                                    rows={6}
                                    value={formData.content}
                                    onChange={( e ) => setFormData( ( prev ) => ( { ...prev, content: e.target.value } ) )}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setDialogOpen( false )}>
                                Cancel
                            </Button>
                            <Button type="submit">{editingNote ? 'Update' : 'Create'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
