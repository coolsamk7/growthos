import { 
    resourcesCreate,
    resourcesFindAll, 
    resourcesFindOne,
    resourcesUpdate,
    resourcesDelete
} from "@growthos/api-client";

export type ResourceEntityType = 'module' | 'topic' | 'problem';

export interface Resource {
    id: string;
    entityType: ResourceEntityType;
    entityId: string;
    title: string;
    url: string;
    type?: string;
    description?: string;
    orderIndex: number;
    isCompleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateResourceData {
    entityType: ResourceEntityType;
    entityId: string;
    title: string;
    url: string;
    type?: string;
    description?: string;
    orderIndex?: number;
    isCompleted?: boolean;
}

export interface UpdateResourceData {
    title?: string;
    url?: string;
    type?: string;
    description?: string;
    orderIndex?: number;
    isCompleted?: boolean;
}

export const createResource = async ( data: CreateResourceData ) => {
    const response = await resourcesCreate( {
        body: data
    } );
    return response.data?.data;
};

export const getResources = async ( entityType: ResourceEntityType, entityId: string, page: number = 1, limit: number = 100 ) => {
    if ( !entityType || !entityId ) {
        throw new Error( 'entityType and entityId are required' );
    }
    
    const response = await resourcesFindAll( {
        query: {
            page,
            limit,
            entityType,
            entityId
        }
    } );
    
    return {
        data: response.data?.data || [],
        total: response.data?.total || 0,
        page: response.data?.page || 1,
        limit: response.data?.limit || limit,
        totalPages: response.data?.totalPages || 1,
    };
};

export const getResource = async ( id: string ) => {
    const response = await resourcesFindOne( {
        path: { id }
    } );
    return response.data;
};

export const updateResource = async ( id: string, data: UpdateResourceData ) => {
    const response = await resourcesUpdate( {
        path: { id },
        body: data
    } );
    return response.data?.data;
};

export const deleteResource = async ( id: string ) => {
    const response = await resourcesDelete( {
        path: { id }
    } );
    return response.data;
};
