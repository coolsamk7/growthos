import { 
    userModulesCreate,
    userModulesFindAll, 
    userModulesFindOne,
    userModulesUpdate,
    userModulesDelete
} from "@growthos/api-client";

export type ModuleStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface UserModule {
    id: string;
    userLearningPathId: string;
    masterModuleId?: string;
    name: string;
    description?: string;
    status: ModuleStatus;
    progress: number;
    orderIndex: number;
    startedAt?: string;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
    topicCount?: number;
}

export interface CreateModuleData {
    userLearningPathId: string;
    masterModuleId?: string;
    name: string;
    description?: string;
    orderIndex?: number;
}

export interface UpdateModuleData {
    name?: string;
    description?: string;
    status?: ModuleStatus;
    progress?: number;
    orderIndex?: number;
    startedAt?: string;
    completedAt?: string;
}

export const createUserModule = async ( data: CreateModuleData ) => {
    const response = await userModulesCreate( {
        body: data
    } );
    return response.data?.data;
};

export const getUserModules = async ( userLearningPathId?: string ) => {
    const response = await userModulesFindAll( {
        query: {
            userLearningPathId,
            page: 1,
            limit: 100
        }
    } );
    return response.data?.data || [];
};

export const getUserModule = async ( id: string ) => {
    const response = await userModulesFindOne( {
        path: { id }
    } );
    return response.data;
};

export const updateUserModule = async ( id: string, data: UpdateModuleData ) => {
    const response = await userModulesUpdate( {
        path: { id },
        body: data
    } );
    return response.data?.data;
};

export const deleteUserModule = async ( id: string ) => {
    const response = await userModulesDelete( {
        path: { id }
    } );
    return response.data;
};
