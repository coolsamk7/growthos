import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';

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
        const text = `Hello ${ firstName }, welcome to Growthos!`;
        const html = `<p>Hello <strong>${ firstName }</strong>, welcome to Growthos!</p>`;

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
        const html = `<p>Your verification code is <strong>${ code }</strong>.</p><p>It expires in 10 minutes.</p>`;

        await this.transporter.sendMail( {
            from: this.from,
            to: email,
            subject,
            text,
            html,
        } );
    }
}
