import { Exclude } from "class-transformer";
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Exclude({
        toPlainOnly: true
    })
    @CreateDateColumn({ select: false })
    createdAt!: Date;

    @UpdateDateColumn({ select: true })
    updatedAt!: Date
}
