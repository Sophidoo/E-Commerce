import { ExecutionContext, createParamDecorator } from "@nestjs/common";


export const User = createParamDecorator((data, context: ExecutionContext) : number => {
    const request = context.switchToHttp().getRequest()
    return request.user;
})