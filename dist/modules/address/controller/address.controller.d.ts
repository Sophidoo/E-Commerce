import { AddressService } from '../service/address.service';
import { AddressDTO } from '../dto/addressDTO';
export declare class AddressController {
    private readonly addressService;
    constructor(addressService: AddressService);
    addAddress(dto: AddressDTO, user: number): Promise<import("../dto/AddressResponseDTO").AddressResponseDTO>;
    editAddress(dto: AddressDTO, addressId: number): Promise<import("../dto/AddressResponseDTO").AddressResponseDTO>;
    getAllAddress(user: number): Promise<import("../dto/AddressResponseDTO").AddressResponseDTO[]>;
    getDefaultAddress(user: number): Promise<import("../dto/AddressResponseDTO").AddressResponseDTO>;
    deleteAddress(addressId: number): Promise<string>;
}
