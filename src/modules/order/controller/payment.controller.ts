import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PaymentService } from '../service/payment.service';
import { Public } from 'src/decorator/public.decorator';
import { Decimal } from '@prisma/client/runtime/library';
import { Metadata } from '../dto/MetaData';
import { PaymentDTO } from '../dto/PaymentDTO';
import { User } from 'src/decorator/user.decorator';

@Controller('payment')
export class PaymentController {
    constructor (private readonly paymentService : PaymentService){}

    @Post('/:email/:amount')
    initiailizePayment(@Param('email') email : string, @Param('amount') amount: number, @Body() metadata: Metadata,  @Query('coupon') coupon?: string){
        return this.paymentService.initializePayment(email, amount, metadata,  coupon)
    }

    @Get('/:reference')
    verifyTransaction(@Param('reference') reference : string){
        return this.paymentService.verifyTransaction(reference)
    }

    @Post('/savePayment')
    createPayment(@Body() dto : PaymentDTO, @User() user : number){
        return this.paymentService.createPayment(dto, user)
    }
    
}
