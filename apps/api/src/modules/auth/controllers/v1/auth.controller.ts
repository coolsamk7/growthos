import { Controller, Post, Body, HttpStatus, HttpCode, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/guards/public.guard';
import { SignupRequest, SignupResponse, VerifyOtpRequest, VerifyOtpResponse } from '../../dtos'
import type { Static } from 'typebox';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserEntity } from '@growthos/nestjs-database/entities';
import {  OtpService, QueueProducerService } from 'src/services';
import { MailQueueProducerService } from 'src/modules/queue/mail-queue-producer.service';

@ApiTags( 'Auth' )
@Controller( { path: 'auth', version: '1' } )
export class AuthController {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private readonly otpService: OtpService,
        private readonly mailQueue: MailQueueProducerService 
    ) {}

    @Public()
    @Post( 'signup' )
    @ApiBody( { schema: SignupRequest } )
    @ApiOkResponse( { schema: SignupResponse } )
    async signup( @Body() signupDto: Static<typeof SignupRequest> ) {
        const user = await this.dataSource.manager.findOne( UserEntity, { where: { email: signupDto.email } } );
        if ( user ) {
            throw new BadRequestException( { message: `User with email ${signupDto.email} already exists` } );
        }

        const newUser = this.dataSource.manager.create( UserEntity, {
            email: signupDto.email,
            password: await bcrypt.hash( signupDto.password, 12 ),
            firstName: signupDto.firstName,
            lastName: signupDto.lastName,
        } );

        const savedUser = await this.dataSource.manager.save( newUser );
        if ( !savedUser ) {
            throw new InternalServerErrorException( 'Failed to create user' );
        }

        // Generate and store OTP in Redis
        const otp = this.otpService.generateOtp();
        await this.otpService.storeOtp( savedUser.id, otp );

        this.mailQueue.addToMailQueue( 'sendOTP', { code: otp, email: savedUser.email, userId: savedUser.id } ) 

        return { message: 'User created successfully. Please verify your email with the OTP sent.', userId: savedUser.id };
    }

    @Public()
    @Post( 'verify-otp' )
    @ApiBody( { schema: VerifyOtpRequest } )
    @ApiOkResponse( { schema: VerifyOtpResponse } )
    async verifyOtp( @Body() verifyOtpDto: Static<typeof VerifyOtpRequest> ) {
        const user = await this.dataSource.manager.findOne( UserEntity, { where: { id: verifyOtpDto.userId } } );
        if ( !user ) {
            throw new BadRequestException( { message: 'User not found' } );
        }

        const isValid = await this.otpService.verifyOtp( verifyOtpDto.userId, verifyOtpDto.otp );
        if ( !isValid ) {
            throw new BadRequestException( { message: 'Invalid or expired OTP' } );
        }

        // Update user status to active
        user.status = 'ACTIVE' as any;
        await this.dataSource.manager.save( user );

        return { message: 'Email verified successfully. Welcome email sent!' };
    }
}
