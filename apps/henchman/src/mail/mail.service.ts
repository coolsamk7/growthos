import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { warn } from 'console';
import * as nodemailer  from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: Transporter;
    private readonly from: string;

    constructor( private readonly configService: ConfigService ) {
        const mailConfig: any = this.configService.get( 'mail' );
        this.from = mailConfig.from;
        this.transporter = nodemailer.createTransport( {
            host: mailConfig.smtp.host,
            port: mailConfig.smtp.port,
            secure: mailConfig.smtp.secure,
            auth: mailConfig.smtp.auth.user ? {
                user: mailConfig.smtp.auth.user,
                pass: mailConfig.smtp.auth.pass,
            } : undefined,
        } );
    }

    async sendWelcomeEmail( email: string, firstName: string ) {
        const subject = 'Welcome to Growthos!';
        const text = `Hello ${ firstName }, welcome to Growthos! We're excited to have you on board.`;
        const html = this.getWelcomeEmailTemplate( firstName );
        await this.transporter.sendMail( {
            from: this.from,
            to: email,
            subject,
            text,
            html,
        } );
    }

    async sendOtpEmail( email: string, code: string ) {
        const subject = 'Your verification code';
        const text = `Your verification code is ${ code }. It expires in 10 minutes.`;
        const html = this.getOtpEmailTemplate( code );
        console.log( text )
        await this.transporter.sendMail( {
            from: this.from,
            to: email,
            subject,
            text,
            html,
        } );
    }

    private getEmailBaseTemplate( content: string ): string {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Growthos</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="padding: 40px 30px; text-align: center; background-color: #4F46E5;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Growthos</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 30px;">
                            ${ content }
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px; text-align: center; background-color: #f9f9f9; border-top: 1px solid #e0e0e0;">
                            <p style="margin: 0; color: #666666; font-size: 14px;">&copy; 2026 Growthos. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `;
    }

    private getWelcomeEmailTemplate( firstName: string ): string {
        const content = `
            <h2 style="color: #333333; margin-top: 0;">Welcome to Growthos, ${ firstName }! 🎉</h2>
            <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                We're thrilled to have you join our community. Get ready to experience growth like never before!
            </p>
            <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                Here are a few things you can do to get started:
            </p>
            <ul style="color: #666666; font-size: 16px; line-height: 1.8;">
                <li>Complete your profile</li>
                <li>Explore our features</li>
                <li>Connect with the community</li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="display: inline-block; padding: 12px 30px; background-color: #4F46E5; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px;">Get Started</a>
            </div>
            <p style="color: #666666; font-size: 14px; line-height: 1.6;">
                If you have any questions, feel free to reach out to our support team.
            </p>
        `;
        return this.getEmailBaseTemplate( content );
    }

    private getOtpEmailTemplate( code: string ): string {
        const content = `
            <h2 style="color: #333333; margin-top: 0;">Your Verification Code</h2>
            <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                Use the following code to verify your account:
            </p>
            <div style="text-align: center; margin: 30px 0;">
                <div style="display: inline-block; padding: 20px 40px; background-color: #f0f0f0; border-radius: 8px; border: 2px dashed #4F46E5;">
                    <span style="font-size: 32px; font-weight: bold; color: #4F46E5; letter-spacing: 8px;">${ code }</span>
                </div>
            </div>
            <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                This code will expire in <strong>10 minutes</strong>.
            </p>
            <p style="color: #999999; font-size: 14px; line-height: 1.6; margin-top: 30px;">
                If you didn't request this code, please ignore this email.
            </p>
        `;
        return this.getEmailBaseTemplate( content );
    }
}
