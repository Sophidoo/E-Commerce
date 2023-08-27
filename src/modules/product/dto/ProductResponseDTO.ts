import { $Enums } from '@prisma/client'
import {Exclude, Expose} from 'class-transformer'

// @Exclude()
export class ProductResponseDTO {

    @Expose()
    productName : string

    @Expose()
    productPrice : number

    @Expose()
    quantityAvailable: number

    @Expose()
    size: $Enums.Size

    @Expose()
    images : string[]

    @Expose()
    categoryName : string

    @Expose()
    description: string
    @Expose()
    brand : string
    @Expose()
    createdAt: Date
    @Expose()
    updatedAt: Date

    constructor(partial : Partial<ProductResponseDTO>){
        Object.assign(this, partial)
    }
}