/**
 * Data Transfer Object для редактирования сущности файла
 */
export class UpdateFileDto {
    readonly id: number;
    readonly essenceTable: string;
    readonly essenceId: number;
}