import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { getLearingPaths } from "@/services/learning-path.service";

import AddLearningPathDialog from "./AddLearningpathDialog";

// ✅ Type
export type LearningPath = {
  id: string;
  title: string;
  description: string;
  progress: number;
  completedItems: number;
  totalItems: number;
};

export function LearningPathPage() {
  const [ learningPaths, setLearningPaths ] = useState<LearningPath[]>( [] );
  const [ loading, setLoading ] = useState( true );

  useEffect( () => {
    fetchLearningPaths();
  }, [] );

  const fetchLearningPaths = async () => {
    try {
      setLoading( true );
      const response = await getLearingPaths();
      setLearningPaths( response || [] );
    } catch ( error ) {
      console.error( "Failed to fetch learning paths:", error );
    } finally {
      setLoading( false );
    }
  };

  const handleCreate = ( newPath: LearningPath ) => {
    setLearningPaths( ( prev ) => [ ...prev, newPath ] );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Learning Paths
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your structured learning journeys.
          </p>
        </div>

        {/* 🔥 Modal */}
       <AddLearningPathDialog onCreate={ handleCreate }/> 
      </div>

      {/* List */}
      <div className="flex flex-col gap-8">
        {loading ? (
          <p className="text-muted-foreground">Loading learning paths...</p>
        ) : learningPaths.length === 0 ? (
          <p className="text-muted-foreground">No learning paths yet. Create your first one!</p>
        ) : learningPaths.map( ( path ) => (
          <div key={path.id} className="flex flex-col gap-4">
            <Card className="bg-muted/30">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      {path.title}
                    </CardTitle>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {path.description}
                    </p>
                  </div>

                  <Link to={`/app/learning-paths/${path.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Overall Progress
                    </span>
                    <span className="font-medium text-foreground">
                      {path.progress}%
                    </span>
                  </div>

                  <Progress value={path.progress} className="h-2" />

                  <div className="flex gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {path.completedItems}
                      </p>
                      <p className="text-muted-foreground">Completed</p>
                    </div>

                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {path.totalItems - path.completedItems}
                      </p>
                      <p className="text-muted-foreground">Remaining</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) ) }
      </div>
    </div>
  );
}
