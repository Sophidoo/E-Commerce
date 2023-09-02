import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { AddressService } from '../service/address.service';
import { AddressDTO } from '../dto/addressDTO';
import { User } from 'src/decorator/user.decorator';
import { use } from 'passport';
import { Roles } from 'src/decorator/roles.decorator';
import { RoleType } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';


@ApiTags("Address")
@Controller('api/v1/address')
export class AddressController {
    constructor(private readonly addressService : AddressService){}

    @Roles(RoleType.ADMIN, RoleType.USER)
    @Post('/add')
    addAddress(@Body() dto: AddressDTO, @User() user:number){
        return this.addressService.addAddress(user, dto)
    }
    
    @Roles(RoleType.ADMIN, RoleType.USER)
    @Patch('/edit/:addressId')
    editAddress(@Body() dto: AddressDTO, @Param('addressId')  addressId : number){
        return this.addressService.editAddress(addressId, dto)
    }

    @Roles(RoleType.ADMIN, RoleType.USER)
    @Get()
    getAllAddress(@User() user: number){
        return this.addressService.getAllUserAddresses(user)
    }

    @Roles(RoleType.ADMIN, RoleType.USER)
    @Get('/default')
    getDefaultAddress(@User() user: number){
        return this.addressService.getDefaultAddress(user)
    }

    @Roles(RoleType.ADMIN, RoleType.USER)
    @Delete('/:addressId')
    deleteAddress(@Param('addressId') addressId: number){
        return this.addressService.deleteAddress(addressId)
    }
}
