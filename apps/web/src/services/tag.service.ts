import { 
    tagsFindAll,
    tagsCreate,
    tagsUpdate,
    tagsDelete,
    tagsFindOne,
    tagsGetMasterProblemTags,
    tagsGetUserProblemTags,
    tagsAttachToMasterProblem,
    tagsAttachToUserProblem,
    tagsDetachFromMasterProblem,
    tagsDetachFromUserProblem,
    tagsAttachToUserModule,
    tagsAttachToUserTopic,
    tagsDetachFromUserTopic,
    tagsDetachFromUserModule,
    tagsGetUserTopicTags,
    tagsGetUserModuleTags,
    tagsGetStudySessionTags,
    tagsAttachToStudySession,
    tagsDetachFromStudySession
} from '@growthos/api-client';
import { apiClient } from '@/lib/api-client';

export interface Tag {
    id: string;
    name: string;
    category?: string;
    description?: string;
    color?: string;
    usageCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTagData {
    name: string;
    category?: string;
    description?: string;
    color?: string;
}

export interface UpdateTagData {
    name?: string;
    category?: string;
    description?: string;
    color?: string;
}

export type TagItemType = 'master-problem' | 'user-problem' | 'user-module' | 'user-topic' | 'study-session';

// ===== CRUD Operations =====

export const getAllTags = async ( params?: { page?: number; limit?: number; category?: string } ) => {
    const response = await tagsFindAll( {
        query: {
            page: params?.page || 1,
            limit: params?.limit || 100,
            ...( params?.category && { category: params.category } )
        }
    } );
    return {
        data: response.data?.data || [],
        total: response.data?.total || 0,
        page: response.data?.page || 1,
        limit: response.data?.limit || 100
    };
};

export const getTagById = async ( tagId: string ) => {
    const response = await tagsFindOne( {
        path: { id: tagId }
    } );
    return response.data?.data;
};

export const createTag = async ( data: CreateTagData ) => {
    const response = await tagsCreate( {
        body: data
    } );
    return response.data?.data;
};

export const updateTag = async ( tagId: string, data: UpdateTagData ) => {
    const response = await tagsUpdate( {
        path: { id: tagId },
        body: data
    } );
    return response.data?.data;
};

export const deleteTag = async ( tagId: string ) => {
    const response = await tagsDelete( {
        path: { id: tagId }
    } );
    return response.data;
};

// ===== Get Tags for Items =====

export const getItemTags = async ( type: TagItemType, itemId: string ): Promise<Tag[]> => {
    let response: any;
    
    switch ( type ) {
        case 'master-problem':
            response = await tagsGetMasterProblemTags( {
                path: { problemId: itemId }
            } );
            break;
            
        case 'user-problem':
            response = await tagsGetUserProblemTags( {
                path: { problemId: itemId }
            } );
            break;
            
        case 'user-module':
            response = await tagsGetUserModuleTags( {
                path: { moduleId: itemId }
            } )
            break
        case 'user-topic':
            response = await tagsGetUserTopicTags( { path: { topicId: itemId  } } )
            break;
        case 'study-session':
            response = await tagsGetStudySessionTags( { path: { sessionId: itemId } } )
            break;
            
        default:
            throw new Error( `Unknown item type: ${type}` );
    }
    
    return response.data?.data || response.data || [];
};

// ===== Attach Tags to Items =====

export const attachTagsToItem = async ( 
    type: TagItemType, 
    itemId: string, 
    tagIds: string[] 
): Promise<void> => {
    switch ( type ) {
        case 'master-problem':
            await tagsAttachToMasterProblem( {
                path: { problemId: itemId },
                body: { tagIds }
            } );
            break;
            
        case 'user-problem':
            await tagsAttachToUserProblem( {
                path: { problemId: itemId },
                body: { tagIds }
            } );
            break;
            
        case 'user-module':
            await tagsAttachToUserModule( {
                path: { moduleId: itemId }, body: { tagIds }
            } )
            break;
        case 'user-topic':
            await tagsAttachToUserTopic( {
                path: { topicId: itemId }, body: { tagIds }
            } )
            break;
        case 'study-session':
            await tagsAttachToStudySession( {
                path: { sessionId: itemId }, body: { tagIds }
            } )
            break; 
        default:
            throw new Error( `Unknown item type: ${type}` );
    }
};

// ===== Detach Tags from Items =====

export const detachTagFromItem = async ( 
    type: TagItemType, 
    itemId: string, 
    tagId: string 
): Promise<void> => {
    switch ( type ) {
        case 'master-problem':
            await tagsDetachFromMasterProblem( {
                path: { problemId: itemId, tagId }
            } );
            break;
            
        case 'user-problem':
            await tagsDetachFromUserProblem( {
                path: { problemId: itemId, tagId }
            } );
            break;
            
        case 'user-module':
            await tagsDetachFromUserModule( { path: { moduleId: itemId, tagId } } )
            break;
        case 'user-topic':
            await tagsDetachFromUserTopic( { path: { topicId: itemId, tagId } } )
            break;
        case 'study-session':
            // These endpoints are not in SDK yet, use apiClient
            await tagsDetachFromStudySession( { path: { sessionId: itemId, tagId } } )

            break;
            
        default:
            throw new Error( `Unknown item type: ${type}` );
    }
};
