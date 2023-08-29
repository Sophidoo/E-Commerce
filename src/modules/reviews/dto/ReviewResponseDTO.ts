import { Exclude, Expose } from "class-transformer"


@Exclude()
export class ReviewResponseDTO {
    @Expose()
    id: number
    @Expose()
    rating:    number
    @Expose()
    feedback  : string
    @Expose()
    user: {
        username: string
    }

    constructor(partial : Partial<ReviewResponseDTO>){
        Object.assign(this, partial)
    }
}