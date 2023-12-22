// src/entities/Borrower.ts
import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn } from 'typeorm';

@Entity()
@Unique(['email'])
export class Borrower {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    email!: string;

    @CreateDateColumn()
    registered_date!: Date;
}
