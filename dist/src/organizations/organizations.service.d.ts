import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateOrganizationDto, UpdateOrganizationDto, OrganizationResponseDto } from './dto/organization.dto';
export declare class OrganizationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<OrganizationResponseDto[]>;
    count(): Promise<number>;
    findOne(id: number): Promise<OrganizationResponseDto>;
    create(createOrganizationDto: CreateOrganizationDto): Promise<OrganizationResponseDto>;
    update(id: number, updateOrganizationDto: UpdateOrganizationDto): Promise<OrganizationResponseDto>;
    remove(id: number): Promise<void>;
}
