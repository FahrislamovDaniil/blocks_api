import { Base } from "src/entity_utils/base.entity";
import { Column, Entity } from "typeorm";

/**
 * Сущность, описывающая файл в базе данных
 */
@Entity('file')
export class FileDB extends Base {
    @Column({ nullable: false, unique: true })
    path: string;

    @Column({ name: 'essence_table', nullable: true })
    essenceTable: string;

    @Column({ name: 'essence_id', nullable: true })
    essenceId: number;
}