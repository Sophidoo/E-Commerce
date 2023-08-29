import { Exclude, Expose } from "class-transformer";


@Exclude()
export class CategoryResponseDTO{
    @Expose()
    id : number

    @Expose()
    categoryName: string
}