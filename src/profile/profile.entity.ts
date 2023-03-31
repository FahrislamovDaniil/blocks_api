import { Base } from "src/entity_utils/base.entity";
import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

/**
 * Сущность, описывающая профиль в базе данных
 */
@Entity('profile')
export class Profile extends Base {
    @Column({ name: 'first_name', nullable: false })
    firstName: string;

    @Column({ name: 'last_name', nullable: false })
    lastName: string;

    @Column({ name: 'phone_number', nullable: true})
    phoneNumber: string;

    @Column({ nullable: true })
    about: string;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;
}