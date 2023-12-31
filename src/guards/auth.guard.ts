import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from "jsonwebtoken";

import { Request } from 'express';
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "src/decorator/public.decorator";

@Injectable()
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
            throw new UnauthorizedException('Token not provided');
        }
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as JwtPayload;
            request.user = decoded.id;
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