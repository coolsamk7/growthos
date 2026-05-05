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
    problemCount?: number;
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

export const getUserTopics = async ( userModuleId: string, page: number = 1, limit: number = 100 ) => {
    console.log( '[user-topic.service] getUserTopics called with:', { userModuleId, page, limit } );
    
    if ( !userModuleId ) {
        console.error( '[user-topic.service] ERROR: userModuleId is missing!' );
        throw new Error( 'userModuleId is required' );
    }
    
    const queryParams = {
        page,
        limit,
        userModuleId
    };
    
    console.log( '[user-topic.service] Sending queries:', queryParams );
    
    const response = await userTopicsFindAll( {
        query: queryParams
    } );
    
    console.log( '[user-topic.service] Response received:', response );
    
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
