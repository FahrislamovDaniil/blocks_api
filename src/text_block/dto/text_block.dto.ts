/**
 * Data Transfer Object для сущности текстового блока
 */
export class TextBlockDto {
    readonly name: string;
    readonly title: string;
    readonly text: string;
    readonly group: string;
}