import { Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { RoleService } from './role.service';
import {Post, Get, Body, Put, Delete, Param} from "@nestjs/common"
import { RoleDTO } from './dtos/CreateRoleDTO';
import { Role } from '@prisma/client';

@Controller('role')
export class RoleController {
    constructor(private readonly roleService : RoleService){}

    @Post("/create")
    createRole(@Body() dto : RoleDTO) : Promise<Role>{
        return this.roleService.createRole(dto)
    }

    @Put("/update/:id")
    updateRole(@Param('id') id : number , @Body() dto: RoleDTO) : Promise<Role>{
        return this.roleService.editRole(id, dto)
    }

    @Get()
    getAllRoles() : Promise<Role[]>{
        return this.roleService.getAllRoles()
    }

    @Delete("/delete/:id")
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteRole(@Param('id') id : number) : Promise<string>{
        return this.roleService.deleteRole(id)
    }
    
}
