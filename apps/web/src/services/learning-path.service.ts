import { userLearningPathsCreate, userLearningPathsFindAll, userLearningPathsFindOne, userLearningPathsDelete } from "@growthos/api-client"

export const addNewLearningPath = async ( data: { 
    title: string;
    description: string;
    targetDate: string;
} ) => {
    const response = await userLearningPathsCreate( {
        body: {
            name: data.title,
            description: data.description,
            targetDate: data.targetDate,
        }
    } )
    return response.data;
}

export const getLearingPaths = async () => {
    const response = await userLearningPathsFindAll();
    const paths = response.data?.data || [];
    return paths.map( ( path: any ) => ( {
        ...path,
        title: path.name,
        progress: 0,
        completedItems: 0,
        totalItems: 0,
    } ) );
}

export const getLearningPath = async ( id: string ) => {
    const response = await userLearningPathsFindOne( {
        path: { id }
    } );
    const path = response.data;
    if ( !path ) return null;
    
    return {
        ...path,
        title: path.name,
    };
}

export const deleteLearningPath = async ( id: string ) => {
    const response = await userLearningPathsDelete( {
        path: { id }
    } );
    return response.data;
}

