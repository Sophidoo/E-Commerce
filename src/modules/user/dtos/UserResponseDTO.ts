import { Exclude , Expose} from "class-transformer"

@Exclude()
export class UserResponseDTO {
    @Expose()
    id: number

    @Expose()
    firstname: string
    @Expose()
    lastname: string
    @Expose()
    username: string
    @Expose()
    phoneNumber: string
    @Expose()
    dateOfBirth: Date
    @Expose()
    image: string
    @Expose()
    gender: string
    @Expose()
    email: string
    @Expose()
    role: string

    constructor(partial : Partial<UserResponseDTO>){
        Object.assign(this, partial)
    }
}