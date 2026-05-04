import { userLearningPathsCreate, userLearningPathsFindAll } from "@growthos/api-client"

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

