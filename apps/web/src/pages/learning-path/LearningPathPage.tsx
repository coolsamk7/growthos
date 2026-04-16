import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  PlayCircle,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { learningPaths, type Module, type ModuleItem } from "@/services/mockData";

const statusIcon = {
  completed: CheckCircle2,
  "in-progress": PlayCircle,
  todo: Circle,
};

const statusColor = {
  completed: "text-success",
  "in-progress": "text-primary",
  todo: "text-muted-foreground",
};

const difficultyVariant = {
  Easy: "success",
  Medium: "warning",
  Hard: "destructive",
} as const;

function ModuleCard( {
  module,
  isExpanded,
  onToggle,
}: {
  module: Module;
  isExpanded: boolean;
  onToggle: () => void;
} ) {
  return (
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
          <div>
            <h3 className="font-semibold text-foreground">{module.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {module.items.filter( ( i ) => i.status === "completed" ).length} of{" "}
              {module.items.length} completed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-32">
            <Progress value={module.progress} className="h-2" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {module.progress}%
          </span>
        </div>
      </button>

      {isExpanded && (
        <CardContent className="border-t pt-4">
          <div className="flex flex-col gap-2">
            {module.items.map( ( item ) => (
              <ModuleItemRow key={item.id} item={item} />
            ) )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function ModuleItemRow( { item }: { item: ModuleItem } ) {
  const StatusIcon = statusIcon[item.status];

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl p-4 transition-colors",
        item.status === "completed"
          ? "bg-success/5"
          : item.status === "in-progress"
            ? "bg-primary/5"
            : "bg-muted/50 hover:bg-muted"
      )}
    >
      <div className="flex items-center gap-3">
        <StatusIcon className={cn( "size-5", statusColor[item.status] )} />
        <span
          className={cn(
            "font-medium",
            item.status === "completed"
              ? "text-muted-foreground line-through"
              : "text-foreground"
          )}
        >
          {item.title}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Badge
          variant={difficultyVariant[item.difficulty as keyof typeof difficultyVariant]}
        >
          {item.difficulty}
        </Badge>
        <Badge
          variant={
            item.status === "completed"
              ? "success"
              : item.status === "in-progress"
                ? "default"
                : "outline"
          }
        >
          {item.status === "in-progress" ? "In Progress" : item.status}
        </Badge>
      </div>
    </div>
  );
}

export function LearningPathPage() {
  const [ expandedModules, setExpandedModules ] = useState<Set<string>>(
    new Set( [ "m1" ] )
  );

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

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Learning Paths</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your structured learning journeys.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="size-4" />
          New Path
        </Button>
      </div>

      {/* Learning Paths */}
      <div className="flex flex-col gap-8">
        {learningPaths.map( ( path ) => (
          <div key={path.id} className="flex flex-col gap-4">
            {/* Path Header Card */}
            <Card className="bg-muted/30">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{path.title}</CardTitle>
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
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Overall Progress
                      </span>
                      <span className="font-medium text-foreground">
                        {path.progress}%
                      </span>
                    </div>
                    <Progress value={path.progress} className="h-2" />
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">
                        {path.completedItems}
                      </p>
                      <p className="text-muted-foreground">Completed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">
                        {path.totalItems - path.completedItems}
                      </p>
                      <p className="text-muted-foreground">Remaining</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Modules */}
            <div className="flex flex-col gap-3 pl-4">
              {path.modules.map( ( module ) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  isExpanded={expandedModules.has( module.id )}
                  onToggle={() => toggleModule( module.id )}
                />
              ) )}
            </div>
          </div>
        ) )}
      </div>
    </div>
  );
}
