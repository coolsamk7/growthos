import * as entities from '@growthos/nestjs-database/entities';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbRootCommand } from './commands';
import { databaseConfig } from './config';

@Module( {
    imports: [
        ConfigModule.forRoot( {
            isGlobal: true,
            load: [ databaseConfig ],
            envFilePath: [ '.env.local', '.env.production', '.env' ],
        } ),
        TypeOrmModule.forRootAsync( {
            imports: [ ConfigModule ],
            inject: [ ConfigService ],
            useFactory( configService: ConfigService ) {
                return {
                    ...configService.get( 'database.config' ),
                    entities: Object.values( entities ),
                };
            },
        } ),
        TypeOrmModule.forFeature( Object.values( entities ) )
    ],
    providers: [ ...DbRootCommand.registerWithSubCommands() ],
} )
export class CliModule {}
