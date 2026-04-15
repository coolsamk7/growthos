import { Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { CommandRunner, SubCommand } from 'nest-commander';
import { DataSource } from 'typeorm';
import { UserEntity } from '@growthos/nestjs-database/entities';
import { UserRole, UserStatus } from '@growthos/nestjs-shared';
import bcrypt from 'bcrypt';

@SubCommand( { name: 'create-users' } )
export class CreateUsersCommand extends CommandRunner {
    private readonly logger = new Logger( CreateUsersCommand.name );
    
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
    ) {
        super();
    }

    async run( _passedParams: string[], options?: Record<string, any> ) {
        this.logger.log( '🌱 Creating users...' );
        
        const userRepo = this.dataSource.getRepository( UserEntity );
        const password = '123456789';
        const hashedPassword = await bcrypt.hash( password, 12 );
        
        const users = [
            {
                email: 'user@growthos.com',
                password: hashedPassword,
                firstName: 'Regular',
                lastName: 'User',
                role: UserRole.USER,
                status: UserStatus.ACTIVE,
            },
            {
                email: 'content@growthos.com',
                password: hashedPassword,
                firstName: 'Content',
                lastName: 'Creator',
                role: UserRole.CONTENT_CREATOR,
                status: UserStatus.ACTIVE,
            },
            {
                email: 'admin@growthos.com',
                password: hashedPassword,
                firstName: 'Admin',
                lastName: 'User',
                role: UserRole.ADMIN,
                status: UserStatus.ACTIVE,
            },
            {
                email: 'inactive@growthos.com',
                password: hashedPassword,
                firstName: 'Inactive',
                lastName: 'User',
                role: UserRole.USER,
                status: UserStatus.INACTIVE,
            },
        ];

        for ( const userData of users ) {
            const existingUser = await userRepo.findOne( {
                where: { email: userData.email },
            } );

            if ( existingUser ) {
                this.logger.warn( `⚠️  User ${userData.email} already exists, skipping...` );
                continue;
            }

            const user = userRepo.create( userData );
            await userRepo.save( user );
            this.logger.log( `✅ Created user: ${userData.email} (${userData.role})` );
        }

        this.logger.log( '🎉 User creation completed!' );
        this.logger.log( '\n📋 Summary:' );
        this.logger.log( '  - user@growthos.com (USER, ACTIVE)' );
        this.logger.log( '  - content@growthos.com (CONTENT_CREATOR, ACTIVE)' );
        this.logger.log( '  - admin@growthos.com (ADMIN, ACTIVE)' );
        this.logger.log( '  - inactive@growthos.com (USER, INACTIVE)' );
        this.logger.log( '\n🔑 Password for all users: 123456789' );
    }
}
