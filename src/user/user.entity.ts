import { Base } from "src/entity_utils/base.entity";
import { Profile } from "src/profile/profile.entity";
import { Column, Entity, OneToOne } from "typeorm";
import { Role } from "./role";

/**
 * Сущность, описывающая пользователя в базе данных
 */
@Entity('user')
export class User extends Base {
    @Column({ unique: true, nullable: false })
    login: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: false })
    role: Role;

    @OneToOne(() => Profile)
    profile: Profile;
}