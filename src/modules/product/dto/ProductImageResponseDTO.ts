import { Exclude, Expose } from "class-transformer"
import { ProductResponseDTO } from "./ProductResponseDTO"

@Exclude()
export class ProductImageResponseDTO{
    @Expose()
    imageUrl: string
    @Expose()
    defaultImage: boolean
    @Expose()
    product: ProductResponseDTO
}