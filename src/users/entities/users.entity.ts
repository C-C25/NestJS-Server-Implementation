import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { PostsEntity } from "../../posts/entities/post.entity";

@Entity('Users')
export class UsersEntity extends BaseEntity {
    @Column({ unique: true, nullable: false })
    email!: string;

    @Column({ select: false })
    password!: string;

    @Column({ unique: true, nullable: false })
    nickname!: string;

    @OneToMany(() => PostsEntity, (post) => post.auhtor)
    posts!: PostsEntity[];
}