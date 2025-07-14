import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateOrganizationDto, UpdateOrganizationDto, OrganizationResponseDto } from './dto/organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<OrganizationResponseDto[]> {
    return this.prisma.organization.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async count(): Promise<number> {
    return this.prisma.organization.count();
  }

  async findOne(id: number): Promise<OrganizationResponseDto> {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    return organization;
  }

  async create(createOrganizationDto: CreateOrganizationDto): Promise<OrganizationResponseDto> {
    return this.prisma.organization.create({
      data: createOrganizationDto,
    });
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto): Promise<OrganizationResponseDto> {
    // Check if organization exists
    await this.findOne(id);

    return this.prisma.organization.update({
      where: { id },
      data: updateOrganizationDto,
    });
  }

  async remove(id: number): Promise<void> {
    // Check if organization exists
    await this.findOne(id);

    await this.prisma.organization.delete({
      where: { id },
    });
  }
} 