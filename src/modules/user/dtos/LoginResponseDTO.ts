import {Exclude, Expose} from "class-transformer"
@Exclude()
export class LoginResponseDTO{
    @Expose()
    token : string
    @Expose()
    role : string

    constructor(partial : Partial<LoginResponseDTO>){
        Object.assign(this, partial)
    }
}