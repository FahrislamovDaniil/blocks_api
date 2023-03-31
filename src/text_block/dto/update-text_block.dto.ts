/**
 * Data Transfer Object для редактирования сущности текстового блока
 */
export class UpdateTextBlockDto {
    readonly id: number;
    readonly name: string;
    readonly title: string;
    readonly text: string;
    readonly group: string;
}