import { 
    notesCreate,
    notesFindAll, 
    notesFindOne,
    notesUpdate,
    notesDelete
} from "@growthos/api-client";

export interface Note {
    id: string;
    userTopicId: string;
    title: string;
    content: string;
    orderIndex: number;
    isPinned: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateNoteData {
    userTopicId: string;
    title: string;
    content: string;
    orderIndex?: number;
    isPinned?: boolean;
}

export interface UpdateNoteData {
    title?: string;
    content?: string;
    orderIndex?: number;
    isPinned?: boolean;
}

export const createNote = async ( data: CreateNoteData ) => {
    const response = await notesCreate( {
        body: data
    } );
    return response.data?.data;
};

export const getNotes = async ( userTopicId?: string ) => {
    const queries: any = {
        page: 1,
        limit: 100
    };
    
    // Only add userTopicId if it's defined
    if ( userTopicId ) {
        queries.userTopicId = userTopicId;
    }
    
    const response = await notesFindAll( {
        queries
    } );
    return response.data?.data || [];
};

export const getNote = async ( id: string ) => {
    const response = await notesFindOne( {
        path: { id }
    } );
    return response.data;
};

export const updateNote = async ( id: string, data: UpdateNoteData ) => {
    const response = await notesUpdate( {
        path: { id },
        body: data
    } );
    return response.data?.data;
};

export const deleteNote = async ( id: string ) => {
    const response = await notesDelete( {
        path: { id }
    } );
    return response.data;
};
