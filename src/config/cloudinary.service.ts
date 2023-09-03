import { Injectable } from '@nestjs/common';
import { rejects } from 'assert';
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { Express } from 'express';
import { resolve } from 'path';
import {toStream} from 'buffer-to-stream'


@Injectable()
export class CloudinaryService {
    constructor(){
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }


    async uploadFile(file: Express.Multer.File): Promise<any> {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'E-commerce', // Set your desired folder
        });
        return result;
    }
}

