/**
 * Data Transfer Object для редактирования сущности пользователя
 */
export class UpdateUserDto {
    readonly id: number;
    readonly login: string;
    readonly password: string;
}