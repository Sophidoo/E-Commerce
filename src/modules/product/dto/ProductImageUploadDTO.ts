import { IsNotEmpty } from "class-validator";

export class ProductImageUploadDTO{
    @IsNotEmpty()
    defaultImage: boolean
}