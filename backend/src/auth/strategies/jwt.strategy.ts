import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                // First try Authorization header (Bearer token)
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                // Then try cookie
                (request: Request) => {
                    return request?.cookies?.Authentication;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'defaultSecret',
        });
    }

    async validate(payload: any) {
        console.log('JWT Payload:', payload);
        // Return userId to match what controllers expect
        return {
            userId: payload.sub,
            _id: payload.sub,
            email: payload.email,
            name: payload.name
        };
    }
}
