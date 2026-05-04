import { 
    userProblemsCreate,
    userProblemsFindAll, 
    userProblemsFindOne,
    userProblemsUpdate,
    userProblemsDelete
} from "@growthos/api-client";

export type ProblemDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type ProblemStatus = 'TODO' | 'IN_PROGRESS' | 'SOLVED' | 'REVIEWED';
export type ProblemSource = 'LEETCODE' | 'HACKERRANK' | 'CODEFORCES' | 'CUSTOM' | 'OTHER';

export interface UserProblem {
    id: string;
    userTopicId: string;
    title: string;
    externalUrl?: string;
    difficulty: ProblemDifficulty;
    status: ProblemStatus;
    source: ProblemSource;
    approachNotes?: string;
    solution?: string;
    isStarred: boolean;
    solvedAt?: string;
    masterProblemId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProblemData {
    userTopicId: string;
    title: string;
    externalUrl?: string;
    difficulty: ProblemDifficulty;
    status?: ProblemStatus;
    source?: ProblemSource;
    approachNotes?: string;
    solution?: string;
    isStarred?: boolean;
    masterProblemId?: string;
}

export interface UpdateProblemData {
    title?: string;
    externalUrl?: string;
    difficulty?: ProblemDifficulty;
    status?: ProblemStatus;
    source?: ProblemSource;
    approachNotes?: string;
    solution?: string;
    isStarred?: boolean;
    solvedAt?: string;
}

export const createUserProblem = async ( data: CreateProblemData ) => {
    const response = await userProblemsCreate( {
        body: data
    } );
    return response.data?.data;
};

export const getUserProblems = async ( userTopicId?: string, page: number = 1, limit: number = 100 ) => {
    const queries: any = {
        page,
        limit
    };
    
    // Only add userTopicId if it's defined
    if ( userTopicId ) {
        queries.userTopicId = userTopicId;
    }
    
    const response = await userProblemsFindAll( {
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

export const getUserProblem = async ( id: string ) => {
    const response = await userProblemsFindOne( {
        path: { id }
    } );
    return response.data;
};

export const updateUserProblem = async ( id: string, data: UpdateProblemData ) => {
    const response = await userProblemsUpdate( {
        path: { id },
        body: data
    } );
    return response.data?.data;
};

export const deleteUserProblem = async ( id: string ) => {
    const response = await userProblemsDelete( {
        path: { id }
    } );
    return response.data;
};
