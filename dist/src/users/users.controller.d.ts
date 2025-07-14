import { UsersService } from './users.service';
import { UpdateUserDto, UserResponseDto } from './dto/user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getCurrentUser(req: any): Promise<UserResponseDto>;
    findAll(req: any): Promise<UserResponseDto[]>;
    getCount(req: any): Promise<number>;
    findById(id: string): Promise<UserResponseDto>;
    update(id: string, updateUserDto: UpdateUserDto, req: any): Promise<UserResponseDto>;
    delete(id: string, req: any): Promise<void>;
}
