import { Entity, Column, OneToOne, JoinColumn } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { UserEntity } from './user.entity.js'

@Entity( 'user_profiles' )
export class UserProfileEntity extends IdTimestamppedEntity {
    @OneToOne( () => UserEntity )
    @JoinColumn( { name: 'userId' } )
    user: UserEntity

    @Column( { type: 'varchar' } )
    userId: string

    // Personal Information
    @Column( { type: 'varchar', nullable: true } )
    phone?: string

    @Column( { type: 'date', nullable: true } )
    dateOfBirth?: Date

    // Location
    @Column( { type: 'varchar', nullable: true } )
    city?: string

    @Column( { type: 'varchar', nullable: true } )
    state?: string

    @Column( { type: 'varchar', nullable: true } )
    country?: string

    // Professional
    @Column( { type: 'varchar', nullable: true } )
    occupation?: string

    @Column( { type: 'varchar', nullable: true } )
    company?: string

    @Column( { type: 'varchar', nullable: true } )
    experience?: string

    // Education
    @Column( { type: 'varchar', nullable: true } )
    highestEducation?: string

    @Column( { type: 'varchar', nullable: true } )
    fieldOfStudy?: string

    @Column( { type: 'varchar', nullable: true } )
    institution?: string

    @Column( { type: 'varchar', nullable: true } )
    graduationYear?: string

    // Goals
    @Column( { type: 'varchar', nullable: true } )
    learningGoal?: string

    @Column( { type: 'varchar', nullable: true } )
    targetExam?: string

    // Social
    @Column( { type: 'varchar', nullable: true } )
    linkedinUrl?: string

    @Column( { type: 'varchar', nullable: true } )
    githubUrl?: string

    @Column( { type: 'varchar', nullable: true } )
    twitterUrl?: string

    @Column( { type: 'varchar', nullable: true } )
    websiteUrl?: string

    // Bio
    @Column( { type: 'text', nullable: true } )
    bio?: string

    // Avatar
    @Column( { type: 'varchar', nullable: true } )
    avatarUrl?: string
}
