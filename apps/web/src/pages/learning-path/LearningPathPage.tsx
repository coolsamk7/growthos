import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";



export function LearningPathPage() {

    const [ learningPaths, setLearningPaths ] = useState<{}>()

    return ( 
        <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Learning Paths</h1>
                    <p className="mt-1 text-muted-foreground">Manage your structured learning journeys.</p>
                </div>
                <Button 
                    className="gap-2"
                    onClick={handleAddlearningPathModal}
                >
                    <Plus className="size-4" />
                    New Path
                </Button>
            </div>

            <div className="flex flex-col gap-8">
                {
                    learningPaths && learningPaths.map( ( path ) => (
                        <div key={ path.id } className="flex flex-col gap-4">
                            <Card className="bg-muted/30" >
                                <CardHeader className="">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-xl">
                                                {path.title}
                                            </CardTitle>
                                            <p className="mt-2 text-sm text-muted-forbgeground justify-between">{path.description}</p>
                                        </div>
                                        <Link to={`/app/learning-paths/${path.id}`}>
                                            <Button variant="outline" size="sm">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-6">
                                        <div className="mb-2 flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Overall Progress</span>
                                            <span className="font-medium text-foreground">{path.progress}%</span>
                                        </div>
                                        <Progress value={path.progress} className="h-2"></Progress>
                                    </div>
                                     <div className="flex gap-6 text-sm">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-foreground">{path.completedItems}</p>
                                            <p className="text-muted-foreground">Completed</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-foreground">
                                                {path.totalItems - path.completedItems}
                                            </p>
                                            <p className="text-muted-foreground">Remaining</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) )
                } 
            </div>
        </div> 
    )
}
