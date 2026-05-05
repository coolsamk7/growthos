import { useState } from 'react';
import { ChevronDown, ChevronRight, MoreVertical, Pencil, Trash2, PlayCircle, CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { UserModule, ModuleStatus, deleteUserModule } from '@/services/user-module.service';
import { useToast } from '@/hooks/use-toast';
import { EditModuleDialog } from './EditModuleDialog';
import { TopicList } from './TopicList';
import { ResourcesList } from './ResourcesList';
import { TimerDialog } from '@/components/common/TimerDialog';

interface ModuleCardProps {
    module: UserModule;
    isExpanded: boolean;
    onToggle: () => void;
    onUpdate: ( module: UserModule ) => void;
    onDelete: ( moduleId: string ) => void;
}

const statusConfig: Record<ModuleStatus, { icon: any; color: string; label: string }> = {
    NOT_STARTED: {
        icon: Circle,
        color: 'text-muted-foreground',
        label: 'Not Started',
    },
    IN_PROGRESS: {
        icon: PlayCircle,
        color: 'text-primary',
        label: 'In Progress',
    },
    COMPLETED: {
        icon: CheckCircle2,
        color: 'text-success',
        label: 'Completed',
    },
};

export function ModuleCard( { module, isExpanded, onToggle, onUpdate, onDelete }: ModuleCardProps ) {
    const [ editDialogOpen, setEditDialogOpen ] = useState( false );
    const [ deleting, setDeleting ] = useState( false );
    const { toast } = useToast();

    console.log( 'ModuleCard - module.id:', module?.id, 'module:', module );

    const statusInfo = statusConfig[module.status];
    const StatusIcon = statusInfo.icon;

    const handleDelete = async () => {
        if ( !confirm( 'Are you sure you want to delete this module? This action cannot be undone.' ) ) {
            return;
        }

        try {
            setDeleting( true );
            await deleteUserModule( module.id );
            toast( {
                title: 'Success',
                description: 'Module deleted successfully',
            } );
            onDelete( module.id );
        } catch ( error: any ) {
            toast( {
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to delete module',
            } );
        } finally {
            setDeleting( false );
        }
    };

    return (
        <>
            <Card className="overflow-hidden">
                <button
                    onClick={onToggle}
                    className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-muted/50"
                >
                    <div className="flex items-center gap-4">
                        {isExpanded ? (
                            <ChevronDown className="size-5 text-muted-foreground" />
                        ) : (
                            <ChevronRight className="size-5 text-muted-foreground" />
                        )}
                        <StatusIcon className={cn( 'size-5', statusInfo.color )} />
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-foreground">{module.name}</h3>
                                <Badge variant={
                                    module.status === 'COMPLETED' ? 'success' :
                                    module.status === 'IN_PROGRESS' ? 'default' : 'outline'
                                }>
                                    {statusInfo.label}
                                </Badge>
                            </div>
                            {module.description && (
                                <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                                    {module.description}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-32">
                            <Progress value={module.progress} className="h-2" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">{module.progress}%</span>
                        
                        <TimerDialog
                            title={module.name}
                            userLearningPathId={module.userLearningPathId}
                            userModuleId={module.id}
                            onSessionComplete={() => {
                                toast( { title: 'Session completed!', description: 'Your study session has been saved.' } );
                            }}
                        />
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={( e ) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" disabled={deleting}>
                                    <MoreVertical className="size-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={( e ) => {
                                    e.stopPropagation();
                                    setEditDialogOpen( true );
                                }}>
                                    <Pencil className="mr-2 size-4" />
                                    Edit Module
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={( e ) => {
                                        e.stopPropagation();
                                        handleDelete();
                                    }}
                                    className="text-destructive"
                                    disabled={deleting}
                                >
                                    <Trash2 className="mr-2 size-4" />
                                    Delete Module
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </button>

                {isExpanded && (
                    <CardContent className="border-t pt-4">
                        <div className="flex flex-col gap-2">
                            {module.description && (
                                <div className="rounded-lg bg-muted/50 p-4">
                                    <p className="text-sm text-muted-foreground">{module.description}</p>
                                </div>
                            )}
                            
                            <div className="grid grid-cols-4 gap-4 rounded-lg border p-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    <p className="font-medium">{statusInfo.label}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Progress</p>
                                    <p className="font-medium">{module.progress}%</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Topics</p>
                                    <p className="font-medium">{module.topicCount || 0}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Order</p>
                                    <p className="font-medium">#{module.orderIndex + 1}</p>
                                </div>
                            </div>

                            <ResourcesList
                                entityType="module"
                                entityId={module.id}
                            />

                            <TopicList
                                userLearningPathId={module.userLearningPathId}
                                userModuleId={module.id}
                            />
                        </div>
                    </CardContent>
                )}
            </Card>

            <EditModuleDialog
                module={module}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                onSuccess={onUpdate}
            />
        </>
    );
}
