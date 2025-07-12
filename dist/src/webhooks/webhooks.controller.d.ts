import { WebhooksService } from './webhooks.service';
export declare class WebhooksController {
    private readonly webhooksService;
    constructor(webhooksService: WebhooksService);
    handleVNPayWebhook(payload: any, headers: any): Promise<{
        success: boolean;
        message: string;
    }>;
    handleMomoWebhook(payload: any, headers: any): Promise<{
        success: boolean;
        message: string;
    }>;
    handleZaloPayWebhook(payload: any, headers: any): Promise<{
        success: boolean;
        message: string;
    }>;
    handleGenericWebhook(payload: any, headers: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
