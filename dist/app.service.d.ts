import { OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
export declare class AppService implements OnApplicationBootstrap {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    onApplicationBootstrap(): Promise<void>;
    hashPassword(password: string): Promise<string>;
}
