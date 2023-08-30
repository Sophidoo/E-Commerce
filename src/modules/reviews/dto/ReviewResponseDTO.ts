import { Decimal } from "@prisma/client/runtime/library";
import { Exclude, Expose, Type } from "class-transformer"

export class DecimalNumber extends Decimal {
    constructor(value = 0) { super(value); }
}
   

@Exclude()
export class ReviewResponseDTO {
    @Expose()
    id: number
    @Expose()
    @Type(() => DecimalNumber)
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