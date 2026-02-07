import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
    private transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: this.configService.get<string>('EMAIL_USER'),
                pass: this.configService.get<string>('EMAIL_PASS'),
            },
        });
    }

    async sendOtp(email: string, otp: string) {
        const mailOptions = {
            from: this.configService.get<string>('EMAIL_USER'),
            to: email,
            subject: 'Your OTP Code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
                    <div style="background-color: #000; padding: 20px; text-align: center;">
                        <h1 style="color: #fff; margin: 0; letter-spacing: 2px;">AUTHORA<span style="color: #888;">.</span></h1>
                    </div>
                    <div style="background-color: #fff; padding: 40px; text-align: center; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                        <h2 style="color: #333; margin-top: 0;">Verification Required</h2>
                        <p style="color: #666; font-size: 16px; line-height: 1.5;">
                            Please use the following One Time Password (OTP) to verify your account. 
                            This code is valid for 10 minutes.
                        </p>
                        <div style="margin: 30px 0;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000; padding: 10px 20px; border: 2px solid #eee; display: inline-block;">
                                ${otp}
                            </span>
                        </div>
                        <p style="color: #999; font-size: 14px;">
                            If you did not request this code, please ignore this email.
                        </p>
                    </div>
                    <div style="text-align: center; padding: 20px; color: #aaa; font-size: 12px;">
                        &copy; ${new Date().getFullYear()} Authora Inc. All rights reserved.
                    </div>
                </div>
            `,
        };
        return this.transporter.sendMail(mailOptions);
    }
}
