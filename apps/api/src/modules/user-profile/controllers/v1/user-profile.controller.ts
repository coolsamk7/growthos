import { Controller, Get, Put, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthenticatedUser } from 'src/decorators';
import { UserProfileService } from '../../services/user-profile.service';
import type { Static } from 'typebox';
import {
    GetProfileResponse,
    UpdatePersonalInfoRequest,
    UpdatePersonalInfoResponse,
    UpdateLocationRequest,
    UpdateLocationResponse,
    UpdateProfessionalInfoRequest,
    UpdateProfessionalInfoResponse,
    UpdateEducationRequest,
    UpdateEducationResponse,
    UpdateGoalsRequest,
    UpdateGoalsResponse,
    UpdateSocialLinksRequest,
    UpdateSocialLinksResponse
} from '../../dtos';

@ApiTags( 'User Profile' )
@ApiBearerAuth()
@Controller( { path: 'user/profile', version: '1' } )
export class UserProfileController {
    constructor( private readonly userProfileService: UserProfileService ) {}

    @Get()
    @HttpCode( HttpStatus.OK )
    @ApiOkResponse( { schema: GetProfileResponse } )
    async getProfile( @AuthenticatedUser() currentUser: any ) {
        const profile = await this.userProfileService.getProfile( currentUser.id );
        return {
            message: 'Profile retrieved successfully',
            data: profile
        };
    }

    @Put( 'personal-info' )
    @HttpCode( HttpStatus.OK )
    @ApiBody( { schema: UpdatePersonalInfoRequest } )
    @ApiOkResponse( { schema: UpdatePersonalInfoResponse } )
    async updatePersonalInfo(
        @AuthenticatedUser() currentUser: any,
        @Body() updateDto: Static<typeof UpdatePersonalInfoRequest>
    ) {
        const data = await this.userProfileService.updatePersonalInfo( currentUser.id, updateDto );
        return {
            message: 'Personal information updated successfully',
            data
        };
    }

    @Put( 'location' )
    @HttpCode( HttpStatus.OK )
    @ApiBody( { schema: UpdateLocationRequest } )
    @ApiOkResponse( { schema: UpdateLocationResponse } )
    async updateLocation(
        @AuthenticatedUser() currentUser: any,
        @Body() updateDto: Static<typeof UpdateLocationRequest>
    ) {
        const data = await this.userProfileService.updateLocation( currentUser.id, updateDto );
        return {
            message: 'Location updated successfully',
            data
        };
    }

    @Put( 'professional-info' )
    @HttpCode( HttpStatus.OK )
    @ApiBody( { schema: UpdateProfessionalInfoRequest } )
    @ApiOkResponse( { schema: UpdateProfessionalInfoResponse } )
    async updateProfessionalInfo(
        @AuthenticatedUser() currentUser: any,
        @Body() updateDto: Static<typeof UpdateProfessionalInfoRequest>
    ) {
        const data = await this.userProfileService.updateProfessionalInfo( currentUser.id, updateDto );
        return {
            message: 'Professional information updated successfully',
            data
        };
    }

    @Put( 'education' )
    @HttpCode( HttpStatus.OK )
    @ApiBody( { schema: UpdateEducationRequest } )
    @ApiOkResponse( { schema: UpdateEducationResponse } )
    async updateEducation(
        @AuthenticatedUser() currentUser: any,
        @Body() updateDto: Static<typeof UpdateEducationRequest>
    ) {
        const data = await this.userProfileService.updateEducation( currentUser.id, updateDto );
        return {
            message: 'Education information updated successfully',
            data
        };
    }

    @Put( 'goals' )
    @HttpCode( HttpStatus.OK )
    @ApiBody( { schema: UpdateGoalsRequest } )
    @ApiOkResponse( { schema: UpdateGoalsResponse } )
    async updateGoals(
        @AuthenticatedUser() currentUser: any,
        @Body() updateDto: Static<typeof UpdateGoalsRequest>
    ) {
        const data = await this.userProfileService.updateGoals( currentUser.id, updateDto );
        return {
            message: 'Goals updated successfully',
            data
        };
    }

    @Put( 'social-links' )
    @HttpCode( HttpStatus.OK )
    @ApiBody( { schema: UpdateSocialLinksRequest } )
    @ApiOkResponse( { schema: UpdateSocialLinksResponse } )
    async updateSocialLinks(
        @AuthenticatedUser() currentUser: any,
        @Body() updateDto: Static<typeof UpdateSocialLinksRequest>
    ) {
        const data = await this.userProfileService.updateSocialLinks( currentUser.id, updateDto );
        return {
            message: 'Social links updated successfully',
            data
        };
    }
}
