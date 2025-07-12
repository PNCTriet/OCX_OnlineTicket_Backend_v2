import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto, UpdateOrganizationDto, OrganizationResponseDto } from './dto/organization.dto';
export declare class OrganizationsController {
    private readonly organizationsService;
    constructor(organizationsService: OrganizationsService);
    findAll(): Promise<OrganizationResponseDto[]>;
    count(): Promise<{
        count: number;
    }>;
    findOne(id: string): Promise<OrganizationResponseDto>;
    create(createOrganizationDto: CreateOrganizationDto): Promise<OrganizationResponseDto>;
    update(id: string, updateOrganizationDto: UpdateOrganizationDto): Promise<OrganizationResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
