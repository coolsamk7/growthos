import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserEntity, UserProfileEntity } from '@growthos/nestjs-database/entities';
import { Value } from 'typebox/value';
import { UpdatePersonalInfoRequest } from '../dtos/update-personal-info.dto';

@Injectable()
export class UserProfileService {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource
    ) {}

    async getProfile( userId: string ) {
        const user = await this.dataSource.manager.findOne( UserEntity, { 
            where: { id: userId } 
        } );

        if ( !user ) {
            throw new NotFoundException( 'User not found' );
        }

        let profile = await this.dataSource.manager.findOne( UserProfileEntity, { 
            where: { userId } 
        } );

        // If profile doesn't exist, create an empty one
        if ( !profile ) {
            profile = this.dataSource.manager.create( UserProfileEntity, { userId } );
            await this.dataSource.manager.save( profile );
        }

        return {
            userId: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: profile.phone,
            dateOfBirth: profile.dateOfBirth,
            city: profile.city,
            state: profile.state,
            country: profile.country,
            occupation: profile.occupation,
            company: profile.company,
            experience: profile.experience,
            highestEducation: profile.highestEducation,
            fieldOfStudy: profile.fieldOfStudy,
            institution: profile.institution,
            graduationYear: profile.graduationYear,
            learningGoal: profile.learningGoal,
            targetExam: profile.targetExam,
            linkedinUrl: profile.linkedinUrl,
            githubUrl: profile.githubUrl,
            twitterUrl: profile.twitterUrl,
            websiteUrl: profile.websiteUrl,
            bio: profile.bio,
            avatarUrl: profile.avatarUrl
        };
    }

    async updatePersonalInfo( userId: string, data: { firstName?: string; lastName?: string; phone?: string; dateOfBirth?: string } ) {
        // Validate data against TypeBox schema
        const isValid = Value.Check( UpdatePersonalInfoRequest, data );
        if ( !isValid ) {
            const errors = [ ...Value.Errors( UpdatePersonalInfoRequest, data ) ];
            const errorMessages = errors.map( err => err.message ).join( ', ' );
            throw new BadRequestException( `Validation failed: ${errorMessages}` );
        }

        const user = await this.dataSource.manager.findOne( UserEntity, { 
            where: { id: userId } 
        } );

        if ( !user ) {
            throw new NotFoundException( 'User not found' );
        }

        // Update user table if firstName or lastName provided
        if ( data.firstName !== undefined || data.lastName !== undefined ) {
            if ( data.firstName !== undefined ) user.firstName = data.firstName;
            if ( data.lastName !== undefined ) user.lastName = data.lastName;
            await this.dataSource.manager.save( user );
        }

        // Get or create profile
        let profile = await this.dataSource.manager.findOne( UserProfileEntity, { 
            where: { userId } 
        } );

        if ( !profile ) {
            profile = this.dataSource.manager.create( UserProfileEntity, { userId } );
        }

        // Update profile
        if ( data.phone !== undefined ) profile.phone = data.phone;
        if ( data.dateOfBirth !== undefined ) profile.dateOfBirth = new Date( data.dateOfBirth );

        await this.dataSource.manager.save( profile );

        return {
            firstName: user.firstName,
            lastName: user.lastName,
            phone: profile.phone,
            dateOfBirth: profile.dateOfBirth?.toISOString().split( 'T' )[0]
        };
    }

    async updateLocation( userId: string, data: { city?: string; state?: string; country?: string } ) {
        let profile = await this.dataSource.manager.findOne( UserProfileEntity, { 
            where: { userId } 
        } );

        if ( !profile ) {
            profile = this.dataSource.manager.create( UserProfileEntity, { userId } );
        }

        if ( data.city !== undefined ) profile.city = data.city;
        if ( data.state !== undefined ) profile.state = data.state;
        if ( data.country !== undefined ) profile.country = data.country;

        await this.dataSource.manager.save( profile );

        return {
            city: profile.city,
            state: profile.state,
            country: profile.country
        };
    }

    async updateProfessionalInfo( userId: string, data: { occupation?: string; company?: string; experience?: string } ) {
        let profile = await this.dataSource.manager.findOne( UserProfileEntity, { 
            where: { userId } 
        } );

        if ( !profile ) {
            profile = this.dataSource.manager.create( UserProfileEntity, { userId } );
        }

        if ( data.occupation !== undefined ) profile.occupation = data.occupation;
        if ( data.company !== undefined ) profile.company = data.company;
        if ( data.experience !== undefined ) profile.experience = data.experience;

        await this.dataSource.manager.save( profile );

        return {
            occupation: profile.occupation,
            company: profile.company,
            experience: profile.experience
        };
    }

    async updateEducation( userId: string, data: { highestEducation?: string; fieldOfStudy?: string; institution?: string; graduationYear?: string } ) {
        let profile = await this.dataSource.manager.findOne( UserProfileEntity, { 
            where: { userId } 
        } );

        if ( !profile ) {
            profile = this.dataSource.manager.create( UserProfileEntity, { userId } );
        }

        if ( data.highestEducation !== undefined ) profile.highestEducation = data.highestEducation;
        if ( data.fieldOfStudy !== undefined ) profile.fieldOfStudy = data.fieldOfStudy;
        if ( data.institution !== undefined ) profile.institution = data.institution;
        if ( data.graduationYear !== undefined ) profile.graduationYear = data.graduationYear;

        await this.dataSource.manager.save( profile );

        return {
            highestEducation: profile.highestEducation,
            fieldOfStudy: profile.fieldOfStudy,
            institution: profile.institution,
            graduationYear: profile.graduationYear
        };
    }

    async updateGoals( userId: string, data: { learningGoal?: string; targetExam?: string; bio?: string } ) {
        let profile = await this.dataSource.manager.findOne( UserProfileEntity, { 
            where: { userId } 
        } );

        if ( !profile ) {
            profile = this.dataSource.manager.create( UserProfileEntity, { userId } );
        }

        if ( data.learningGoal !== undefined ) profile.learningGoal = data.learningGoal;
        if ( data.targetExam !== undefined ) profile.targetExam = data.targetExam;
        if ( data.bio !== undefined ) profile.bio = data.bio;

        await this.dataSource.manager.save( profile );

        return {
            learningGoal: profile.learningGoal,
            targetExam: profile.targetExam,
            bio: profile.bio
        };
    }

    async updateSocialLinks( userId: string, data: { linkedinUrl?: string; githubUrl?: string; twitterUrl?: string; websiteUrl?: string } ) {
        let profile = await this.dataSource.manager.findOne( UserProfileEntity, { 
            where: { userId } 
        } );

        if ( !profile ) {
            profile = this.dataSource.manager.create( UserProfileEntity, { userId } );
        }

        if ( data.linkedinUrl !== undefined ) profile.linkedinUrl = data.linkedinUrl;
        if ( data.githubUrl !== undefined ) profile.githubUrl = data.githubUrl;
        if ( data.twitterUrl !== undefined ) profile.twitterUrl = data.twitterUrl;
        if ( data.websiteUrl !== undefined ) profile.websiteUrl = data.websiteUrl;

        await this.dataSource.manager.save( profile );

        return {
            linkedinUrl: profile.linkedinUrl,
            githubUrl: profile.githubUrl,
            twitterUrl: profile.twitterUrl,
            websiteUrl: profile.websiteUrl
        };
    }
}
