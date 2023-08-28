import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator"


export class EditAddressDTO{
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    streetAddress : string
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    city   : string     
    @IsOptional()
    @IsNotEmpty()
    @IsString()             
    state  : string     
    @IsOptional()
    @IsNotEmpty()
    @IsString()             
    country   : string  
    @IsOptional()
    @IsNotEmpty()
    @IsBoolean()             
    isDefaultShippingAddress : boolean
}