import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private emailService: EmailService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        // Use bcrypt.compare to check password against hashed one
        // We already have matchPassword method on schema but accessing it requires casting to UserDocument
        if (user && (await bcrypt.compare(pass, user.password))) {
            // Return user without password
            const { password, ...result } = user.toObject();
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user._id, name: user.name };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                isVerified: user.isVerified,
            },
        };
    }

    async register(registerDto: any) {
        const { name, email, password } = registerDto;
        const existingUser = await this.usersService.findOneByEmail(email);
        if (existingUser) {
            throw new BadRequestException('User already exists');
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const newUser = await this.usersService.create({
            name,
            email,
            password,
            otp,
            otpExpires,
        });

        await this.emailService.sendOtp(email, otp);

        return {
            message: 'User registered successfully. Please verify OTP.',
            userId: newUser._id,
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
        if (user.otp !== otp) { // In real app, hash OTP or use proper TOTP
            throw new BadRequestException('Invalid OTP');
        }
        if (user.otpExpires < new Date()) {
            throw new BadRequestException('OTP expired');
        }

        await this.usersService.update(user._id.toString(), {
            isVerified: true,
            otp: null,
            otpExpires: null,
        });

        const payload = { email: user.email, sub: user._id, name: user.name };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id: user._id,
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
            user.name = updateData.name || user.name;
            user.email = updateData.email || user.email;
            user.password = updateData.password; // Hook hashes this
            return user.save();
        }
        return this.usersService.update(userId, updateData);
    }
}
