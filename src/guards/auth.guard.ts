import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import jwt, { JwtPayload } from 'jsonwebtoken';

import { Request } from 'express';
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "src/decorator/public.decorator";


export class AuthGuard implements CanActivate{

    constructor (private reflector : Reflector){}

    async canActivate(context : ExecutionContext) : Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        if(isPublic){
            return true
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request)
        if(!token){
            throw new UnauthorizedException();
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as JwtPayload;
            request.user = decoded;
        } catch (error) {
            throw new UnauthorizedException();
        }

        return true
    }

    private extractTokenFromHeader(request: Request ): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    
}