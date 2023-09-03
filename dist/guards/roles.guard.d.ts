import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "src/database/prisma.service";
export declare class RolesGuard implements CanActivate {
    private readonly reflector;
    private readonly prismaService;
    constructor(reflector: Reflector, prismaService: PrismaService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
