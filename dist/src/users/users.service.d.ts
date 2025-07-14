import { PrismaService } from '@/common/prisma/prisma.service';
import { UpdateUserDto, UserResponseDto } from './dto/user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<UserResponseDto>;
    findByEmail(email: string): Promise<UserResponseDto>;
    update(id: string, updateUserDto: UpdateUserDto, currentUser: any): Promise<UserResponseDto>;
    findAll(currentUser: any): Promise<UserResponseDto[]>;
    delete(id: string, currentUser: any): Promise<void>;
    getCount(currentUser: any): Promise<number>;
}
