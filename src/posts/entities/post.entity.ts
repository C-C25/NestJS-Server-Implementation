import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { UsersEntity } from "../../users/entities/users.entity";

@Entity('Posts')
export class PostsEntity extends BaseEntity {
    @ManyToOne(() => UsersEntity, (user) => user.posts, {
        nullable: false,
    })
    auhtor!: UsersEntity;

    @Column({ type: 'varchar' })
    title!: string;

    @Column({ type: 'varchar' })
    content!: string;

    @Column({ default: 0 })
    likeCount: number = 0;

    @Column({ default: 0 })
    commentCount: number = 0;
}
