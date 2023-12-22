// src/entities/Borrows.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Book } from './Book';
import { Borrower } from './Borrower';

@Entity()
export class Borrows {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Book)
    @JoinColumn({ name: 'isbn' })
    book!: Book;

    @ManyToOne(() => Borrower)
    @JoinColumn({ name: 'borrower_id' })
    borrower!: Borrower;

    @Column()
    checkout_date!: Date;

    @Column({ nullable: false })
    due_date!: Date;
}
