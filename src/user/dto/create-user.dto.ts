/**
 * Data Transfer Object для сущности пользователя
 */
export class CreateUserDto {
    readonly login: string;
    readonly password: string;
}