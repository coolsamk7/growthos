import { Controller, Post, Body, HttpStatus, HttpCode, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/guards/public.guard';
import { SignupRequest, SignupResponse } from '../../dtos'
import type { Static } from 'typebox';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserEntity } from '@growthos/nestjs-database/entities';
import { KafkaProducerService } from 'src/services/kafka-producer.service';

@ApiTags( 'Auth' )
@Controller( { path: 'auth', version: '1' } )
export class AuthController {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private readonly kafkaProducer: KafkaProducerService,
    ) {}

    @Public()
    @Post( 'signup' )
    @ApiBody( { schema: SignupRequest } )
    @ApiOkResponse( { schema: SignupResponse } )
    async signup( @Body() signupDto: Static<typeof SignupRequest> ) {
        const user = await this.dataSource.manager.findOne( UserEntity, { where: { email: signupDto.email } } );
        if ( user ) {
            throw new BadRequestException({ message: `User with email ${signupDto.email} already exists` });
        }

        const newUser = this.dataSource.manager.create( UserEntity, {
            email: signupDto.email,
            password: signupDto.password,
            firstName: signupDto.firstName,
            lastName: signupDto.lastName,
        } );

        const savedUser = await this.dataSource.manager.save( newUser );
        if ( !savedUser ) {
            throw new InternalServerErrorException( 'Failed to create user' );
        }

        // Publish mail event to Kafka
        await this.kafkaProducer.sendMailEvent( 'signup_welcome', {
            email: savedUser.email,
            firstName: savedUser.firstName,
        } );

        return { message: 'User created successfully' };
    }
}
