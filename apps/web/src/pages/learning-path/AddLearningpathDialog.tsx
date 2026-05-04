// components/learning-path/AddLearningPathDialog.tsx

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LearningPath } from "./LearningPathPage";
import { addNewLearningPath } from "@/services/learning-path.service";

type Props = {
  onCreate: ( path: LearningPath ) => void;
};

export default function AddLearningPathDialog( { onCreate }: Props ) {
  const [ open, setOpen ] = useState( false );

  const [ title, setTitle ] = useState( "" );
  const [ description, setDescription ] = useState( "" );
  const [ targetDate, setTargetDate ] = useState( "" );
  const [ masterLearningPathId, setMasterLearningPathId ] = useState( "" );
  const [ loading, setLoading ] = useState( false );

  const handleCreate = async () => {
    if ( !title.trim() ) return;

    try {
      setLoading( true );
      const response = await addNewLearningPath( {
        title,
        description,
        targetDate,
        masterLearningPathId,
      } );

    
      // reset
      setTitle( "" );
      setDescription( "" );
      setTargetDate( "" );
      setMasterLearningPathId( "" );
      setOpen( false );
    } catch ( error ) {
      console.error( "Failed to create learning path:", error );
    } finally {
      setLoading( false );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" />
          New Path
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Learning Path</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={( e ) => setTitle( e.target.value )}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={( e ) => setDescription( e.target.value )}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Target Date"
            value={targetDate}
            onChange={( e ) => setTargetDate( e.target.value )}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Master Learning Path ID"
            value={masterLearningPathId}
            onChange={( e ) => setMasterLearningPathId( e.target.value )}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={loading}>Cancel</Button>
          </DialogClose>

          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
