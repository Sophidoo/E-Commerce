import { PrismaService } from 'src/database/prisma.service';
import { AddressDTO } from '../dto/addressDTO';
import { EditAddressDTO } from '../dto/EditAddressDTO';
import { AddressResponseDTO } from '../dto/AddressResponseDTO';
export declare class AddressService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    addAddress(id: number, dto: AddressDTO): Promise<AddressResponseDTO>;
    editAddress(addressId: number, dto: EditAddressDTO): Promise<AddressResponseDTO>;
    getAllUserAddresses(id: number): Promise<AddressResponseDTO[]>;
    getDefaultAddress(id: number): Promise<AddressResponseDTO>;
    deleteAddress(addressId: number): Promise<string>;
}
