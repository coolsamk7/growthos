import bcrypt from 'bcrypt'
import { BeforeInsert, Entity, Column, Index } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { UserRole, UserStatus } from '@growthos/nestjs-shared'

@Entity( 'users' )
export class UserEntity extends IdTimestamppedEntity {
    @Column( { type: 'varchar', unique: true } )
    @Index()
    email: string

    @Column( { type: 'varchar' } )
    password: string

    @Column( { type: 'varchar', nullable: true } )
    firstName?: string

    @Column( { type: 'varchar', nullable: true } )
    lastName?: string

    @Column( {
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.INACTIVE,
    } )
    @Index()
    status: UserStatus

    @Column( {
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    } )
    role: UserRole
}
