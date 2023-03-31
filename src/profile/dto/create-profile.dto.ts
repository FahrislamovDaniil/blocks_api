import { CreateUserDto } from "src/user/dto/create-user.dto";

/**
 * Data Transfer Object для сущности профиляы
 */
export class CreateProfileDto {
    readonly firstName: string;
    readonly lastName: string;
    readonly phoneNumber: string;
    readonly about: string;
    readonly user: CreateUserDto
}