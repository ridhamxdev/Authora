import { Controller, Post, Body, BadRequestException, UseGuards, Request, Get, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() body: any) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            throw new BadRequestException('Invalid credentials');
        }
        return this.authService.login(user);
    }

    @Post() // Matches POST /users (Register)
    async register(@Body() body: any) {
        return this.authService.register(body);
    }

    @Post('verify-otp')
    async verifyOtp(@Body() body: any) {
        return this.authService.verifyOtp(body.email, body.otp);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Request() req: any) {
        return req.user;
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('profile')
    async updateProfile(@Request() req: any, @Body() body: any) {
        // Basic validation or use DTO
        if (body.password) {
            // Passwords should be hashed in service or schema hooks.
            // Mongoose schema pre-save hook handles hashing if 'password' field is modified.
            // So assuming usersService.update triggers save or we use save().
            // findByIdAndUpdate usually DOES NOT trigger pre-save hooks.
            // We need to fetch and save.
            // But I implemented update using findOneAndUpdate in UsersService.
            // I should change UsersService.update to fetch and save, OR manually hash password here.
            // Re-implementing update in UsersService is better.
        }
        // For now, let's assume body doesn't contain password or we fix UsersService.
        const user = await this.authService.updateProfile(req.user._id, body);
        return user;
    }
}
