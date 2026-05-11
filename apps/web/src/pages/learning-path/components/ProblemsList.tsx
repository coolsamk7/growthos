import { useState, useEffect } from 'react';
import { Code, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { getUserProblems, UserProblem, ProblemStatus, ProblemDifficulty, ProblemSource, createUserProblem, updateUserProblem, deleteUserProblem } from '@/services/user-problem.service';
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
import { Textarea } from '@/components/ui/textarea';
import { ProblemCard } from './ProblemCard';

interface ProblemsListProps {
    topicId: string;
}

export function ProblemsList( { topicId }: ProblemsListProps ) {
    const [ problems, setProblems ] = useState<UserProblem[]>( [] );
    const [ loading, setLoading ] = useState( true );
    const [ dialogOpen, setDialogOpen ] = useState( false );
    const [ editingProblem, setEditingProblem ] = useState<UserProblem | null>( null );
    const [ expandedProblems, setExpandedProblems ] = useState<Set<string>>( new Set() );
    const [ page, setPage ] = useState( 1 );
    const [ totalProblems, setTotalProblems ] = useState( 0 );
    const [ hasMore, setHasMore ] = useState( false );
    const [ formData, setFormData ] = useState( {
        title: '',
        externalUrl: '',
        difficulty: 'MEDIUM' as ProblemDifficulty,
        source: 'LEETCODE' as ProblemSource,
        approachNotes: '',
    } );
    const { toast } = useToast();
    
    const ITEMS_PER_PAGE = 10;

    useEffect( () => {
        setPage( 1 );
        setProblems( [] );
        fetchProblems( 1 );
    }, [ topicId ] );

    const fetchProblems = async ( pageNum: number = page ) => {
        try {
            setLoading( true );
            console.log( 'Fetching problems for topic:', topicId, 'page:', pageNum );
            const result = await getUserProblems( topicId, pageNum, ITEMS_PER_PAGE );
            console.log( 'Problems result:', result );
            // Filter out any invalid/undefined entries
            const validProblems = ( result.data || [] ).filter( p => p && typeof p === 'object' && p.id );
            
            if ( pageNum === 1 ) {
                setProblems( validProblems );
            } else {
                setProblems( ( prev ) => [ ...prev, ...validProblems ] );
            }
            
            setTotalProblems( result.total );
            setHasMore( pageNum < result.totalPages );
            setPage( pageNum );
        } catch ( error: any ) {
            toast( {
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to load problems',
            } );
            setProblems( [] );
        } finally {
            setLoading( false );
        }
    };

    const handleOpenDialog = ( problem?: UserProblem ) => {
        if ( problem ) {
            setEditingProblem( problem );
            setFormData( {
                title: problem.title,
                externalUrl: problem.externalUrl || '',
                difficulty: problem.difficulty,
                source: problem.source,
                approachNotes: problem.approachNotes || '',
            } );
        } else {
            setEditingProblem( null );
            setFormData( {
                title: '',
                externalUrl: '',
                difficulty: 'MEDIUM',
                source: 'LEETCODE',
                approachNotes: '',
            } );
        }
        setDialogOpen( true );
    };

    const handleSubmit = async ( e: React.FormEvent ) => {
        e.preventDefault();

        if ( !formData.title.trim() ) {
            toast( {
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Problem title is required',
            } );
            return;
        }

        try {
            if ( editingProblem ) {
                const updated = await updateUserProblem( editingProblem.id, formData );
                setProblems( ( prev ) => prev.map( ( p ) => ( p.id === editingProblem.id ? updated : p ) ) );
                toast( { title: 'Success', description: 'Problem updated successfully' } );
            } else {
                const newProblem = await createUserProblem( { userTopicId: topicId, ...formData } );
                setProblems( ( prev ) => [ newProblem, ...prev ] );
                setTotalProblems( ( prev ) => prev + 1 );
                toast( { title: 'Success', description: 'Problem created successfully' } );
            }
            setDialogOpen( false );
        } catch ( error: any ) {
            toast( {
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to save problem',
            } );
        }
    };

    const loadMore = () => {
        if ( !loading && hasMore ) {
            fetchProblems( page + 1 );
        }
    };

    const handleStatusChange = async ( problemId: string, newStatus: ProblemStatus ) => {
        try {
            const updated = await updateUserProblem( problemId, { status: newStatus } );
            setProblems( ( prev ) => prev.map( ( p ) => ( p.id === problemId ? updated : p ) ) );
        } catch ( error: any ) {
            toast( {
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to update problem',
            } );
        }
    };

    const handleToggleStar = async ( problem: UserProblem ) => {
        try {
            const updated = await updateUserProblem( problem.id, { isStarred: !problem.isStarred } );
            setProblems( ( prev ) => prev.map( ( p ) => ( p.id === problem.id ? updated : p ) ) );
        } catch ( error: any ) {
            toast( {
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to update problem',
            } );
        }
    };

    const handleDelete = async ( problemId: string ) => {
        if ( !confirm( 'Are you sure you want to delete this problem?' ) ) return;

        try {
            await deleteUserProblem( problemId );
            setProblems( ( prev ) => prev.filter( ( p ) => p.id !== problemId ) );
            toast( { title: 'Success', description: 'Problem deleted successfully' } );
        } catch ( error: any ) {
            toast( {
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to delete problem',
            } );
        }
    };

    const toggleProblem = ( problemId: string ) => {
        setExpandedProblems( ( prev ) => {
            const next = new Set( prev );
            if ( next.has( problemId ) ) {
                next.delete( problemId );
            } else {
                next.add( problemId );
            }
            return next;
        } );
    };

    if ( loading && problems.length === 0 ) {
        return <div className="text-xs text-muted-foreground">Loading problems...</div>;
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <h5 className="text-xs font-semibold flex items-center gap-2">
                    <Code className="size-3" />
                    Problems ({totalProblems})
                </h5>
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => handleOpenDialog()}>
                    <Plus className="mr-1 size-3" />
                    Add Problem
                </Button>
            </div>

            {problems.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No problems yet</p>
            ) : (
                <div className="space-y-2">
                    {problems
                        .filter( ( p ) => p && p.id )
                        .map( ( problem ) => (
                            <ProblemCard
                                key={problem.id}
                                problem={problem}
                                topicId={topicId}
                                isExpanded={expandedProblems.has( problem.id )}
                                onToggle={() => toggleProblem( problem.id )}
                                onStatusChange={( newStatus ) =>
                                    handleStatusChange( problem.id, newStatus )
                                }
                                onToggleStar={() => handleToggleStar( problem )}
                                onEdit={() => handleOpenDialog( problem )}
                                onDelete={() => handleDelete( problem.id )}
                            />
                        ) )}
                </div>
            )}
            
            {hasMore && (
                <div className="text-center pt-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={loadMore}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Load More Problems'}
                    </Button>
                </div>
            )}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>{editingProblem ? 'Edit Problem' : 'Add Problem'}</DialogTitle>
                            <DialogDescription>
                                {editingProblem ? 'Update problem details' : 'Add a new problem to track'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="problem-title">Title *</Label>
                                <Input
                                    id="problem-title"
                                    placeholder="e.g., Two Sum"
                                    value={formData.title}
                                    onChange={( e ) => setFormData( ( prev ) => ( { ...prev, title: e.target.value } ) )}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="problem-url">URL</Label>
                                <Input
                                    id="problem-url"
                                    type="url"
                                    placeholder="https://leetcode.com/problems/..."
                                    value={formData.externalUrl}
                                    onChange={( e ) => setFormData( ( prev ) => ( { ...prev, externalUrl: e.target.value } ) )}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="problem-difficulty">Difficulty</Label>
                                    <Select
                                        value={formData.difficulty}
                                        onValueChange={( value: ProblemDifficulty ) =>
                                            setFormData( ( prev ) => ( { ...prev, difficulty: value } ) )
                                        }
                                    >
                                        <SelectTrigger id="problem-difficulty">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="EASY">Easy</SelectItem>
                                            <SelectItem value="MEDIUM">Medium</SelectItem>
                                            <SelectItem value="HARD">Hard</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="problem-source">Source</Label>
                                    <Select
                                        value={formData.source}
                                        onValueChange={( value: ProblemSource ) =>
                                            setFormData( ( prev ) => ( { ...prev, source: value } ) )
                                        }
                                    >
                                        <SelectTrigger id="problem-source">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="LEETCODE">LeetCode</SelectItem>
                                            <SelectItem value="HACKERRANK">HackerRank</SelectItem>
                                            <SelectItem value="CODEFORCES">Codeforces</SelectItem>
                                            <SelectItem value="CUSTOM">Custom</SelectItem>
                                            <SelectItem value="OTHER">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="problem-notes">Approach Notes</Label>
                                <Textarea
                                    id="problem-notes"
                                    rows={4}
                                    placeholder="Key insights, patterns, and approach..."
                                    value={formData.approachNotes}
                                    onChange={( e ) => setFormData( ( prev ) => ( { ...prev, approachNotes: e.target.value } ) )}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setDialogOpen( false )}>
                                Cancel
                            </Button>
                            <Button type="submit">{editingProblem ? 'Update' : 'Create'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
