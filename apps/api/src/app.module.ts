import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig, jwtConfig, loggerConfig, kafkaConfig } from './config';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './modules/auth';
import { KafkaProducerService } from './services/kafka-producer.service';

@Module( {
    imports: [
        ConfigModule.forRoot( {
            isGlobal: true,
            load: [ databaseConfig, loggerConfig, jwtConfig, kafkaConfig ],
        } ),
        LoggerModule.forRootAsync( {
            imports: [ ConfigModule ],
            inject: [ ConfigService ],
            useFactory( configService: ConfigService ) {
                return configService.getOrThrow( 'logger.config' );
            },
        } ),
        JwtModule.registerAsync( {
            global: true,
            imports: [ ConfigModule ],
            inject: [ ConfigService ],
            useFactory( configService: ConfigService ) {
                return configService.getOrThrow( 'jwt.config' );
            },
        } ),
        PassportModule.register( {
            defaultStrategy: 'jwt',
        } ),
        TypeOrmModule.forRootAsync( {
            imports: [ ConfigModule ],
            inject: [ ConfigService ],
            async useFactory( configService: ConfigService ) {
                console.log( "inside typeorm config factory", configService.get( 'database.config' ) )
                return configService.getOrThrow( 'database.config' );
            },
        } ),
        AuthModule
    ],
    providers: [ KafkaProducerService ],
} )
export class AppModule {}
