import { Exclude, Expose } from "class-transformer";


@Exclude()
export class CategoryResponseDTO{
    @Expose()
    id : number

    @Expose()
    categoryName: string

    constructor(partial : Partial<CategoryResponseDTO>){
        Object.assign(this, partial)
    }
}