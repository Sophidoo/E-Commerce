import { Exclude, Expose } from "class-transformer"
import { ProductResponseDTO } from "./ProductResponseDTO"

@Exclude()
export class ProductImageResponseDTO{
    @Expose()
    id : number
    @Expose()
    imageUrl: string
    @Expose()
    defaultImage: boolean
    @Expose()
    product: ProductResponseDTO

    constructor(partial : Partial<ProductImageResponseDTO>){
        Object.assign(this, partial)
    }
}