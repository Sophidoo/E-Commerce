import { Exclude, Expose } from "class-transformer"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"


@Exclude()
export class AddressResponseDTO{
    @Expose()
    id: number
    @Expose()
    streetAddress : string
    @Expose()
    city   : string    
    @Expose()            
    state  : string     
    @Expose()          
    country   : string  
    @Expose()           
    isDefaultShippingAddress : boolean
}