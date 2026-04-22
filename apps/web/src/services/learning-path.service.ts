import { userLearningPathsFindAll } from "@growthos/api-client"

export const getLearingPath = async () => {
    const response = await userLearningPathsFindAll();
    return response.data;
}
