import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PrismaService } from 'src/database/prisma.service';
import { AuthService } from './auth.service';
declare const GoogleStrategyService_base: new (...args: any[]) => Strategy;
export declare class GoogleStrategyService extends GoogleStrategyService_base {
    private readonly prismaService;
    private readonly authService;
    constructor(prismaService: PrismaService, authService: AuthService);
    validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any>;
    googleLogin(req: any): Promise<"No user from google" | {
        message: string;
        user: any;
    }>;
}
export {};
