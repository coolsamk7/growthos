import { userProfileGetProfile } from "@growthos/api-client"

export const getUserProfileInformation = async () => {
    const response  = await userProfileGetProfile( {
       headers: {
             Authorization: `Bearer ${localStorage.getItem( "accessToken" )}`,
        } 
    } )
    return response.data
}
