import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getUserModules, UserModule } from '@/services/user-module.service';
import { getLearningPath } from '@/services/learning-path.service';
import { useToast } from '@/hooks/use-toast';
import { AddModuleDialog } from './components/AddModuleDialog';
import { ModuleCard } from './components/ModuleCard';

export function LearningPathDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [ modules, setModules ] = useState<UserModule[]>( [] );
    const [ loading, setLoading ] = useState( true );
    const [ expandedModules, setExpandedModules ] = useState<Set<string>>( new Set() );
    const [ learningPath, setLearningPath ] = useState<any>( null );

    useEffect( () => {
        if ( id ) {
            fetchLearningPath();
            fetchModules();
        }
    }, [ id ] );

    const fetchLearningPath = async () => {
        if ( !id ) return;
        
        try {
            const data = await getLearningPath( id );
            setLearningPath( data );
        } catch ( error: any ) {
            toast( {
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to load learning path',
            } );
        }
    };

    const fetchModules = async () => {
        if ( !id ) return;
        
        try {
            setLoading( true );
            const data = await getUserModules( id );
            // Filter out any invalid/undefined entries
            const validModules = ( data || [] ).filter( m => m && typeof m === 'object' && m.id );
            setModules( validModules );
        } catch ( error: any ) {
            toast( {
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to load modules',
            } );
            setModules( [] );
        } finally {
            setLoading( false );
        }
    };

    const handleModuleCreated = ( newModule: UserModule ) => {
        setModules( ( prev ) => [ ...prev, newModule ] );
    };

    const handleModuleUpdated = ( updatedModule: UserModule ) => {
        setModules( ( prev ) =>
            prev.map( ( m ) => ( m.id === updatedModule.id ? updatedModule : m ) )
        );
    };

    const handleModuleDeleted = ( moduleId: string ) => {
        setModules( ( prev ) => prev.filter( ( m ) => m.id !== moduleId ) );
    };

    const toggleModule = ( moduleId: string ) => {
        setExpandedModules( ( prev ) => {
            const next = new Set( prev );
            if ( next.has( moduleId ) ) {
                next.delete( moduleId );
            } else {
                next.add( moduleId );
            }
            return next;
        } );
    };

    const overallProgress = modules.length > 0
        ? Math.round( modules.reduce( ( sum, m ) => sum + ( m?.progress || 0 ), 0 ) / modules.length )
        : 0;

    const completedModules = modules.filter( ( m ) => m?.status === 'COMPLETED' ).length;
    const inProgressModules = modules.filter( ( m ) => m?.status === 'IN_PROGRESS' ).length;

    return (
        <div className="flex flex-col gap-6">
            {loading || !learningPath ? (
                <p className="text-muted-foreground">Loading...</p>
            ) : (
                <>
                    {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate( '/app/learning-paths' )}
                    >
                        <ArrowLeft className="size-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            {learningPath.name}
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {learningPath.description}
                        </p>
                    </div>
                </div>

                <AddModuleDialog
                    userLearningPathId={id!}
                    onSuccess={handleModuleCreated}
                />
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Overall Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="text-2xl font-bold">{overallProgress}%</div>
                        </div>
                        <Progress value={overallProgress} className="mt-2 h-2" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Modules
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{modules.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {completedModules} completed
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            In Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">
                            {inProgressModules}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Active modules
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Goals
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {learningPath.targetDate ? (
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="size-4 text-muted-foreground" />
                                {new Date( learningPath.targetDate ).toLocaleDateString()}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No target date set</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                            {learningPath.targetProblems > 0 
                                ? `Goal: ${learningPath.targetProblems} problems`
                                : 'No target problems set'
                            }
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Modules List */}
            <div>
                <h2 className="mb-4 text-lg font-semibold">Modules</h2>
                
                {loading ? (
                    <p className="text-muted-foreground">Loading modules...</p>
                ) : modules.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Target className="mb-4 size-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-semibold">No modules yet</h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Get started by creating your first module
                            </p>
                            <AddModuleDialog
                                userLearningPathId={id!}
                                onSuccess={handleModuleCreated}
                            />
                        </CardContent>
                    </Card>
                ) : (
                    <div className="flex flex-col gap-3">
                        {modules
                            .filter( ( m ) => m && m.id )
                            .sort( ( a, b ) => ( a.orderIndex || 0 ) - ( b.orderIndex || 0 ) )
                            .map( ( module ) => (
                                <ModuleCard
                                    key={module.id}
                                    module={module}
                                    isExpanded={expandedModules.has( module.id )}
                                    onToggle={() => toggleModule( module.id )}
                                    onUpdate={handleModuleUpdated}
                                    onDelete={handleModuleDeleted}
                                />
                            ) )}
                    </div>
                )}
            </div>
                </>
            )}
        </div>
    );
}
