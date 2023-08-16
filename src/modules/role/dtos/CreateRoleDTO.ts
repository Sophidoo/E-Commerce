import { IsNotEmpty, IsString } from "class-validator";


export class RoleDTO {
    @IsNotEmpty()
    @IsString()
    roleName : string;
}