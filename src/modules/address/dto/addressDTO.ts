import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator"


export class AddressDTO{
    @IsNotEmpty()
    @IsString()
    streetAddress : string
    @IsNotEmpty()
    @IsString()
    city   : string     
    @IsNotEmpty()
    @IsString()             
    state  : string     
    @IsNotEmpty()
    @IsString()             
    country   : string  
    @IsOptional()
    @IsNotEmpty()
    @IsBoolean()      
    isDefaultShippingAddress : boolean
}