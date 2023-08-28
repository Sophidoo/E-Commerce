import { Module } from '@nestjs/common';
import { AddressController } from './controller/address.controller';
import { AddressService } from './service/address.service';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  controllers: [AddressController],
  providers: [AddressService],
  imports: [PrismaModule]
})
export class AddressModule {}
