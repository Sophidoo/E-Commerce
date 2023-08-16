import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { RoleDTO } from './dtos/CreateRoleDTO';
import { Role } from '@prisma/client';

@Injectable()
export class RoleService {
    constructor(private readonly prismaService : PrismaService){}

    async createRole(dto : RoleDTO) : Promise<Role> {
        const exists = await this.prismaService.role.findUnique({
            where:{
                roleName: dto.roleName
            }
        })

        if(exists){
            throw new ConflictException("Role already exists")
        }

        return await this.prismaService.role.create({
            data: {
                roleName: dto.roleName
            }
        })

    }

    async editRole(id : number, dto : RoleDTO) : Promise<Role>{
        const exists = await this.prismaService.role.findUnique({
            where: {
                id : id
            }
        })

        if(!exists){
            throw new NotFoundException("Role with id " + id + " does not exists")
        }

        return await this.prismaService.role.update({
            where: {
                id
            },
            data: {
                ...dto
            }
        })
    }

    async deleteRole(id : number, dto : RoleDTO) : Promise<Role>{
        const exists = await this.prismaService.role.findUnique({
            where: {
                id : id
            }
        })

        if(!exists){
            throw new NotFoundException("Role with id " + id + " does not exists")
        }

        return await this.prismaService.role.delete({
            where: {
                id
            }
        })
    }

    async getAllRoles() : Promise<Role[]>{
        return await this.prismaService.role.findMany()
    }

    async findByRoleName(roleName : string) : Promise<Role>{
        const exists = await this.prismaService.role.findUnique({
            where: {
                roleName : roleName
            }
        })

        if(!exists){
            throw new NotFoundException("Role with name " + roleName + " does not exists")
        }

        return exists
    }
    
}
