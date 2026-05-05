import { apiClient } from './api';

export interface StudySession {
    id: string;
    userId: string;
    userLearningPathId?: string;
    userModuleId?: string;
    userTopicId?: string;
    userProblemId?: string;
    durationMinutes: number;
    durationSeconds?: number;
    notes?: string;
    sessionDate: string;
    startTime?: string;
    endTime?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    userLearningPath?: any;
    userModule?: any;
    userTopic?: any;
    userProblem?: any;
}

export interface CreateSessionData {
    userLearningPathId?: string;
    userModuleId?: string;
    userTopicId?: string;
    userProblemId?: string;
    notes?: string;
}

export interface UpdateSessionData {
    userLearningPathId?: string;
    userModuleId?: string;
    userTopicId?: string;
    userProblemId?: string;
    durationMinutes?: number;
    notes?: string;
}

export interface HeatmapData {
    [date: string]: number;
}

export const startStudySession = async ( data: CreateSessionData ): Promise<StudySession> => {
    const response = await apiClient.post( '/v1/study-sessions/start', data );
    return response.data?.data;
};

export const stopStudySession = async ( sessionId: string ): Promise<StudySession> => {
    const response = await apiClient.put( `/v1/study-sessions/${sessionId}/stop`, {} );
    return response.data?.data;
};

export const getActiveSession = async (): Promise<StudySession | null> => {
    const response = await apiClient.get( '/v1/study-sessions/active' );
    return response.data?.data;
};

export const getStudySessions = async ( page: number = 1, limit: number = 20 ) => {
    const response = await apiClient.get( '/v1/study-sessions', {
        params: { page, limit }
    } );
    return {
        data: response.data?.data || [],
        total: response.data?.total || 0,
        page: response.data?.page || 1,
        limit: response.data?.limit || limit,
        totalPages: response.data?.totalPages || 1,
    };
};

export const getStudySession = async ( id: string ): Promise<StudySession> => {
    const response = await apiClient.get( `/v1/study-sessions/${id}` );
    return response.data;
};

export const updateStudySession = async ( id: string, data: UpdateSessionData ): Promise<StudySession> => {
    const response = await apiClient.put( `/v1/study-sessions/${id}`, data );
    return response.data?.data;
};

export const deleteStudySession = async ( id: string ) => {
    const response = await apiClient.delete( `/v1/study-sessions/${id}` );
    return response.data;
};

export const getHeatmapData = async ( startDate?: string, endDate?: string ): Promise<HeatmapData> => {
    const params: any = {};
    if ( startDate ) params.startDate = startDate;
    if ( endDate ) params.endDate = endDate;
    
    const response = await apiClient.get( '/v1/study-sessions/heatmap', { params } );
    return response.data?.data || {};
};
