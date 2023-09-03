import { AdminService } from '../service/admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getAllUsers(): Promise<import("../../user/dtos/UserResponseDTO").UserResponseDTO[]>;
    blockUser(userId: number): Promise<import("../../user/dtos/UserResponseDTO").UserResponseDTO>;
    unblockUser(userId: number): Promise<import("../../user/dtos/UserResponseDTO").UserResponseDTO>;
}
