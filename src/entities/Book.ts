// src/entities/Book.ts
import { Entity, PrimaryGeneratedColumn, Column, Unique, PrimaryColumn } from 'typeorm';

@Entity()
@Unique(['isbn'])
export class Book {

    @Column()
    title!: string;

    @Column()
    author!: string;

    @PrimaryColumn()
    isbn!: string;

    @Column()
    quantity!: number;

    @Column({ nullable: true })
    shelf_location!: string;
}
