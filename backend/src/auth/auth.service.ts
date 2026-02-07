import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private emailService: EmailService
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (user && await bcrypt.compare(pass, user.password)) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, name: user.name };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id: user.id, // Keep _id for frontend compatibility or migrate frontend to use id
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                isVerified: user.isVerified,
            },
        };
    }

    async register(registrationData: any) {
        const { name, email, password } = registrationData;

        const existingUser = await this.usersService.findOneByEmail(email);
        if (existingUser) {
            throw new BadRequestException('User already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        const newUser = await this.usersService.create({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpires,
        });

        try {
            await this.emailService.sendOtp(email, otp);
        } catch (error) {
            console.error('Failed to send email:', error);
            // Don't fail registration if email fails (for dev purposes or invalid creds)
        }

        return {
            message: 'User registered successfully. Please verify OTP.',
            userId: newUser.id,
        };
    }

    async verifyOtp(email: string, otp: string) {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        if (user.isVerified) {
            throw new BadRequestException('User already verified');
        }
        if (user.otp !== otp) {
            throw new BadRequestException('Invalid OTP');
        }
        if (user.otpExpires && user.otpExpires < new Date()) {
            throw new BadRequestException('OTP expired');
        }

        await this.usersService.update(user.id, {
            isVerified: true,
            otp: null,
            otpExpires: null, // Prisma handles nullable fields
        });

        const payload = { email: user.email, sub: user.id, name: user.name };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id: user.id,
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                isVerified: true,
            },
        };
    }

    async updateProfile(userId: string, updateData: any) {
        if (updateData.password) {
            const user = await this.usersService.findById(userId);
            if (!user) {
                throw new BadRequestException('User not found');
            }

            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }
        return this.usersService.update(userId, updateData);
    }
}
