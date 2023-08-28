import { Module } from '@nestjs/common';
import { CloudinaryService } from '../../config/cloudinary.service';
import { CloudinaryProvider } from './cloudinary';

@Module({
  providers: [CloudinaryService, CloudinaryProvider],
})
export class CloudinaryModule {}
