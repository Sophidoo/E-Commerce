import { GoogleStrategyService } from '../service/google-strategy.service';
export declare class GoogleStrategyController {
    private readonly googleStrategyService;
    constructor(googleStrategyService: GoogleStrategyService);
    googleAuth(): Promise<void>;
    googleAuthRedirect(req: any): Promise<"No user from google" | {
        message: string;
        user: any;
    }>;
}
