/**
 * Data Transfer Object для редактирования сущности профиля
 */
export class UpdateProfileDto {
    readonly id: number;
    readonly firstName: string;
    readonly lastName: string;
    readonly phoneNumber: string;
    readonly about: string;
    readonly user: number
}