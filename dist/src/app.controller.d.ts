import { PrismaService } from '@/common/prisma/prisma.service';
export declare class AppController {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        totalUsers: number;
        totalEvents: number;
        totalTickets: number;
        totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
        recentOrders: {
            id: number;
            status: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            createdAt: Date;
            user: {
                email: string;
                name: string;
            };
            items: {
                ticketName: string;
                quantity: number;
                price: import("@prisma/client/runtime/library").Decimal;
            }[];
        }[];
    }>;
    getHealth(): {
        status: string;
        timestamp: string;
    };
}
