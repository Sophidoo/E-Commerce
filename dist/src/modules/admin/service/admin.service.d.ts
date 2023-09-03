import { PrismaService } from 'src/database/prisma.service';
import { UserResponseDTO } from 'src/modules/user/dtos/UserResponseDTO';
export declare class AdminService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    getAllUsers(): Promise<UserResponseDTO[]>;
    blockUser(userId: number): Promise<UserResponseDTO>;
    unBlockUser(userId: number): Promise<UserResponseDTO>;
}
