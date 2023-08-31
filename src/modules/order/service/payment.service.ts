import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import * as https from "https"

@Injectable()
export class PaymentService {
    async initializePayment(email: string, amount: Decimal){
        const params = JSON.stringify({
            "email": email,
            "amount": amount,
            "currency": 'NGN'
          })
        const options = {
            hostname: 'api.paystack.co',
            port: 443,
            path: '/transaction/initialize',
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
              'Content-Type': 'application/json'
            }
          }

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = '';
        
                res.on('data', (chunk) => {
                    data += chunk;
                });
        
                res.on('end', () => {
                    const responseData = JSON.parse(data);
                    resolve(responseData);
                });
            }).on('error', (error) => {
                reject(error);
            });
      
            req.write(params);
            req.end();
        });   
    }
}
