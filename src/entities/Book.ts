// src/entities/Book.ts
import { Entity, PrimaryGeneratedColumn, Column, Unique, PrimaryColumn } from 'typeorm';

@Entity()
@Unique(['isbn'])
export class Book {

    @Column({ nullable: false })
    title!: string;

    @Column({ nullable: false })
    author!: string;

    @Column({ nullable: false })
    @PrimaryColumn()
    isbn!: string;

    @Column({ default: 0 })
    quantity!: number;

    @Column({ nullable: true })
    shelf_location!: string;
}
