import { Base } from "src/entity_utils/base.entity";
import { Column, Entity } from "typeorm";

/**
 * Сущность, описывающая текстовый блок в базе данных
 */
@Entity('text_block')
export class TextBlock extends Base {
    @Column({ unique: true, nullable: false })
    name: string;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false })
    image: string;

    @Column({ nullable: false })
    text: string;

    @Column({ nullable: false })
    group: string;
}