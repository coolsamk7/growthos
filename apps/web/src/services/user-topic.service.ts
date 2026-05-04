import { 
    userTopicsCreate,
    userTopicsFindAll, 
    userTopicsFindOne,
    userTopicsUpdate,
    userTopicsDelete
} from "@growthos/api-client";

export type TopicStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'MASTERED';

export interface UserTopic {
    id: string;
    userLearningPathId: string;
    userModuleId?: string;
    name: string;
    description?: string;
    status: TopicStatus;
    confidenceScore: number;
    orderIndex: number;
    lastRevisedAt?: string;
    masterTopicId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTopicData {
    userLearningPathId: string;
    userModuleId?: string;
    name: string;
    description?: string;
    status?: TopicStatus;
    orderIndex?: number;
    confidenceScore?: number;
    masterTopicId?: string;
}

export interface UpdateTopicData {
    name?: string;
    description?: string;
    status?: TopicStatus;
    confidenceScore?: number;
    orderIndex?: number;
    userModuleId?: string;
}

export const createUserTopic = async ( data: CreateTopicData ) => {
    const response = await userTopicsCreate( {
        body: data
    } );
    return response.data?.data;
};

export const getUserTopics = async ( userModuleId?: string, page: number = 1, limit: number = 100 ) => {
    const queries: any = {
        page,
        limit
    };
    
    // Only add userModuleId if it's defined
    if ( userModuleId ) {
        queries.userModuleId = userModuleId;
    }
    
    const response = await userTopicsFindAll( {
        queries
    } );
    return {
        data: response.data?.data || [],
        total: response.data?.total || 0,
        page: response.data?.page || 1,
        limit: response.data?.limit || limit,
        totalPages: response.data?.totalPages || 1,
    };
};

export const getUserTopic = async ( id: string ) => {
    const response = await userTopicsFindOne( {
        path: { id }
    } );
    return response.data;
};

export const updateUserTopic = async ( id: string, data: UpdateTopicData ) => {
    const response = await userTopicsUpdate( {
        path: { id },
        body: data
    } );
    return response.data?.data;
};

export const deleteUserTopic = async ( id: string ) => {
    const response = await userTopicsDelete( {
        path: { id }
    } );
    return response.data;
};
