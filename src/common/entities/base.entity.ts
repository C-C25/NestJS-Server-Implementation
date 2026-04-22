import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn({ select: false })
    createdAt!: Date;

    @UpdateDateColumn({ select: true })
    updatedAt!: Date
}
