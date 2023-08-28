import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { AddressDTO } from '../dto/addressDTO';
import { Address } from '@prisma/client';
import { EditAddressDTO } from '../dto/EditAddressDTO';
import { AddressResponseDTO } from '../dto/AddressResponseDTO';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AddressService {
    constructor(private readonly prismaService : PrismaService){}

    async addAddress(id: number, dto: AddressDTO): Promise<AddressResponseDTO>{
        if(dto.isDefaultShippingAddress){
            const previousDefaultAddress = await this.prismaService.address.findFirst({
                where: {
                    isDefaultShippingAddress: true
                }
            })
    
            await this.prismaService.address.update({
                where: {
                    id: previousDefaultAddress.id
                },
                data: {
                    isDefaultShippingAddress: false
                }
            })
        }

        const address = await this.prismaService.address.create({
            data: {
                streetAddress: dto.streetAddress,
                city: dto.city,
                state: dto.state,
                country: dto.country,
                isDefaultShippingAddress: dto.isDefaultShippingAddress,
                userId: id
            }
        })

        return plainToInstance(AddressResponseDTO, address)
    }

    async editAddress(addressId : number, dto: EditAddressDTO) : Promise<AddressResponseDTO> {
        const address = await this.prismaService.address.update({
            where: {
                id: addressId
            },
            data: {
                ...dto
            }
        })

        return plainToInstance(AddressResponseDTO, address)
    }

    async getAllUserAddresses(id : number) : Promise<AddressResponseDTO[]>{
        const address = await this.prismaService.address.findMany({
            where: {
                userId : id
            },
            select: {
                streetAddress: true,
                city: true,
                state: true,
                country: true,
                isDefaultShippingAddress: true
            }
        })

        return address.map((address) => plainToInstance(AddressResponseDTO, address))
    }

    async getDefaultAddress (id : number) : Promise<AddressResponseDTO | string>{
        const address = await this.prismaService.address.findFirst({
            where: {
                AND: {
                    userId: id,
                    isDefaultShippingAddress: true
                }
            },
            select: {
                streetAddress: true,
                city: true,
                state: true,
                country: true,
                isDefaultShippingAddress: true
            }
        })

        if(!address){
            return "User have no default address"
        }

        return plainToInstance(AddressResponseDTO, address)
    }


    async deleteAddress(addressId: number): Promise<string>{
        const address = await this.prismaService.address.findUnique({
            where: {
                id: addressId
            }
        })

        if(!address){
            throw new NotFoundException('Address not found')
        }

        await this.prismaService.address.delete({
            where: {
                id: addressId
            }
        })

        return "Address deleted successfully"
    }
}
