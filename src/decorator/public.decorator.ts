import { SetMetadata, createParamDecorator } from "@nestjs/common";


export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);