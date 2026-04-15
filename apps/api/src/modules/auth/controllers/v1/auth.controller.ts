import { Controller, Post, Body, HttpStatus, HttpCode, BadRequestException, InternalServerErrorException, UnauthorizedException, UseGuards } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/guards/public.guard';
import { SignupRequest, SignupResponse, VerifyOtpRequest, VerifyOtpResponse, ForgotPasswordRequest, ForgotPasswordResponse, ForgotPasswordResetRequest, ForgotPasswordResetResponse, ResetPasswordRequest, ResetPasswordResponse, LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse, RevokeTokenRequest, RevokeTokenResponse } from '../../dtos'
import type { Static } from 'typebox';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, IsNull } from 'typeorm';
import { UserEntity, RefreshTokenEntity } from '@growthos/nestjs-database/entities';
import {  OtpService, QueueProducerService, TokenService } from 'src/services';
import { MailQueueProducerService } from 'src/modules/queue/mail-queue-producer.service';
import { AuthenticatedUser } from 'src/decorators';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@ApiTags( 'Auth' )
@Controller( { path: 'auth', version: '1' } )
export class AuthController {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private readonly otpService: OtpService,
        private readonly mailQueue: MailQueueProducerService,
        private readonly tokenService: TokenService,
        private readonly jwtService: JwtService
    ) {}

    @Public()
    @Post( 'login' )
    @HttpCode( HttpStatus.OK )
    @ApiBody( { schema: LoginRequest } )
    @ApiOkResponse( { schema: LoginResponse } )
    async login( @Body() loginDto: Static<typeof LoginRequest> ) {
        const user = await this.dataSource.manager.findOne( UserEntity, { where: { email: loginDto.email } } );
        if ( !user ) {
            throw new UnauthorizedException( { message: 'Invalid credentials' } );
        }

        const isPasswordValid = await bcrypt.compare( loginDto.password, user.password );
        if ( !isPasswordValid ) {
            throw new UnauthorizedException( { message: 'Invalid credentials' } );
        }

        if ( user.status !== 'ACTIVE' ) {
            throw new UnauthorizedException( { message: 'Account is not active. Please verify your email.' } );
        }

        const tokenPair = await this.tokenService.generateTokenPair( {
            id: user.id,
            email: user.email,
            roles: [ user.role ]
        } );

        return {
            message: 'Login successful',
            accessToken: tokenPair.accessToken,
            refreshToken: tokenPair.refreshToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                status: user.status
            }
        };
    }

    @Public()
    @Post( 'refresh-token' )
    @HttpCode( HttpStatus.OK )
    @ApiBody( { schema: RefreshTokenRequest } )
    @ApiOkResponse( { schema: RefreshTokenResponse } )
    async refreshToken( @Body() refreshTokenDto: Static<typeof RefreshTokenRequest> ) {
        try {
            const payload = await this.jwtService.verifyAsync( refreshTokenDto.refreshToken );
            
            const storedToken = await this.dataSource.manager.findOne( RefreshTokenEntity, { 
                where: { token: refreshTokenDto.refreshToken, deletedAt: IsNull() },
                relations: [ 'user' ]
            } );

            if ( !storedToken ) {
                throw new UnauthorizedException( { message: 'Invalid or expired refresh token' } );
            }

            const user = storedToken.user;
            if ( !user || user.status !== 'ACTIVE' ) {
                throw new UnauthorizedException( { message: 'User account is not active' } );
            }

            const tokenPair = await this.tokenService.generateTokenPair( {
                id: user.id,
                email: user.email,
                roles: [ user.role ]
            } );

            return {
                message: 'Token refreshed successfully',
                accessToken: tokenPair.accessToken,
                refreshToken: tokenPair.refreshToken
            };
        } catch ( error ) {
            throw new UnauthorizedException( { message: 'Invalid or expired refresh token' } );
        }
    }

    @Public()
    @Post( 'revoke-token' )
    @HttpCode( HttpStatus.OK )
    @ApiBody( { schema: RevokeTokenRequest } )
    @ApiOkResponse( { schema: RevokeTokenResponse } )
    async revokeToken( @Body() revokeTokenDto: Static<typeof RevokeTokenRequest> ) {
        try {
            await this.jwtService.verifyAsync( revokeTokenDto.refreshToken );
            
            const result = await this.dataSource.manager.softDelete( RefreshTokenEntity, { 
                token: revokeTokenDto.refreshToken,
                deletedAt: IsNull()
            } );

            if ( result.affected === 0 ) {
                throw new BadRequestException( { message: 'Token not found or already revoked' } );
            }

            return { message: 'Token revoked successfully' };
        } catch ( error ) {
            if ( error instanceof BadRequestException ) {
                throw error;
            }
            throw new UnauthorizedException( { message: 'Invalid refresh token' } );
        }
    }

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

    @Public()
    @Post( 'forgot-password' )
    @ApiBody( { schema: ForgotPasswordRequest } )
    @ApiOkResponse( { schema: ForgotPasswordResponse } )
    async forgotPassword( @Body() forgotPasswordDto: Static<typeof ForgotPasswordRequest> ) {
        const user = await this.dataSource.manager.findOne( UserEntity, { where: { email: forgotPasswordDto.email } } );
        if ( !user ) {
            // Return success even if user not found to prevent email enumeration
            return { message: 'If the email exists, a password reset OTP has been sent.' };
        }

        // Generate and store OTP for password reset
        const otp = this.otpService.generateOtp();
        await this.otpService.storePasswordResetOtp( forgotPasswordDto.email, otp );

        // Send OTP via email
        this.mailQueue.addToMailQueue( 'sendPasswordResetOTP', { 
            code: otp, 
            email: user.email, 
            userId: user.id 
        } );

        return { message: 'If the email exists, a password reset OTP has been sent.' };
    }

    @Public()
    @Post( 'forgot-password-reset' )
    @ApiBody( { schema: ForgotPasswordResetRequest } )
    @ApiOkResponse( { schema: ForgotPasswordResetResponse } )
    async forgotPasswordReset( @Body() forgotPasswordResetDto: Static<typeof ForgotPasswordResetRequest> ) {
        const user = await this.dataSource.manager.findOne( UserEntity, { where: { email: forgotPasswordResetDto.email } } );
        if ( !user ) {
            throw new BadRequestException( { message: 'Invalid request' } );
        }

        // Verify OTP
        const isValid = await this.otpService.verifyPasswordResetOtp( forgotPasswordResetDto.email, forgotPasswordResetDto.otp );
        if ( !isValid ) {
            throw new BadRequestException( { message: 'Invalid or expired OTP' } );
        }

        // Update password
        user.password = await bcrypt.hash( forgotPasswordResetDto.newPassword, 12 );
        await this.dataSource.manager.save( user );

        // Send password reset confirmation email
        this.mailQueue.addToMailQueue( 'sendPasswordChangeNotification', {
            email: user.email,
            firstName: user.firstName,
            userId: user.id
        } );

        return { message: 'Password has been reset successfully.' };
    }

    @Post( 'reset-password' )
    @ApiBody( { schema: ResetPasswordRequest } )
    @ApiOkResponse( { schema: ResetPasswordResponse } )
    async resetPassword( 
        @Body() resetPasswordDto: Static<typeof ResetPasswordRequest>,
        @AuthenticatedUser() currentUser: any
    ) {
        const user = await this.dataSource.manager.findOne( UserEntity, { where: { id: currentUser.id } } );
        if ( !user ) {
            throw new BadRequestException( { message: 'User not found' } );
        }

        // Verify old password
        const isOldPasswordValid = await bcrypt.compare( resetPasswordDto.oldPassword, user.password );
        if ( !isOldPasswordValid ) {
            throw new BadRequestException( { message: 'Current password is incorrect' } );
        }

        // Update to new password
        user.password = await bcrypt.hash( resetPasswordDto.newPassword, 12 );
        await this.dataSource.manager.save( user );

        // Send password change notification email
        this.mailQueue.addToMailQueue( 'sendPasswordChangeNotification', {
            email: user.email,
            firstName: user.firstName,
            userId: user.id
        } );

        return { message: 'Password has been changed successfully.' };
    }
}
