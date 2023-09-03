/// <reference types="multer" />
export declare class CloudinaryService {
    constructor();
    uploadFile(file: Express.Multer.File): Promise<any>;
}
