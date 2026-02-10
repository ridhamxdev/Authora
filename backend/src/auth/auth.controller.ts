import { Controller, Post, Body, BadRequestException, UseGuards, Request, Get, Put, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';

@Controller('users')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() body: any, @Res({ passthrough: true }) res: Response) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            throw new BadRequestException('Invalid credentials');
        }
        const result = await this.authService.login(user);

        // Set HTTP-only cookie for additional security
        res.cookie('Authentication', result.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // Return both access_token and user for frontend state management
        return result;
    }

    @Post() // Matches POST /users (Register)
    async register(@Body() body: any) {
        return this.authService.register(body);
    }

    @Post('verify-otp')
    async verifyOtp(@Body() body: any, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.verifyOtp(body.email, body.otp);

        // Set HTTP-only cookie for additional security
        res.cookie('Authentication', result.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // Return both access_token and user for frontend state management
        return result;
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('Authentication');
        return { message: 'Logged out successfully' };
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Request() req: any) {
        return req.user;
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('profile')
    async updateProfile(@Request() req: any, @Body() body: any) {
        const user = await this.authService.updateProfile(req.user._id, body);
        return user;
    }
}
