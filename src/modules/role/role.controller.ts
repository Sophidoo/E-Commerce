import { Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { RoleService } from './role.service';
import {Post, Get, Body, Put, Delete, Param} from "@nestjs/common"
import { RoleDTO } from './dtos/CreateRoleDTO';

@Controller('role')
export class RoleController {
    constructor(private readonly roleService : RoleService){}

    @Post("/create")
    createRole(@Body() dto : RoleDTO){
        return this.roleService.createRole(dto)
    }

    @Put("/update/:id")
    updateRole(@Param() id : number , @Body() dto: RoleDTO){
        return this.updateRole(id, dto)
    }

    @Get()
    getAllRles(){
        return this.getAllRles()
    }

    @Delete("/delete/:id")
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteRole(@Param() id : number){
        return this.deleteRole(id)
    }
    
}
