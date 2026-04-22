import { Controller, Post, Body, HttpStatus, HttpCode, BadRequestException, InternalServerErrorException, UnauthorizedException, UseGuards } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/guards/public.guard';
import { SignupRequest, SignupResponse, VerifyOtpRequest, VerifyOtpResponse, ResendOtpRequest, ResendOtpResponse, ForgotPasswordRequest, ForgotPasswordResponse, ForgotPasswordResetRequest, ForgotPasswordResetResponse, ResetPasswordRequest, ResetPasswordResponse, LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse, RevokeTokenRequest, RevokeTokenResponse } from '../../dtos'
import type { Static } from 'typebox';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, IsNull } from 'typeorm';
import { UserEntity, RefreshTokenEntity } from '@growthos/nestjs-database/entities';
import {  OtpService, QueueProducerService, TokenService } from 'src/services';
import { MailQueueProducerService } from 'src/modules/queue/mail-queue-producer.service';
import { AuthenticatedUser } from 'src/decorators';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { UserStatus } from '@growthos/nestjs-shared';
import { ulid } from 'ulid'
import { session } from 'passport';

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
            if ( user.status === 'PENDING' ) {
                throw new UnauthorizedException( { message: 'Please verify your email first. Check your inbox for the OTP.' } );
            }
            throw new UnauthorizedException( { message: 'Your account has been deactivated. Please contact support.' } );
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
        const existingUser = await this.dataSource.manager.findOne( UserEntity, { where: { email: signupDto.email } } );
        const sessionId = ulid();
        if ( existingUser ) {
            // If user exists and is already verified, throw error
            if ( existingUser.status === UserStatus.ACTIVE ) {
                throw new BadRequestException( { message: `User with email ${signupDto.email} already exists` } );
            }
            
            // If user was deactivated by admin, don't allow re-signup
            if ( existingUser.status === UserStatus.INACTIVE ) {
                throw new BadRequestException( { message: 'Your account has been deactivated. Please contact support.' } );
            }
            
            // User exists but is PENDING (not verified) - update their info and resend OTP
            existingUser.password = await bcrypt.hash( signupDto.password, 12 );
            existingUser.firstName = signupDto.firstName;
            existingUser.lastName = signupDto.lastName;
            await this.dataSource.manager.save( existingUser );
            
            // Generate and store new OTP
            const otp = this.otpService.generateOtp();
            await this.otpService.storeOtp( sessionId, otp );

            
            this.mailQueue.addToMailQueue( 'sendOTP', { code: otp, email: existingUser.email, userId: existingUser.id } );
            
            return {
                message: 'Verification email resent. Please verify your email with the OTP sent.',
                data: {
                    email: existingUser.email,
                    sessionId
                }
            };
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
        await this.otpService.storeOtp( sessionId, otp );
        this.mailQueue.addToMailQueue( 'sendOTP', { code: otp, email: savedUser.email, userId: savedUser.id } ) 

        return {
            message: 'User created successfully. Please verify your email with the OTP sent.',
            data: {
                email: savedUser.email,
                sessionId
            }
        };
    }

    @Public()
    @Post( 'verify-otp' )
    @ApiBody( { schema: VerifyOtpRequest } )
    @ApiOkResponse( { schema: VerifyOtpResponse } )
    async verifyOtp( @Body() verifyOtpDto: Static<typeof VerifyOtpRequest> ) {
        const user = await this.dataSource.manager.findOne( UserEntity, { where: { email: verifyOtpDto.email } } );
        if ( !user ) {
            throw new BadRequestException( { message: 'User not found' } );
        }

        const isValid = await this.otpService.verifyOtp( verifyOtpDto.sessionId, verifyOtpDto.otp );
        if ( !isValid ) {
            throw new BadRequestException( { message: 'Invalid or expired OTP' } );
        }

        // Update user status to active
        user.status = UserStatus.ACTIVE;
        await this.dataSource.manager.save( user );

        return { message: 'Email verified successfully. Welcome email sent!' };
    }

    @Public()
    @Post( 'resend-otp' )
    @ApiBody( { schema: ResendOtpRequest } )
    @ApiOkResponse( { schema: ResendOtpResponse } )
    async resendOtp( @Body() resendOtpDto: Static<typeof ResendOtpRequest> ) {
        const user = await this.dataSource.manager.findOne( UserEntity, { where: { id: resendOtpDto.email } } );
        if ( !user ) {
            throw new BadRequestException( { message: 'User not found' } );
        }

        if ( user.status === UserStatus.ACTIVE ) {
            throw new BadRequestException( { message: 'User is already verified' } );
        }

        if ( user.status === UserStatus.INACTIVE ) {
            throw new BadRequestException( { message: 'Your account has been deactivated. Please contact support.' } );
        }

        // Generate and store new OTP
        const sessionId = ulid()
        const otp = this.otpService.generateOtp();
        await this.otpService.storeOtp( sessionId, otp );

        this.mailQueue.addToMailQueue( 'sendOTP', { code: otp, email: user.email, userId: user.id } );

        return { message: 'OTP resent successfully. Please check your email.', data: {
            email: user.email,
            sessionId
        } };
    }

    @Public()
    @Post( 'forgot-password' )
    @ApiBody( { schema: ForgotPasswordRequest } )
    @ApiOkResponse( { schema: ForgotPasswordResponse } )
    async forgotPassword( @Body() forgotPasswordDto: Static<typeof ForgotPasswordRequest> ) {
        const user = await this.dataSource.manager.findOne( UserEntity, { where: { email: forgotPasswordDto.email } } );
        if ( !user ) {
            throw new BadRequestException( { message: 'No account found with this email address' } );
        }

        // Generate and store OTP for password reset
        const sessionId = ulid()
        const otp = this.otpService.generateOtp();
        await this.otpService.storePasswordResetOtp( sessionId, otp );

        // Send OTP via email
        this.mailQueue.addToMailQueue( 'sendPasswordResetOTP', { 
            code: otp, 
            email: user.email, 
            userId: user.id 
        } );

        return { message: 'Verification code sent successfully', data: { sessionId: sessionId, email: user.email } };
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
        const isValid = await this.otpService.verifyPasswordResetOtp( forgotPasswordResetDto.sessionId, forgotPasswordResetDto.otp );
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
