import { $Enums } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import {Exclude, Expose, Transform, Type} from 'class-transformer'


export class DecimalNumber extends Decimal {
    constructor(value = 0) { super(value); }
}
   
@Exclude()
export class ProductResponseDTO {
    @Expose()
    id: number

    @Expose()
    productName : string

    @Expose()
    @Type(() => DecimalNumber)
    productPrice : DecimalNumber

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