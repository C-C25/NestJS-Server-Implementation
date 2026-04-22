import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";

@Entity('User')
export class UsersEntity extends BaseEntity{
    @Column()
    email!: string;

    @Column()
    password!: string;
    
    @Column()
    nickname!: string;
}