import { Controller, Get, Param, Patch } from '@nestjs/common';
import { AdminService } from '../service/admin.service';
import { Roles } from 'src/decorator/roles.decorator';
import { RoleType } from '@prisma/client';
import { User } from 'src/decorator/user.decorator';

@Roles(RoleType.ADMIN)
@Controller('api/v1/admin')
export class AdminController {
    constructor(private readonly adminService : AdminService){}

    @Get()
    getAllUsers(){
        return this.adminService.getAllUsers()
    }

    @Patch('/block/:userId')
    blockUser(@Param('userId') userId : number){
        return this.adminService.blockUser(userId)
    }
    
    @Patch('/unblock/:userId')
    unblockUser(@Param('userId') userId : number){
        return this.adminService.unBlockUser(userId)
    }
}
