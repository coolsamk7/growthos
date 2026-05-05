import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

interface ContentTreePickerProps {
    learningPathId: string;
    onSelect: ( selection: ContentSelection ) => void;
    selectedIds?: ContentSelection;
    onNamesLoaded?: ( names: { modules: Record<string, string>; topics: Record<string, string>; problems: Record<string, string> } ) => void;
}

export interface ContentSelection {
    learningPathId?: string;
    moduleId?: string;
    topicId?: string;
    problemId?: string;
}

interface TreeModule {
    id: string;
    name: string;
    topics?: TreeTopic[];
}

interface TreeTopic {
    id: string;
    name: string;
    problems?: TreeProblem[];
}

interface TreeProblem {
    id: string;
    title: string;
}

export function ContentTreePicker( { learningPathId, onSelect, selectedIds, onNamesLoaded }: ContentTreePickerProps ) {
    const [ modules, setModules ] = useState<TreeModule[]>( [] );
    const [ expandedModules, setExpandedModules ] = useState<Set<string>>( new Set() );
    const [ expandedTopics, setExpandedTopics ] = useState<Set<string>>( new Set() );
    const [ loading, setLoading ] = useState( true );
    const [ moduleNames, setModuleNames ] = useState<Record<string, string>>( {} );
    const [ topicNames, setTopicNames ] = useState<Record<string, string>>( {} );
    const [ problemNames, setProblemNames ] = useState<Record<string, string>>( {} );

    useEffect( () => {
        loadModules();
    }, [ learningPathId ] );

    const loadModules = async () => {
        try {
            setLoading( true );
            const response = await apiClient.get( `/v1/user-learning-paths/${learningPathId}/tree` );
            const treeData = response.data?.data || [];
            setModules( treeData );
            
            // Build name lookup maps
            const modNames: Record<string, string> = {};
            const topNames: Record<string, string> = {};
            const probNames: Record<string, string> = {};
            
            treeData.forEach( ( module: TreeModule ) => {
                modNames[module.id] = module.name;
                module.topics?.forEach( ( topic: TreeTopic ) => {
                    topNames[topic.id] = topic.name;
                    topic.problems?.forEach( ( problem: TreeProblem ) => {
                        probNames[problem.id] = problem.title;
                    } );
                } );
            } );
            
            setModuleNames( modNames );
            setTopicNames( topNames );
            setProblemNames( probNames );
            
            // Notify parent of loaded names
            if ( onNamesLoaded ) {
                onNamesLoaded( {
                    modules: modNames,
                    topics: topNames,
                    problems: probNames
                } );
            }
        } catch ( error ) {
            console.error( 'Failed to load modules:', error );
            toast.error( 'Failed to load learning path content' );
        } finally {
            setLoading( false );
        }
    };

    const toggleModule = ( moduleId: string ) => {
        const newExpanded = new Set( expandedModules );
        if ( newExpanded.has( moduleId ) ) {
            newExpanded.delete( moduleId );
        } else {
            newExpanded.add( moduleId );
        }
        setExpandedModules( newExpanded );
    };

    const toggleTopic = ( topicId: string ) => {
        const newExpanded = new Set( expandedTopics );
        if ( newExpanded.has( topicId ) ) {
            newExpanded.delete( topicId );
        } else {
            newExpanded.add( topicId );
        }
        setExpandedTopics( newExpanded );
    };

    const handleSelectModule = ( module: TreeModule ) => {
        onSelect( {
            learningPathId,
            moduleId: module.id
        } );
    };

    const handleSelectTopic = ( module: TreeModule, topic: TreeTopic ) => {
        onSelect( {
            learningPathId,
            moduleId: module.id,
            topicId: topic.id
        } );
    };

    const handleSelectProblem = ( module: TreeModule, topic: TreeTopic, problem: TreeProblem ) => {
        onSelect( {
            learningPathId,
            moduleId: module.id,
            topicId: topic.id,
            problemId: problem.id
        } );
    };

    if ( loading ) {
        return (
            <div className="py-8 text-center text-gray-500">
                Loading content tree...
            </div>
        );
    }

    return (
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            <div className="space-y-1">
                {modules.map( ( module ) => {
                    const isModuleExpanded = expandedModules.has( module.id );
                    const isModuleSelected = selectedIds?.moduleId === module.id && !selectedIds?.topicId;

                    return (
                        <div key={module.id} className="space-y-1">
                            {/* Module */}
                            <div
                                className={cn(
                                    'flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer',
                                    isModuleSelected && 'bg-blue-100 dark:bg-blue-900'
                                )}
                            >
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 w-5 p-0"
                                    onClick={() => toggleModule( module.id )}
                                >
                                    {isModuleExpanded ? (
                                        <ChevronDown className="h-4 w-4" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4" />
                                    )}
                                </Button>
                                <div
                                    className="flex-1 flex items-center gap-2"
                                    onClick={() => handleSelectModule( module )}
                                >
                                    <span className="text-lg">📦</span>
                                    <span className="font-medium">{module.name}</span>
                                    {isModuleSelected && <Check className="h-4 w-4 text-blue-600 ml-auto" />}
                                </div>
                            </div>

                            {/* Topics */}
                            {isModuleExpanded && module.topics?.map( ( topic ) => {
                                const isTopicExpanded = expandedTopics.has( topic.id );
                                const isTopicSelected = selectedIds?.topicId === topic.id && !selectedIds?.problemId;

                                return (
                                    <div key={topic.id} className="ml-6 space-y-1">
                                        <div
                                            className={cn(
                                                'flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer',
                                                isTopicSelected && 'bg-blue-100 dark:bg-blue-900'
                                            )}
                                        >
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-5 w-5 p-0"
                                                onClick={() => toggleTopic( topic.id )}
                                            >
                                                {isTopicExpanded ? (
                                                    <ChevronDown className="h-4 w-4" />
                                                ) : (
                                                    <ChevronRight className="h-4 w-4" />
                                                )}
                                            </Button>
                                            <div
                                                className="flex-1 flex items-center gap-2"
                                                onClick={() => handleSelectTopic( module, topic )}
                                            >
                                                <span className="text-lg">🎯</span>
                                                <span>{topic.name}</span>
                                                {isTopicSelected && <Check className="h-4 w-4 text-blue-600 ml-auto" />}
                                            </div>
                                        </div>

                                        {/* Problems */}
                                        {isTopicExpanded && topic.problems?.map( ( problem ) => {
                                            const isProblemSelected = selectedIds?.problemId === problem.id;

                                            return (
                                                <div
                                                    key={problem.id}
                                                    className={cn(
                                                        'ml-6 flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer',
                                                        isProblemSelected && 'bg-blue-100 dark:bg-blue-900'
                                                    )}
                                                    onClick={() => handleSelectProblem( module, topic, problem )}
                                                >
                                                    <span className="text-lg ml-7">📝</span>
                                                    <span className="text-sm">{problem.title}</span>
                                                    {isProblemSelected && <Check className="h-4 w-4 text-blue-600 ml-auto" />}
                                                </div>
                                            );
                                        } )}
                                    </div>
                                );
                            } )}
                        </div>
                    );
                } )}
            </div>
        </ScrollArea>
    );
}
