import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { $Enums, RoleType } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";
import { ROLES_KEY } from "src/decorator/roles.decorator";
import { JwtPayload } from "jsonwebtoken";


@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private readonly reflector : Reflector, private readonly prismaService : PrismaService){}

    async canActivate(context: ExecutionContext) : Promise<boolean>{
        // console.log(RoleType)
        const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ])
        if(!requiredRoles){
            return true
        }
        // return true
        
        const {user} = await context.switchToHttp().getRequest();
        const findUser = await this.prismaService.user.findUnique({
            where: {
                id: user
            }
        })
        if(!findUser){
            throw new UnauthorizedException('Token Invalid or Expired')
        }

        return requiredRoles.includes(findUser.role)
    }
}